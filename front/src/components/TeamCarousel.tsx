import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { getCoffeemonImageSource } from '../api/coffeemonService';
import { styles } from '../screens/Matchmaking/styles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 120;
const CARD_HEIGHT = 120;
const SPACING = 10;

interface TeamCarouselProps {
  title: string;
  coffeemons: any[];
  loading: boolean;
  emptyMessage: string;
  onToggleParty: (coffeemon: any) => void;
  partyLoading: number | null;
  showAddButton?: boolean;
  onAddCoffeemon?: () => void;
}

export default function TeamCarousel({
  title,
  coffeemons,
  loading,
  emptyMessage,
  onToggleParty,
  partyLoading,
  showAddButton,
  onAddCoffeemon,
}: TeamCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(1, coffeemons.length - 1)); // Começar no meio, mas ajustar se há poucos coffeemons

  // Recriar arrays de animação quando coffeemons muda
  const scaleValues = useRef(coffeemons.map(() => new Animated.Value(1))).current;
  const opacityValues = useRef(coffeemons.map(() => new Animated.Value(1))).current;

  // Atualizar arrays quando coffeemons muda
  React.useEffect(() => {
    // Recriar arrays com o novo tamanho
    scaleValues.splice(0, scaleValues.length, ...coffeemons.map(() => new Animated.Value(1)));
    opacityValues.splice(0, opacityValues.length, ...coffeemons.map(() => new Animated.Value(1)));

    // Ajustar activeIndex se necessário
    if (activeIndex >= coffeemons.length) {
      setActiveIndex(Math.max(0, coffeemons.length - 1));
    }
  }, [coffeemons.length]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Reset pan
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Limitar movimento horizontal
        const maxMove = CARD_WIDTH / 2;
        const moveX = Math.max(-maxMove, Math.min(maxMove, gestureState.dx));
        pan.setValue({ x: moveX, y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;

        // Se arrastou suficiente ou velocidade alta, mudar card ativo
        if (Math.abs(dx) > CARD_WIDTH / 4 || Math.abs(vx) > 0.5) {
          const direction = dx > 0 ? -1 : 1; // dx positivo = arrastar para direita = card anterior
          const newIndex = Math.max(0, Math.min(coffeemons.length - 1, activeIndex + direction));

          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
            animateCards(newIndex);
          }
        }

        // Animação de volta à posição original
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const animateCards = (centerIndex: number) => {
    coffeemons.forEach((_, index) => {
      if (index >= scaleValues.length || index >= opacityValues.length) {
        return; // Pular se o índice não existe nos arrays
      }

      const distance = Math.abs(index - centerIndex);
      const scale = distance === 0 ? 1.1 : distance === 1 ? 0.9 : 0.7;
      const opacity = distance === 0 ? 1 : distance === 1 ? 0.7 : 0.4;

      Animated.parallel([
        Animated.spring(scaleValues[index], {
          toValue: scale,
          useNativeDriver: false,
        }),
        Animated.spring(opacityValues[index], {
          toValue: opacity,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  React.useEffect(() => {
    if (coffeemons.length > 0) {
      animateCards(activeIndex);
    }
  }, [coffeemons.length, activeIndex]);

  if (loading) {
    return (
      <View style={styles.teamColumn}>
        <Text style={styles.teamColumnTitle}>{title}</Text>
        <Text style={styles.teamEmptyMessage}>Carregando...</Text>
      </View>
    );
  }

  if (coffeemons.length === 0) {
    return (
      <View style={styles.teamColumn}>
        <Text style={styles.teamColumnTitle}>{title}</Text>
        <Text style={styles.teamEmptyMessage}>{emptyMessage}</Text>
        {showAddButton && onAddCoffeemon && (
          <TouchableOpacity style={styles.addButton} onPress={onAddCoffeemon}>
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.teamColumn}>
      <Text style={styles.teamColumnTitle}>{title}</Text>

      <View style={styles.carouselContainer}>
        <Animated.View
          style={[
            styles.carouselTrack,
            {
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {coffeemons.map((coffeemon, index) => {
            const distance = Math.abs(index - activeIndex);
            const isActive = index === activeIndex;

            return (
              <Animated.View
                key={coffeemon.id || index}
                style={[
                  styles.carouselCard,
                  {
                    transform: [{ scale: scaleValues[index] }],
                    opacity: opacityValues[index],
                    zIndex: isActive ? 10 : 5 - distance,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.carouselCardContent}
                  onPress={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                      animateCards(index);
                    } else {
                      onToggleParty(coffeemon);
                    }
                  }}
                  disabled={partyLoading !== null}
                >
                  <View style={styles.carouselCardImageContainer}>
                    <Animated.Image
                      source={getCoffeemonImageSource(coffeemon.name, 'default')}
                      style={styles.carouselCardImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.carouselCardInfo}>
                    <Text style={styles.carouselCardName} numberOfLines={1}>
                      {coffeemon.name}
                    </Text>
                    <Text style={styles.carouselCardLevel}>
                      Lv. {coffeemon.level || 1}
                    </Text>
                  </View>

                  {/* Indicador de ativo */}
                  {isActive && (
                    <View style={styles.activeIndicator}>
                      <Text style={styles.activeIndicatorText}>★</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Indicadores de posição */}
        <View style={styles.carouselIndicators}>
          {coffeemons.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.carouselIndicator,
                index === activeIndex && styles.carouselIndicatorActive,
              ]}
              onPress={() => {
                setActiveIndex(index);
                animateCards(index);
              }}
            />
          ))}
        </View>
      </View>

      {showAddButton && onAddCoffeemon && coffeemons.length < 3 && (
        <TouchableOpacity style={styles.addButtonSmall} onPress={onAddCoffeemon}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
