import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { theme } from '../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TeamFormationProps {
  partyMembers: PlayerCoffeemon[];
  onCoffeemonPress: (coffeemon: PlayerCoffeemon) => void;
  onAddPress: () => void;
  activeCoffeemonId?: number;
}

export default function TeamFormation({
  partyMembers,
  onCoffeemonPress,
  onAddPress,
  activeCoffeemonId,
}: TeamFormationProps) {
  // Posições em formação triangular responsiva
  const getPositions = () => {
    const slotSize = Math.min((SCREEN_WIDTH - theme.spacing.lg * 2) / 3.5, 120);
    const spacing = slotSize * 0.3;
    
    const centerX = SCREEN_WIDTH / 2;
    const topY = theme.spacing.md;
    const bottomY = topY + slotSize + spacing;
    
    return [
      { x: centerX, y: topY, scale: 1.1 },  // Líder (centro-topo)
      { x: centerX - slotSize - spacing / 2, y: bottomY, scale: 1.0 },   // Esquerda
      { x: centerX + slotSize + spacing / 2, y: bottomY, scale: 1.0 },   // Direita
    ];
  };

  const renderCoffeemon = (coffeemon: PlayerCoffeemon | undefined, index: number) => {
    const positions = getPositions();
    const position = positions[index];
    const isEmpty = !coffeemon;
    const isActive = coffeemon?.id === activeCoffeemonId;
    const slotSize = Math.min((SCREEN_WIDTH - theme.spacing.lg * 2) / 3.5, 120);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.coffeemonPosition,
          {
            left: position.x - (slotSize * position.scale) / 2,
            top: position.y,
            width: slotSize * position.scale,
            height: slotSize * position.scale,
          },
        ]}
        onPress={() => {
          if (isEmpty) {
            onAddPress();
          } else {
            onCoffeemonPress(coffeemon);
          }
        }}
        activeOpacity={0.8}
      >
        {isEmpty ? (
          <View style={styles.emptySlot}>
            <View style={styles.emptySlotInner}>
              <Text style={styles.emptySlotIcon}>+</Text>
              <Text style={styles.emptySlotText}>Adicionar</Text>
            </View>
          </View>
        ) : (
          <View style={styles.coffeemonContainer}>
            {/* Círculo de fundo */}
            <View style={[styles.coffeemonCircle, isActive && styles.coffeemonCircleActive]}>
              <LinearGradient
                colors={['#FAFBFC', '#FFFFFF']}
                style={StyleSheet.absoluteFillObject}
              />
            </View>

            {/* Imagem do Coffeemon */}
            <Image
              source={getCoffeemonImage(
                coffeemon.coffeemon.name,
                getVariantForStatusEffects(coffeemon.statusEffects, 'default')
              )}
              style={[styles.coffeemonImage, { width: slotSize * position.scale * 0.75, height: slotSize * position.scale * 0.75 }]}
              resizeMode="contain"
            />

            {/* Badge de nível */}
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{coffeemon.level}</Text>
            </View>

            {/* Barra de HP */}
            <View style={[styles.hpBarContainer, { width: slotSize * position.scale * 0.8 }]}>
              <View style={styles.hpBarBackground}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.hpBarFill,
                    {
                      width: `${Math.max(0, Math.min(100, (coffeemon.hp / ((coffeemon.coffeemon.baseHp || 50) + coffeemon.level * 2)) * 100))}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Nome */}
            <Text style={[styles.coffeemonName, { maxWidth: slotSize * position.scale }]} numberOfLines={1}>
              {coffeemon.coffeemon.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const slotSize = Math.min((SCREEN_WIDTH - theme.spacing.lg * 2) / 3.5, 120);
  const formationHeight = slotSize * 2.5 + theme.spacing.xl;

  return (
    <View style={[styles.container, { height: formationHeight }]}>
      <View style={styles.formationArea}>
        {/* Coffeemons em formação */}
        {[0, 1, 2].map((index) => renderCoffeemon(partyMembers[index], index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: theme.spacing.md,
  },

  formationArea: {
    flex: 1,
    position: 'relative',
  },

  coffeemonPosition: {
    position: 'absolute',
  },

  emptySlot: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySlotInner: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border.medium,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySlotIcon: {
    fontSize: 28,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weight.bold,
  },

  emptySlotText: {
    fontSize: 10,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weight.medium,
    marginTop: 2,
  },

  coffeemonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coffeemonCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
    ...theme.shadows.md,
  },

  coffeemonCircleActive: {
    borderColor: theme.colors.accent.primary,
    borderWidth: 3,
    ...theme.shadows.xl,
  },

  coffeemonImage: {
    zIndex: 1,
  },

  levelBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.accent.primary,
    borderRadius: theme.radius.full,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface.base,
    ...theme.shadows.sm,
  },

  levelText: {
    fontSize: 11,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.inverse,
  },

  hpBarContainer: {
    position: 'absolute',
    bottom: -8,
  },

  hpBarBackground: {
    height: 5,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },

  hpBarFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },

  coffeemonName: {
    position: 'absolute',
    bottom: -24,
    fontSize: 11,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});
