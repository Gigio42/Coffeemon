import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
  Easing,
  Image,
  ActivityIndicator,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Socket } from 'socket.io-client';
import { BattleState } from '../../types';
import { useMatchmaking } from '../../hooks/useMatchmaking';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { giveInitialItems, getPlayerItems, getItemIcon, getItemColor, Item } from '../../api/itemsService';
import { prefetchPalette, useDynamicPalette, type Palette } from '../../utils/colorPalette';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';

import CoffeemonSelectionModal from '../../components/CoffeemonSelectionModal';
import CoffeemonCard from '../../components/CoffeemonCard';
import SlidingBottomSheet, { type SlidingBottomSheetSection } from '../../components/SlidingBottomSheet';

import { styles } from './styles';
import { pixelArt } from '../../theme/pixelArt';
import { getTypeColor } from '../../components/CoffeemonCard/styles';
import QRScanner from './QRScanner';

const CARD_WIDTH = 110;
const CARD_HORIZONTAL_MARGIN = pixelArt.spacing.xs;
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_HORIZONTAL_MARGIN * 2;
const SWIPE_THRESHOLD = CARD_TOTAL_WIDTH * 0.4;
const SWIPE_VELOCITY_THRESHOLD = 0.4;
const CARD_ANIMATION_DURATION = 680;
const CAROUSEL_BASE_OFFSET = CARD_TOTAL_WIDTH * 0.25;
const CENTER_CARD_EXTRA_OFFSET = CARD_TOTAL_WIDTH * 0.15;
const LEFT_CARD_EXTRA_OFFSET = CARD_TOTAL_WIDTH * 0.2;

const NOISE_SOURCE = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIUlEQVR42mP8z8AARMAw///MIMcAIeyMBIgiIYlQAgB0Sw4DsxMyYAAAAASUVORK5CYII=',
} as const;

const LIMONETO_BACKGROUND = require('../../../assets/backgrounds/limonetoback.png');
const JASMINELLE_BACKGROUND = require('../../../assets/backgrounds/jasminiback.png');
const MAPRION_BACKGROUND = require('../../../assets/backgrounds/maprionback.png');
const EMBERLY_BACKGROUND = require('../../../assets/backgrounds/emberlyback.png');
const GINGERLYNN_BACKGROUND = require('../../../assets/backgrounds/gingerlynnback.png');
const ALMONDINO_BACKGROUND = require('../../../assets/backgrounds/almondinoback.png');
const BOT_MIA_ICON = require('../../../assets/bots/mia.png');
const BOT_JOHN_ICON = require('../../../assets/bots/john.png');

const COFFEEMON_BACKGROUNDS: Record<string, ImageSourcePropType> = {
  jasminelle: JASMINELLE_BACKGROUND,
  limoneto: LIMONETO_BACKGROUND,
  limonetto: LIMONETO_BACKGROUND,
  maprion: MAPRION_BACKGROUND,
  emberly: EMBERLY_BACKGROUND,
  gingerlynn: GINGERLYNN_BACKGROUND,
  almondino: ALMONDINO_BACKGROUND,
};

const DEFAULT_BACKGROUND_PALETTE: Palette = {
  light: '#F5F5F5',
  dark: '#2C1810',
  accent: '#8B4513',
};

type RGB = { r: number; g: number; b: number };

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace('#', '');
  const normalized = cleaned.length === 3
    ? cleaned.split('').map((char) => char + char).join('')
    : cleaned;

  if (normalized.length !== 6) {
    return null;
  }

  const value = parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toChannel = (channel: number) => channel.toString(16).padStart(2, '0');
  return `#${toChannel(Math.round(r))}${toChannel(Math.round(g))}${toChannel(Math.round(b))}`;
}

function mixColors(colorA: string, colorB: string, ratio: number): string {
  const mix = clamp01(ratio);
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);

  if (!rgbA || !rgbB) {
    return colorA;
  }

  const blended: RGB = {
    r: rgbA.r + (rgbB.r - rgbA.r) * mix,
    g: rgbA.g + (rgbB.g - rgbA.g) * mix,
    b: rgbA.b + (rgbB.b - rgbA.b) * mix,
  };

  return rgbToHex(blended);
}

function lightenColor(color: string, amount: number): string {
  return mixColors(color, '#ffffff', amount);
}

function darkenColor(color: string, amount: number): string {
  return mixColors(color, '#000000', amount);
}

type GradientPalette = {
  base: string;
  primary: [string, string, string, string];
  accent: [string, string, string];
  highlight: [string, string];
};

function buildGradientPalette(palette: Palette): GradientPalette {
  const base = darkenColor(palette.dark, 0.6);
  return {
    base,
    primary: [
      darkenColor(palette.dark, 0.45),
      palette.dark,
      mixColors(palette.dark, palette.accent, 0.4),
      lightenColor(palette.light, 0.25),
    ],
    accent: [
      darkenColor(palette.accent, 0.35),
      palette.accent,
      lightenColor(palette.light, 0.4),
    ],
    highlight: [
      lightenColor(palette.light, 0.3),
      lightenColor(palette.light, 0.6),
    ],
  };
}

// Componente inline para o carrossel do time
function TeamCarouselInline({
  coffeemons,
  onToggleParty: onTogglePartyProp,
  partyLoading,
  onScrollInterruption,
  onActiveCoffeemonChange,
}: {
  coffeemons: PlayerCoffeemon[];
  onToggleParty: (coffeemon: PlayerCoffeemon) => void;
  partyLoading: number | null;
  onScrollInterruption?: (interrupting: boolean) => void;
  onActiveCoffeemonChange?: (coffeemon: PlayerCoffeemon | null) => void;
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

  React.useEffect(() => {
    if (coffeemons.length === 0) {
      onActiveCoffeemonChange?.(null);
      return;
    }

    const centerIndex = Math.floor(displayOrder.length / 2);
    const activeIndex = displayOrder[centerIndex];
    const active = typeof activeIndex === 'number' ? coffeemons[activeIndex] : undefined;

    if (active) {
      onActiveCoffeemonChange?.(active);
    }
  }, [coffeemons, displayOrder, onActiveCoffeemonChange]);

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
        const translateXTarget =
          (position - centerPosition) * (CARD_TOTAL_WIDTH * 0.62) -
          CAROUSEL_BASE_OFFSET -
          (position === centerPosition ? CENTER_CARD_EXTRA_OFFSET : 0) -
          (position < centerPosition ? LEFT_CARD_EXTRA_OFFSET : 0);

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
                      learnedMoves: coffeemon.learnedMoves,
                      coffeemon: {
                        id: coffeemon.coffeemon.id,
                        name: coffeemon.coffeemon.name,
                        types: coffeemon.coffeemon.types,
                        baseHp: coffeemon.coffeemon.baseHp,
                        baseAttack: coffeemon.coffeemon.baseAttack,
                        baseDefense: coffeemon.coffeemon.baseDefense,
                        baseSpeed: coffeemon.coffeemon.baseSpeed,
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
  const [introLoading, setIntroLoading] = useState(true);
  const [qrScannerVisible, setQrScannerVisible] = useState<boolean>(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState<boolean>(false);
  const [isCarouselInteracting, setCarouselInteracting] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTab, setSheetTab] = useState<'backpack' | 'items' | 'bots'>('backpack');
  const [activeCoffeemon, setActiveCoffeemon] = useState<PlayerCoffeemon | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [palettesReady, setPalettesReady] = useState(false);
  const [debugMenuVisible, setDebugMenuVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const ensuredPalettesRef = useRef<Set<number>>(new Set());
  const initialPalettesEnsuredRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Carregar itens do jogador
  useEffect(() => {
    const loadItems = async () => {
      try {
        if (token) {
          const playerItems = await getPlayerItems(token);
          setItems(playerItems);
        }
      } catch (error) {
        console.error('[Matchmaking] Error loading items:', error);
      }
    };

    loadItems();
  }, [token]);

  // Hook de Matchmaking (Socket, status, logs)
  const { matchStatus, log, findMatch, findBotMatch } =
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
    addMissingMoves,
    initialized: coffeemonsInitialized,
  } = useCoffeemons({
    token,
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
    handleCloseQRScanner();
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

  useEffect(() => {
    if (partyMembers.length === 0) {
      setActiveCoffeemon(null);
      return;
    }

    const exists = activeCoffeemon && partyMembers.some((member) => member.id === activeCoffeemon.id);
    if (!exists) {
      setActiveCoffeemon(partyMembers[0] ?? null);
    }
  }, [partyMembers, activeCoffeemon]);

  const handleActiveCoffeemonChange = useCallback((coffeemon: PlayerCoffeemon | null) => {
    setActiveCoffeemon(coffeemon);
  }, []);

  const handleGiveAllCoffeemonsDebug = useCallback(async () => {
    try {
      await giveAllCoffeemons();
      Alert.alert('Success', 'All Coffeemons added to your collection!');
      setDebugMenuVisible(false);
    } catch (error) {
      console.error('Failed to give all coffeemons:', error);
      Alert.alert('Error', 'Failed to give coffeemons. Please try again.');
    }
  }, [giveAllCoffeemons]);

  const handleAddMissingMovesDebug = useCallback(async () => {
    try {
      await addMissingMoves();
      setDebugMenuVisible(false);
    } catch (error) {
      console.error('Failed to add missing moves:', error);
      Alert.alert('Error', 'Failed to add moves. Please try again.');
    }
  }, [addMissingMoves]);

  const handleGiveItems = useCallback(async () => {
    try {
      await giveInitialItems(token);
      // Recarregar itens após adicionar
      const updatedItems = await getPlayerItems(token);
      setItems(updatedItems);
      Alert.alert('Success', 'Items added to your inventory!');
      setDebugMenuVisible(false);
    } catch (error) {
      console.error('Failed to give items:', error);
      Alert.alert('Error', 'Failed to give items. Please try again.');
    }
  }, [token]);

  // Fallback palette based on Coffeemon's primary type
  const fallbackPalette = useMemo(() => {
    if (!activeCoffeemon) {
      return DEFAULT_BACKGROUND_PALETTE;
    }
    return getTypeColor(activeCoffeemon.coffeemon.types?.[0], activeCoffeemon.coffeemon.name);
  }, [activeCoffeemon]);

  const activeVariant = useMemo(
    () => (activeCoffeemon ? getVariantForStatusEffects(activeCoffeemon.statusEffects, 'default') : 'default'),
    [activeCoffeemon?.statusEffects],
  );

  const activeAsset = useMemo(
    () => (activeCoffeemon ? getCoffeemonImage(activeCoffeemon.coffeemon.name, activeVariant) : null),
    [activeCoffeemon?.coffeemon.name, activeVariant],
  );

  const palette = useDynamicPalette(activeAsset, fallbackPalette);
  const gradientPalette = useMemo(() => buildGradientPalette(palette), [palette]);

  useEffect(() => {
    if (!coffeemonsInitialized) {
      setPalettesReady(false);
      ensuredPalettesRef.current.clear();
      initialPalettesEnsuredRef.current = false;
      return;
    }

    const coffeemonList = [...partyMembers, ...availableCoffeemons].filter(
      (coffeemon) => !ensuredPalettesRef.current.has(coffeemon.id),
    );

    if (coffeemonList.length === 0) {
      if (!initialPalettesEnsuredRef.current) {
        initialPalettesEnsuredRef.current = true;
        setPalettesReady(true);
      }
      return;
    }

    let cancelled = false;

    const settlePalettes = async () => {
      try {
        await Promise.allSettled(
          coffeemonList.map(async (coffeemon) => {
            const variant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
            const assetModule = getCoffeemonImage(coffeemon.coffeemon.name, variant);
            const fallback = getTypeColor(coffeemon.coffeemon.types?.[0], coffeemon.coffeemon.name);
            await prefetchPalette(assetModule, fallback);
          }),
        );
        if (!cancelled) {
          coffeemonList.forEach((coffeemon) => ensuredPalettesRef.current.add(coffeemon.id));
          if (!initialPalettesEnsuredRef.current) {
            initialPalettesEnsuredRef.current = true;
            setPalettesReady(true);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('[Matchmaking] Failed to prefetch palettes', error);
          if (!initialPalettesEnsuredRef.current) {
            initialPalettesEnsuredRef.current = true;
            setPalettesReady(true);
          }
        }
      }
    };

    if (!initialPalettesEnsuredRef.current) {
      setPalettesReady(false);
    }

    settlePalettes();

    return () => {
      cancelled = true;
    };
  }, [coffeemonsInitialized, partyMembers, availableCoffeemons]);

  const activeBackground = useMemo(() => {
    const normalizedName = activeCoffeemon?.coffeemon?.name?.trim().toLowerCase();
    if (!normalizedName) return null;
    return COFFEEMON_BACKGROUNDS[normalizedName] ?? null;
  }, [activeCoffeemon?.coffeemon?.name]);

  const primaryParallax = useMemo(
    () => scrollY.interpolate({
      inputRange: [0, 600],
      outputRange: [0, -120],
      extrapolate: 'clamp',
    }),
    [scrollY],
  );

  const accentParallax = useMemo(
    () => scrollY.interpolate({
      inputRange: [0, 600],
      outputRange: [0, -80],
      extrapolate: 'clamp',
    }),
    [scrollY],
  );

  const highlightParallax = useMemo(
    () => scrollY.interpolate({
      inputRange: [0, 600],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    }),
    [scrollY],
  );

  const grainParallax = useMemo(
    () => scrollY.interpolate({
      inputRange: [0, 600],
      outputRange: [0, -20],
      extrapolate: 'clamp',
    }),
    [scrollY],
  );

  // Selecionar cenário aleatório sempre que carregar a página

  const showContent = !introLoading && coffeemonsInitialized && palettesReady;
  const sheetSections: SlidingBottomSheetSection[] = useMemo(() => {
    const inventoryCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const backpackContent = (
      <View style={styles.sheetSectionContent}>
        {availableCoffeemons.length === 0 ? (
          <Text style={styles.sheetEmptyText}>Capture mais Coffeemons</Text>
        ) : (
          <View style={styles.sheetCardsGrid}>
            {availableCoffeemons.map((pc) => (
              <View key={pc.id} style={styles.sheetCardWrapper}>
                <View style={styles.sheetCardScaler}>
                  <CoffeemonCard
                    coffeemon={pc}
                    onToggleParty={toggleParty}
                    variant="small"
                    isLoading={partyLoading === pc.id}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );

    const itemsContent = (
      <View style={styles.sheetSectionContent}>
        {items.length === 0 ? (
          <Text style={styles.sheetEmptyText}>Nenhum item disponível</Text>
        ) : (
          <View style={styles.sheetItemsList}>
            {items.map((item) => {
              const icon = getItemIcon(item.id);
              const effectType = item.effects[0]?.type || 'heal';
              const color = getItemColor(effectType);

              return (
                <View key={item.id} style={[styles.sheetItemCard, { borderColor: color }]}
                >
                  <View style={styles.sheetItemHeader}>
                    <Text style={styles.sheetItemEmoji}>{icon}</Text>
                    <View style={[styles.sheetItemBadge, { backgroundColor: color }]}
                    >
                      <Text style={styles.sheetItemBadgeText}>{item.quantity}</Text>
                    </View>
                  </View>
                  <Text style={styles.sheetItemName} numberOfLines={2}>{item.name}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );

    const botsContent = (
      <View style={styles.sheetSectionContent}>
        <View style={styles.sheetBotsList}>
          <TouchableOpacity
            style={styles.sheetBotButton}
            onPress={() => handleFindBotMatch('jessie')}
            disabled={partyMembers.length === 0}
          >
            <Image source={BOT_MIA_ICON} style={styles.sheetBotImage} resizeMode="cover" />
            <View style={styles.sheetBotContent}>
              <Text style={styles.sheetBotLabel}>Mia</Text>
              <Text style={styles.sheetBotDescription}>Treino inicial com Mia</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetBotButton}
            onPress={() => handleFindBotMatch('pro-james')}
            disabled={partyMembers.length === 0}
          >
            <Image source={BOT_JOHN_ICON} style={styles.sheetBotImage} resizeMode="cover" />
            <View style={styles.sheetBotContent}>
              <Text style={styles.sheetBotLabel}>John</Text>
              <Text style={styles.sheetBotDescription}>Desafio avançado com John</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );

    const sections: Record<typeof sheetTab, SlidingBottomSheetSection> = {
      backpack: {
        key: 'backpack',
        title: `Mochila (${availableCoffeemons.length})`,
        content: backpackContent,
      },
      items: {
        key: 'items',
        title: `Itens (${inventoryCount})`,
        content: itemsContent,
      },
      bots: {
        key: 'bots',
        title: 'Bots Disponíveis',
        content: botsContent,
      },
    };

    return [sections[sheetTab]];
  }, [availableCoffeemons, getItemColor, getItemIcon, handleFindBotMatch, items, partyLoading, partyMembers.length, sheetTab, toggleParty]);

  const showBackpackButton = useMemo(() => availableCoffeemons.length > 0 || items.length > 0, [availableCoffeemons.length, items.length]);

  const handleOpenSheet = useCallback((tab: typeof sheetTab) => {
    setSheetTab(tab);
    setSheetVisible(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  return (
    <View style={styles.fullScreenContainer}>
      <View
        pointerEvents="none"
        style={[styles.dynamicBackground, { backgroundColor: '#FFFFFF' }]}
      >
        <Animated.Image
          source={NOISE_SOURCE}
          resizeMode="repeat"
          style={[styles.grainOverlay, { transform: [{ translateY: grainParallax }], opacity: 0.03 }]}
        />
      </View>
      <SafeAreaView style={styles.container} edges={['top']}>
        {!showContent ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff9f0" />
            <Text style={styles.loadingText}>Preparando matchmaking...</Text>
          </View>
        ) : (
          <>
            {/* Botão de voltar flutuante */}
            {onNavigateToEcommerce && (
              <TouchableOpacity
                style={styles.floatingBackButton}
                onPress={onNavigateToEcommerce}
              >
                <Text style={styles.floatingBackButtonText}>←</Text>
              </TouchableOpacity>
            )}

            {/* Debug Menu */}
            <TouchableOpacity
              style={styles.debugMenuButton}
              onPress={() => setDebugMenuVisible(!debugMenuVisible)}
            >
              <Text style={styles.debugMenuIcon}>⋮</Text>
            </TouchableOpacity>

            {debugMenuVisible && (
              <View style={styles.debugMenuPopup}>
                <TouchableOpacity
                  style={styles.debugMenuItem}
                  onPress={handleGiveAllCoffeemonsDebug}
                >
                  <Text style={styles.debugMenuItemText}>Give All Coffeemons</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.debugMenuItem}
                  onPress={handleAddMissingMovesDebug}
                >
                  <Text style={styles.debugMenuItemText}>Add Missing Moves</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.debugMenuItem, styles.debugMenuItemLast]}
                  onPress={handleGiveItems}
                >
                  <Text style={styles.debugMenuItemText}>Give Items</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Status removido */}

            <View style={[styles.scrollView, styles.scrollContent]}>
              <View style={styles.teamCarouselSticky}>
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
                      onActiveCoffeemonChange={handleActiveCoffeemonChange}
                    />
                  )}
                </View>
              </View>

              <View style={styles.scrollBody} />
            </View>

            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[styles.bottomBarPill, styles.bottomBarPillLeft, !showBackpackButton && styles.bottomBarPillDisabled]}
                onPress={() => handleOpenSheet('backpack')}
                disabled={!showBackpackButton}
              >
                <Text style={styles.bottomBarPillLabel}>Mochila</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bottomBarPill, styles.bottomBarPillCenter, partyMembers.length === 0 && styles.bottomBarPillDisabled]}
                onPress={handleFindMatch}
                disabled={partyMembers.length === 0}
              >
                <Text style={styles.bottomBarPillLabel}>Start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bottomBarPill, styles.bottomBarPillRight, partyMembers.length === 0 && styles.bottomBarPillDisabled]}
                onPress={() => handleOpenSheet('bots')}
                disabled={partyMembers.length === 0}
              >
                <Text style={styles.bottomBarPillLabel}>Bots</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>

      {showContent && (
        <>
          <QRScanner
            visible={qrScannerVisible}
            token={token}
            onClose={handleCloseQRScanner}
            onSuccess={handleCoffeemonAdded}
          />

          <CoffeemonSelectionModal
            visible={selectionModalVisible}
            availableCoffeemons={availableCoffeemons}
            onSelectCoffeemon={handleSelectCoffeemon}
            onClose={handleCloseSelectionModal}
            partyLoading={partyLoading}
          />

          <SlidingBottomSheet
            visible={sheetVisible}
            sections={sheetSections}
            onClose={handleCloseSheet}
          />
        </>
      )}
    </View>
  );
}
