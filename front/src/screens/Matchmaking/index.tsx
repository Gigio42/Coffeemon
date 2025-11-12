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

// Componente inline para o carrossel do time
function TeamCarouselInline({ coffeemons, onToggleParty: onTogglePartyProp, partyLoading }: {
  coffeemons: PlayerCoffeemon[];
  onToggleParty: (coffeemon: PlayerCoffeemon) => void;
  partyLoading: number | null;
}) {
  // Ordem visual dos cards (posição 0 = esquerda, 1 = centro, 2 = direita)
  const [displayOrder, setDisplayOrder] = useState<number[]>(() => coffeemons.map((_, index) => index));
  const scaleValuesRef = React.useRef<Animated.Value[]>([]);
  const opacityValuesRef = React.useRef<Animated.Value[]>([]);

  // Inicializar arrays de animação
  const initializeAnimationArrays = React.useCallback(() => {
    scaleValuesRef.current = coffeemons.map(() => new Animated.Value(1));
    opacityValuesRef.current = coffeemons.map(() => new Animated.Value(1));
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

        const scale = distance === 0 ? 0.95 : distance === 1 ? 0.75 : 0.6; // Centro reduzido para 95%
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.3; // Opacidades reduzidas

        Animated.parallel([
          Animated.spring(scaleValuesRef.current[originalIndex], { toValue: scale, useNativeDriver: false }),
          Animated.spring(opacityValuesRef.current[originalIndex], { toValue: opacity, useNativeDriver: false }),
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

  const swapWithCenter = React.useCallback(
    (position: number) => {
      const centerPosition = Math.floor(displayOrder.length / 2);
      if (position === centerPosition || displayOrder.length < 2) {
        return;
      }

      const newOrder = [...displayOrder];
      const centerIndex = newOrder[centerPosition];
      newOrder[centerPosition] = newOrder[position];
      newOrder[position] = centerIndex;
      setDisplayOrder(newOrder);
    },
    [displayOrder]
  );

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;
        if (Math.abs(dx) > 30 || Math.abs(vx) > 0.5) {
          const direction = dx > 0 ? 0 : 2; // direita => posição esquerda (0) vem ao centro, esquerda => posição direita (2)
          if (displayOrder[direction] !== undefined) {
            swapWithCenter(direction);
          }
        }
      },
    })
  ).current;
  const centerPosition = Math.floor(displayOrder.length / 2);
  const getIsActive = (originalIndex: number) => displayOrder.indexOf(originalIndex) === centerPosition;

  return (
    <View style={styles.carouselContainer}>
      <View style={styles.carouselTrack} {...panResponder.panHandlers}>
        {displayOrder.map((originalIndex, position) => {
          const coffeemon = coffeemons[originalIndex];
          const isActive = position === centerPosition;

          // Verificações de segurança para arrays de animação
          const scaleValue = scaleValuesRef.current[originalIndex];
          const opacityValue = opacityValuesRef.current[originalIndex];

          if (!scaleValue || !opacityValue || !coffeemon) {
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
                    swapWithCenter(position);
                  }
                }}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    styles.carouselCard,
                    {
                      transform: [{ scale: scaleValue }],
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
      </View>

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
