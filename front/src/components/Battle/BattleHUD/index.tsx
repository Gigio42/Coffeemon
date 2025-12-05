import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { PlayerState } from '../../../types';
import { CoffeemonVariant, getCoffeemonImage } from '../../../../assets/coffeemons';
import { styles } from '../../../screens/Battle/styles';
import { hudStyles } from './styles';

// Ícones de tipos elementais
const typeIcons = {
  floral: require('../../../../assets/iconsv2/notes/floral.png'),
  sweet: require('../../../../assets/iconsv2/notes/sweet.png'),
  fruity: require('../../../../assets/iconsv2/notes/fruity.png'),
  nutty: require('../../../../assets/iconsv2/notes/nutty.png'),
  roasted: require('../../../../assets/iconsv2/notes/roasted.png'),
  spicy: require('../../../../assets/iconsv2/notes/roasted.png'), // usando roasted como fallback
  sour: require('../../../../assets/iconsv2/notes/sour.png'),
};

interface BattleHUDProps {
  playerState: PlayerState | null;
  isMe: boolean;
  damage?: number | null;
  spriteVariant?: CoffeemonVariant;
  imageSourceGetter?: (name: string, variant?: CoffeemonVariant) => ImageSourcePropType;
  playerName?: string;
}

const getTypeIcon = (type: string): ImageSourcePropType => {
  const normalizedType = type?.toLowerCase() as keyof typeof typeIcons;
  return typeIcons[normalizedType] || typeIcons.roasted;
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
  playerName,
}: BattleHUDProps) {
  const [damageAnim] = useState(new Animated.Value(0));
  const [currentDamage, setCurrentDamage] = useState<number | null>(null);
  const [hpBarAnim] = useState(new Animated.Value(100)); // Inicializa em 100%

  const activeMon =
    playerState && playerState.activeCoffeemonIndex !== null
      ? playerState.coffeemons[playerState.activeCoffeemonIndex]
      : null;

  const hpPercent = activeMon ? Math.max(0, Math.min(100, (activeMon.currentHp / activeMon.maxHp) * 100)) : 0;

  // Animar barra de HP quando mudar
  useEffect(() => {
    if (activeMon) {
      Animated.spring(hpBarAnim, {
        toValue: hpPercent,
        useNativeDriver: false, // width não pode usar native driver
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [hpPercent, hpBarAnim, activeMon]);

  // Handle damage animation
  useEffect(() => {
    if (damage && damage > 0) {
      setCurrentDamage(damage);
      
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

  const containerStyle = isMe ? styles.playerHudPosition : styles.opponentHudPosition;
  const resolveImage = imageSourceGetter ?? getCoffeemonImage;
  const imageSource = resolveImage(activeMon.name, spriteVariant);
  // Tenta obter o tipo da propriedade 'types' (array) ou 'type' (string)
  const monType = (activeMon as any)?.types?.[0] || (activeMon as any)?.type;
  const typeIconSource = getTypeIcon(monType);
  const typeColor = getTypeColor(monType);
  const level = activeMon.level;
  
  // Gera nome curto do jogador
  const displayName = playerName || (isMe ? 'Você' : 'Oponente');

  return (
    <View style={[styles.hudContainer, containerStyle]}>
      {/* Tag de Treinador */}
      <View style={[hudStyles.trainerTag, isMe ? hudStyles.trainerTagLeft : hudStyles.trainerTagRight]}>
        <View style={[hudStyles.trainerTagInner, isMe && hudStyles.trainerTagPlayer]}>
          <Text style={hudStyles.trainerIcon}>{isMe ? '★' : '☆'}</Text>
          <Text style={[hudStyles.trainerTagText, isMe && hudStyles.trainerTagTextPlayer]}>
            {displayName}
          </Text>
        </View>
      </View>
      
      <View style={[hudStyles.card, isMe && hudStyles.cardPlayer]}>
        <View style={hudStyles.topSection}>
          {/* Fundo do tipo com padrão */}
          <View style={[hudStyles.typeBackground, { backgroundColor: typeColor }]} />
          <View style={[hudStyles.typePattern, { backgroundColor: typeColor }]} />
          
          <View style={hudStyles.nameGroup}>
            <Image source={typeIconSource} style={hudStyles.typeIconImage} resizeMode="contain" />
            <Text style={hudStyles.name}>{activeMon.name.toUpperCase()}</Text>
          </View>
          <View style={hudStyles.levelGroup}>
            <Text style={hudStyles.levelLabel}>Lv</Text>
            <Text style={hudStyles.levelValue}>{level}</Text>
          </View>
        </View>

        <View style={hudStyles.barSection}>
          <Text style={hudStyles.hpLabelText}>HP</Text>
          <View style={hudStyles.barTrough}>
            <Animated.View 
              style={[
                hudStyles.barFill, 
                { 
                  width: hpBarAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: hpPercent > 50 ? '#10b981' : hpPercent > 20 ? '#f59e0b' : '#ef4444'
                }
              ]} 
            />
            <View style={hudStyles.hpTextContainer}>
              <Text style={hudStyles.hpNumber}>{Math.floor(activeMon.currentHp)}</Text>
              <Text style={[hudStyles.hpNumber, { fontSize: 9, opacity: 0.6 }]}>/</Text>
              <Text style={hudStyles.hpNumber}>{activeMon.maxHp}</Text>
            </View>
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
