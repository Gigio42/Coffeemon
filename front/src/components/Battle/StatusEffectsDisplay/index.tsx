import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme/pixelArt';
import { StatusEffect } from '../../../types';

interface StatusEffectsDisplayProps {
  statusEffects?: StatusEffect[];
}

const STATUS_ICONS: Record<string, { emoji: string; color: string }> = {
  burn: { emoji: '🔥', color: '#ff6b6b' },
  poison: { emoji: '☠️', color: '#9b59b6' },
  sleep: { emoji: '💤', color: '#3498db' },
  freeze: { emoji: '❄️', color: '#00d2ff' },
  paralysis: { emoji: '⚡', color: '#f1c40f' },
  attackUp: { emoji: '⬆️', color: '#e74c3c' },
  defenseUp: { emoji: '🛡️', color: '#3498db' },
  attackDown: { emoji: '⬇️', color: '#95a5a6' },
  defenseDown: { emoji: '💔', color: '#95a5a6' },
};

export default function StatusEffectsDisplay({ statusEffects }: StatusEffectsDisplayProps) {
  if (!statusEffects || statusEffects.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {statusEffects.map((effect, index) => {
        const effectInfo = STATUS_ICONS[effect.type] || { emoji: '⭐', color: pixelArt.colors.sparkleColor };
        
        return (
          <View 
            key={`${effect.type}-${index}`} 
            style={[styles.statusBadge, { borderColor: effectInfo.color }]}
          >
            <Text style={styles.statusIcon}>{effectInfo.emoji}</Text>
            {effect.duration && (
              <Text style={styles.statusDuration}>{effect.duration}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: 2,
    borderRadius: pixelArt.borders.radiusSmall,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 24,
    justifyContent: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusDuration: {
    ...pixelArt.typography.pixelBody,
    fontSize: 8,
    color: pixelArt.colors.textDark,
    marginLeft: 2,
  },
});
