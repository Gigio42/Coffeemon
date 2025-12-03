import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { PlayerState } from '../../../types';
import { CoffeemonVariant, getCoffeemonImage } from '../../../../assets/coffeemons';
import { styles } from '../../../screens/Battle/styles';
import { hudStyles } from './styles';

interface BattleHUDProps {
  playerState: PlayerState | null;
  isMe: boolean;
  damage?: number | null;
  spriteVariant?: CoffeemonVariant;
  imageSourceGetter?: (name: string, variant?: CoffeemonVariant) => ImageSourcePropType;
}

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

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    floral: '#E91E63',
    sweet: '#FF6F91',
    fruity: '#FFC107',
    nutty: '#8D6E63',
    roasted: '#FF5722',
    spicy: '#F44336',
    sour: '#4CAF50',
  };
  return colors[type?.toLowerCase()] || '#8D6E63';
};

export default function BattleHUD({
  playerState,
  isMe,
  damage,
  spriteVariant = 'default',
  imageSourceGetter,
}: BattleHUDProps) {
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
  const containerStyle = isMe ? styles.playerHudPosition : styles.opponentHudPosition;
  const resolveImage = imageSourceGetter ?? getCoffeemonImage;
  const imageSource = resolveImage(activeMon.name, spriteVariant);
  // Tenta obter o tipo da propriedade 'types' (array) ou 'type' (string)
  const monType = (activeMon as any)?.types?.[0] || (activeMon as any)?.type;
  const typeIcon = getTypeIcon(monType);
  const typeColor = getTypeColor(monType);
  const level = (activeMon as any)?.level ?? (playerState as any)?.level ?? '';

  return (
    <View style={[styles.hudContainer, containerStyle]}>
      <View style={hudStyles.card}>
        <View style={hudStyles.topSection}>
          {/* Fundo do tipo com padrão */}
          <View style={[hudStyles.typeBackground, { backgroundColor: typeColor }]} />
          <View style={[hudStyles.typePattern, { backgroundColor: typeColor }]} />
          
          <View style={hudStyles.nameGroup}>
            <Text style={hudStyles.name}>{activeMon.name.toUpperCase()}</Text>
          </View>
          <View style={hudStyles.levelGroup}>
            <Text style={hudStyles.levelLabel}>Lv.</Text>
            <Text style={hudStyles.levelValue}>{level}</Text>
          </View>
        </View>

        <View style={hudStyles.barSection}>
          <Text style={hudStyles.hpLabel}>HP</Text>
          <View style={hudStyles.barTrough}>
            <View 
              style={[
                hudStyles.barFill, 
                { 
                  width: `${hpPercent}%`,
                  backgroundColor: hpPercent > 50 ? '#10b981' : hpPercent > 20 ? '#f59e0b' : '#ef4444'
                }
              ]} 
            />
          </View>
        </View>

        <View style={hudStyles.bottomSection}>
          <View style={hudStyles.hpNumbers}>
            <Text style={hudStyles.hpNumber}>{Math.floor(activeMon.currentHp)}</Text>
            <Text style={[hudStyles.hpNumber, { fontSize: 11, opacity: 0.7 }]}>/</Text>
            <Text style={hudStyles.hpNumber}>{activeMon.maxHp}</Text>
          </View>
        </View>
      </View>

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
