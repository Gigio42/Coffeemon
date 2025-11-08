import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme/pixelArt';
import { Move, StatusEffect } from '../../../types';

interface MoveTooltipProps {
  move: Move;
  visible: boolean;
}

const EFFECT_DESCRIPTIONS: Record<string, string> = {
  burn: '🔥 Queima (dano contínuo)',
  poison: '☠️ Veneno (dano moderado)',
  sleep: '💤 Sono (bloqueia ações)',
  freeze: '❄️ Congelamento (bloqueia)',
  paralysis: '⚡ Paralisia (bloqueia)',
  attackUp: '⬆️ Aumenta Ataque',
  defenseUp: '🛡️ Aumenta Defesa',
  attackDown: '⬇️ Reduz Ataque',
  defenseDown: '💔 Reduz Defesa',
};

export default function MoveTooltip({ move, visible }: MoveTooltipProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.moveName}>{move.name}</Text>
      <Text style={styles.movePower}>⚔️ Poder: {move.power}</Text>
      
      {(move as any).effects && (move as any).effects.length > 0 && (
        <View style={styles.effectsContainer}>
          <Text style={styles.effectsTitle}>Efeitos:</Text>
          {(move as any).effects.map((effect: StatusEffect, index: number) => (
            <Text key={index} style={styles.effectText}>
              • {EFFECT_DESCRIPTIONS[effect.type] || effect.type}
              {effect.chance && effect.chance < 1 ? ` (${Math.floor(effect.chance * 100)}%)` : ''}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '110%',
    left: 0,
    right: 0,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: pixelArt.borders.widthThick,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    padding: pixelArt.spacing.sm,
    ...pixelArt.shadows.card,
    zIndex: 1000,
  },
  moveName: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 12,
    color: pixelArt.colors.sparkleColor,
    marginBottom: pixelArt.spacing.xs,
  },
  movePower: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.xs,
  },
  effectsContainer: {
    marginTop: pixelArt.spacing.xs,
    paddingTop: pixelArt.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: pixelArt.colors.borderDark,
  },
  effectsTitle: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: pixelArt.colors.textLight,
    marginBottom: 2,
  },
  effectText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 8,
    color: pixelArt.colors.textDark,
    marginLeft: pixelArt.spacing.xs,
  },
});
