import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { PlayerState } from '../../../types';
import { styles } from '../../../screens/Battle/styles';
import { getCoffeemonImage } from '../../../../assets/coffeemons';

interface BattleHUDProps {
  playerState: PlayerState | null;
  isMe: boolean;
  damage?: number | null;
}

// Ícones baseados no tipo do Coffeemon
const getTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    floral: '🍇',
    sweet: '🔥',
    fruity: '🍋',
    nutty: '🌰',
    roasted: '🔥',
    spicy: '🌶️',
    sour: '🍃',
  };
  return icons[type?.toLowerCase()] || '☕';
};

export default function BattleHUD({ playerState, isMe, damage }: BattleHUDProps) {
  const [damageAnim] = useState(new Animated.Value(0));
  const [currentDamage, setCurrentDamage] = useState<number | null>(null);

  const activeMon =
    playerState && playerState.activeCoffeemonIndex !== null
      ? playerState.coffeemons[playerState.activeCoffeemonIndex]
      : null;

  // Handle damage animation
  useEffect(() => {
    if (damage && damage > 0) {
      setCurrentDamage(damage);
      console.log('BattleHUD received damage:', { isMe, damage });
      
      // Reset animation
      damageAnim.setValue(0);
      
      // Animate damage text
      Animated.sequence([
        Animated.timing(damageAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(damageAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentDamage(null);
      });
    }
  }, [damage, damageAnim]);

  if (!activeMon) {
    return null;
  }

  const hpPercent = Math.max(0, Math.min(100, (activeMon.currentHp / activeMon.maxHp) * 100));
  const totalSegments = 20; // Total de quadradinhos na barra
  const filledSegments = Math.ceil((hpPercent / 100) * totalSegments);
  
  const containerStyle = isMe ? styles.playerHudPosition : styles.opponentHudPosition;
  const imageSource = getCoffeemonImage(activeMon.name, 'default');

  return (
    <View style={[styles.hudContainer, containerStyle]}>
      {/* Container Principal com display: flex e align-items: center */}
      <View style={styles.hudMainContent}>
        {/* Seção do Ícone - Pixel Art com image-rendering: pixelated */}
        <Image
          source={imageSource}
          style={styles.hudPixelIcon}
          resizeMode="contain"
        />
        
        {/* Bloco de Informações - flex: 1 para ocupar espaço restante */}
        <View style={styles.hudInfoBlock}>
          {/* Rótulo de Texto - text-transform: uppercase */}
          <Text style={styles.hudNameLabel}>{activeMon.name}</Text>
          
          {/* Container da Barra de Status */}
          <View style={styles.hudStatusBarContainer}>
            {/* Segmentos da Barra - flex: 1 para largura igual */}
            {Array.from({ length: totalSegments }).map((_, index) => {
              const isFilled = index < filledSegments;
              // Classes distintas para verde (#8bc34a) e vermelho (#f44336)
              const segmentColor = isFilled 
                ? (hpPercent <= 20 ? '#f44336' : hpPercent <= 50 ? '#FFD700' : '#8bc34a')
                : 'transparent'; // Vazios transparentes para mostrar fundo
              
              return (
                <View
                  key={index}
                  style={[
                    styles.hudStatusSegment,
                    { backgroundColor: segmentColor },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
      
      {/* Damage Display */}
      {currentDamage && (
        <Animated.Text
          style={[
            styles.damageText,
            {
              opacity: damageAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 1],
              }),
              transform: [
                {
                  translateY: damageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, -10],
                  }),
                },
              ],
            },
          ]}
        >
          -{currentDamage}
        </Animated.Text>
      )}
    </View>
  );
}
