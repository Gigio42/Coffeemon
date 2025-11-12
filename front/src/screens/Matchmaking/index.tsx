import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  Animated,
  PanResponder,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Socket } from 'socket.io-client';
import { BattleState } from '../../types';
import { getRandomScenario } from '../../utils/battleUtils';
import { useMatchmaking } from '../../hooks/useMatchmaking';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import { PlayerCoffeemon } from '../../api/coffeemonService';

import TeamSection from '../../components/TeamSection';
import CoffeemonSelectionModal from '../../components/CoffeemonSelectionModal';
import CoffeemonCard from '../../components/CoffeemonCard';

import { styles } from './styles';
import { pixelArt } from '../../theme/pixelArt';

const CARD_WIDTH = 110;
const CARD_HORIZONTAL_MARGIN = pixelArt.spacing.xs;
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_HORIZONTAL_MARGIN * 2;
const SWIPE_THRESHOLD = CARD_TOTAL_WIDTH * 0.4;
const SWIPE_VELOCITY_THRESHOLD = 0.4;
const CARD_ANIMATION_DURATION = 680;

// Componente inline para o carrossel do time
function TeamCarouselInline({
  coffeemons,
  onToggleParty: onTogglePartyProp,
  partyLoading,
  onScrollInterruption,
}: {
  coffeemons: PlayerCoffeemon[];
  onToggleParty: (coffeemon: PlayerCoffeemon) => void;
  partyLoading: number | null;
  onScrollInterruption?: (interrupting: boolean) => void;
}) {
  // Ordem visual dos cards (posição 0 = esquerda, 1 = centro, 2 = direita)
  const [displayOrder, setDisplayOrder] = useState<number[]>(() => coffeemons.map((_, index) => index));
  const scaleValuesRef = React.useRef<Animated.Value[]>([]);
  const opacityValuesRef = React.useRef<Animated.Value[]>([]);
  const translateYValuesRef = React.useRef<Animated.Value[]>([]);
  const translateXValuesRef = React.useRef<Animated.Value[]>([]);
  const accumulatedDxRef = React.useRef(0);
  const previousDxRef = React.useRef(0);
  const swipeTriggeredRef = React.useRef(false);

  // Inicializar arrays de animação
  const initializeAnimationArrays = React.useCallback(() => {
    scaleValuesRef.current = coffeemons.map(() => new Animated.Value(1));
    opacityValuesRef.current = coffeemons.map(() => new Animated.Value(1));
    translateYValuesRef.current = coffeemons.map(() => new Animated.Value(0));
    translateXValuesRef.current = coffeemons.map(() => new Animated.Value(0));
  }, [coffeemons.length]);

  // Atualizar arrays e ordem quando coffeemons muda
  React.useEffect(() => {
    initializeAnimationArrays();
    setDisplayOrder(coffeemons.map((_, index) => index));
  }, [coffeemons.length, initializeAnimationArrays]);

  const animateCards = React.useCallback(
    (order: number[]) => {
      const centerPosition = Math.floor(order.length / 2);
      coffeemons.forEach((_, originalIndex) => {
        if (originalIndex >= scaleValuesRef.current.length || originalIndex >= opacityValuesRef.current.length) {
          return;
        }

        const position = order.indexOf(originalIndex);
        if (position === -1) return; // Card não está na ordem atual

        const distance = Math.abs(position - centerPosition);

        const scale = distance === 0 ? 0.92 : distance === 1 ? 0.8 : 0.7;
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.4;
        const translateY = distance === 0 ? 0 : distance === 1 ? 16 : 26;
        const translateXTarget = (position - centerPosition) * (CARD_TOTAL_WIDTH * 0.62);

        scaleValuesRef.current[originalIndex]?.stopAnimation?.();
        opacityValuesRef.current[originalIndex]?.stopAnimation?.();
        translateYValuesRef.current[originalIndex]?.stopAnimation?.();
        translateXValuesRef.current[originalIndex]?.stopAnimation?.();

        Animated.parallel([
          Animated.timing(scaleValuesRef.current[originalIndex], {
            toValue: scale,
            duration: CARD_ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.8, 0.25, 1),
            useNativeDriver: false,
          }),
          Animated.timing(opacityValuesRef.current[originalIndex], {
            toValue: opacity,
            duration: CARD_ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.8, 0.25, 1),
            useNativeDriver: false,
          }),
          Animated.timing(translateYValuesRef.current[originalIndex], {
            toValue: translateY,
            duration: CARD_ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.8, 0.25, 1),
            useNativeDriver: false,
          }),
          Animated.timing(translateXValuesRef.current[originalIndex], {
            toValue: translateXTarget,
            duration: CARD_ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.8, 0.25, 1),
            useNativeDriver: false,
          }),
        ]).start();
      });
    },
    [coffeemons.length]
  );

  React.useEffect(() => {
    if (coffeemons.length > 0) {
      animateCards(displayOrder);
    }
  }, [coffeemons.length, displayOrder, animateCards]);
  const animateSwipe = React.useCallback(
    (direction: 'left' | 'right') => {
      setDisplayOrder((prev) => {
        if (prev.length <= 1) {
          return prev;
        }

        const newOrder = direction === 'left'
          ? [...prev.slice(1), prev[0]]
          : [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];

        animateCards(newOrder);
        return newOrder;
      });
    },
    [animateCards]
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return (
            displayOrder.length > 1 &&
            Math.abs(dx) > Math.abs(dy) &&
            Math.abs(dx) > 5
          );
        },
        onPanResponderGrant: () => {
          onScrollInterruption?.(true);
          accumulatedDxRef.current = 0;
          previousDxRef.current = 0;
          swipeTriggeredRef.current = false;
        },
        onPanResponderMove: (_, { dx }) => {
          if (displayOrder.length <= 1 || swipeTriggeredRef.current) {
            return;
          }

          const delta = dx - previousDxRef.current;
          previousDxRef.current = dx;

          accumulatedDxRef.current += delta;

          // Trigger swipe only once per gesture
          if (Math.abs(accumulatedDxRef.current) >= SWIPE_THRESHOLD) {
            const direction = accumulatedDxRef.current < 0 ? 'left' : 'right';
            animateSwipe(direction);
            swipeTriggeredRef.current = true;
          }
        },
        onPanResponderRelease: (_, { dx, vx }) => {
          if (displayOrder.length > 1 && !swipeTriggeredRef.current) {
            const shouldSwipeLeft = dx <= -SWIPE_THRESHOLD || vx <= -SWIPE_VELOCITY_THRESHOLD;
            const shouldSwipeRight = dx >= SWIPE_THRESHOLD || vx >= SWIPE_VELOCITY_THRESHOLD;

            if (shouldSwipeLeft) {
              animateSwipe('left');
            } else if (shouldSwipeRight) {
              animateSwipe('right');
            }
          }

          accumulatedDxRef.current = 0;
          previousDxRef.current = 0;
          swipeTriggeredRef.current = false;
          onScrollInterruption?.(false);
        },
        onPanResponderTerminate: () => {
          accumulatedDxRef.current = 0;
          previousDxRef.current = 0;
          swipeTriggeredRef.current = false;
          onScrollInterruption?.(false);
        },
      }),
    [animateSwipe, displayOrder.length]
  );
  const centerPosition = Math.floor(displayOrder.length / 2);
  const getIsActive = (originalIndex: number) => displayOrder.indexOf(originalIndex) === centerPosition;

  return (
    <View style={styles.carouselContainer}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.carouselTrack,
        ]}
      >
        {displayOrder.map((originalIndex, position) => {
          const coffeemon = coffeemons[originalIndex];
          const isActive = getIsActive(originalIndex);

          // Verificações de segurança para arrays de animação
          const scaleValue = scaleValuesRef.current[originalIndex];
          const translateYValue = translateYValuesRef.current[originalIndex];
          const translateXValue = translateXValuesRef.current[originalIndex];
          const opacityValue = opacityValuesRef.current[originalIndex];

          if (!scaleValue || !opacityValue || !translateXValue || !coffeemon) {
            return null; // Não renderizar se os valores não existirem
          }

          return (
            <View
              key={coffeemon.id}
              style={[
                styles.carouselCardWrapper,
                {
                  zIndex: isActive ? 300 : 200,
                  elevation: isActive ? 8 : 2,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.carouselCard}
                onPress={() => {
                  if (!isActive) {
                    const direction: 'left' | 'right' =
                      position < centerPosition ? 'right' : 'left';
                    animateSwipe(direction);
                  }
                }}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    styles.carouselCard,
                    {
                      transform: [
                        { translateX: translateXValue ?? 0 },
                        { translateY: translateYValue ?? 0 },
                        { scale: scaleValue },
                      ],
                      opacity: opacityValue,
                    },
                  ]}
                >
                  <CoffeemonCard
                    coffeemon={{
                      id: coffeemon.id,
                      hp: coffeemon.hp,
                      attack: coffeemon.attack,
                      defense: coffeemon.defense,
                      level: coffeemon.level,
                      experience: coffeemon.experience,
                      isInParty: true,
                      coffeemon: {
                        id: coffeemon.coffeemon.id,
                        name: coffeemon.coffeemon.name,
                        type: 'floral',
                      },
                    }}
                    onToggleParty={async () => {
                      if (!isActive) {
                        return;
                      }
                      await Promise.resolve(onTogglePartyProp(coffeemon));
                    }}
                    variant="large"
                    isLoading={partyLoading === coffeemon.id}
                    disabled={!isActive}
                  />
                  {/* Star indicator removed as per request */}
                </Animated.View>
              </TouchableOpacity>
            </View>
          );
        })}
      </Animated.View>

      {/* Indicadores removidos conforme solicitado */}
    </View>
  );
}

interface MatchmakingScreenProps {
  token: string;
  playerId: number;
  onNavigateToLogin: () => void;
  onNavigateToEcommerce?: () => void;
  onNavigateToBattle: (
    battleId: string,
    battleState: BattleState,
    socket: Socket
  ) => void;
}

export default function MatchmakingScreen({
  token,
  playerId,
  onNavigateToLogin,
  onNavigateToEcommerce,
  onNavigateToBattle,
}: MatchmakingScreenProps) {
  const [qrScannerVisible, setQrScannerVisible] = useState<boolean>(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState<boolean>(false);
  const [isCarouselInteracting, setCarouselInteracting] = useState(false);

  // Hook de Matchmaking (Socket, status, logs)
  const { matchStatus, log, findMatch, findBotMatch, handleLogout } =
    useMatchmaking({
      token,
      playerId,
      onNavigateToLogin,
      onNavigateToBattle,
    });

  // Hook de Coffeemons (lista, party, loading)
  const {
    loading,
    partyLoading,
    partyMembers,
    availableCoffeemons,
    fetchCoffeemons,
    toggleParty,
    giveAllCoffeemons,
  } = useCoffeemons({
    token,
    onLog: (msg) => console.log('Coffeemons:', msg),
  });

  // Handlers
  function handleFindMatch() {
    if (partyMembers.length === 0) {
      Alert.alert(
        'Time Vazio',
        'Você precisa ter pelo menos 1 Coffeemon no seu time antes de procurar uma partida!'
      );
      return;
    }
    findMatch();
  }

  function handleFindBotMatch(botProfileId: string) {
    if (partyMembers.length === 0) {
      Alert.alert(
        'Time Vazio',
        'Você precisa ter pelo menos 1 Coffeemon no seu time antes de lutar!'
      );
      return;
    }
    findBotMatch(botProfileId);
  }

  function handleOpenQRScanner() {
    setQrScannerVisible(true);
  }

  function handleCloseQRScanner() {
    setQrScannerVisible(false);
  }

  function handleCoffeemonAdded() {
    fetchCoffeemons();
  }

  function handleOpenSelectionModal() {
    setSelectionModalVisible(true);
  }

  function handleCloseSelectionModal() {
    setSelectionModalVisible(false);
  }

  async function handleSelectCoffeemon(coffeemon: PlayerCoffeemon) {
    await toggleParty(coffeemon);
    setSelectionModalVisible(false);
  }

  // Selecionar cenário aleatório sempre que carregar a página
  const currentScenario = React.useMemo(() => getRandomScenario(), []);

  return (
    <View style={styles.fullScreenContainer}>
      <ImageBackground
        source={currentScenario}
        style={styles.backgroundContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          style={styles.gradientContainer}
        >
          <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Botão de voltar flutuante */}
            {onNavigateToEcommerce && (
              <TouchableOpacity
                style={styles.floatingBackButton}
                onPress={onNavigateToEcommerce}
              >
                <Text style={styles.floatingBackButtonText}>←</Text>
              </TouchableOpacity>
            )}

            {matchStatus && (
              <View style={styles.statusCardWrapper}>
                <View style={styles.statusCardOutline} />
                <View style={styles.statusCardShape} />
                <View style={styles.statusCardContent}>
                  <Text style={styles.statusText}>{matchStatus}</Text>
                </View>
              </View>
            )}

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              scrollEnabled={!isCarouselInteracting}
            >
          {/* Seção de Times */}
          <View style={styles.teamsSection}>
            {/* Carrossel do Time - 3 cards centralizados com animação */}
            <View style={styles.teamColumn}>
              <Text style={styles.teamColumnTitle}>{`Meu Time (${partyMembers.length}/3)`}</Text>

              {partyMembers.length === 0 ? (
                <Text style={styles.teamEmptyMessage}>Adicione Coffeemons ao seu time</Text>
              ) : (
                <TeamCarouselInline
                  coffeemons={partyMembers}
                  onToggleParty={toggleParty}
                  partyLoading={partyLoading}
                  onScrollInterruption={setCarouselInteracting}
                />
              )}
            </View>

            <TeamSection
              title={`Disponíveis (${availableCoffeemons.length})`}
              coffeemons={availableCoffeemons}
              loading={loading}
              emptyMessage="Capture mais Coffeemons"
              onToggleParty={toggleParty}
              partyLoading={partyLoading}
              variant="horizontal"
            />

          </View>

        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={handleOpenQRScanner}
            accessibilityLabel="Escanear QR Code"
          >
            <Text style={styles.bottomBarEmoji}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBarButton, loading && styles.bottomBarButtonDisabled]}
            onPress={giveAllCoffeemons}
            disabled={loading}
            accessibilityLabel="Capturar todos os Coffeemons"
          >
            <Text style={styles.bottomBarEmoji}>{loading ? '⏳' : '🎁'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBarButton, partyMembers.length === 0 && styles.bottomBarButtonDisabled]}
            onPress={handleFindMatch}
            disabled={partyMembers.length === 0}
            accessibilityLabel="Partida online"
          >
            <Text style={styles.bottomBarEmoji}>🎮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBarButton, partyMembers.length === 0 && styles.bottomBarButtonDisabled]}
            onPress={() => handleFindBotMatch('jessie')}
            disabled={partyMembers.length === 0}
            accessibilityLabel="Desafio Jessie"
          >
            <Text style={styles.bottomBarEmoji}>👾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBarButton, partyMembers.length === 0 && styles.bottomBarButtonDisabled]}
            onPress={() => handleFindBotMatch('pro-james')}
            disabled={partyMembers.length === 0}
            accessibilityLabel="Desafio James"
          >
            <Text style={styles.bottomBarEmoji}>🤖</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={handleLogout}
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.bottomBarEmoji}>🚪</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
    </ImageBackground>

      <CoffeemonSelectionModal
        visible={selectionModalVisible}
        availableCoffeemons={availableCoffeemons}
        onSelectCoffeemon={handleSelectCoffeemon}
        onClose={handleCloseSelectionModal}
        partyLoading={partyLoading}
      />
    </View>
  );
}
