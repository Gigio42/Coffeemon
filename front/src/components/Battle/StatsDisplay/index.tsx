import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme/pixelArt';
import { CoffeemonModifiers } from '../../../types';

interface StatsDisplayProps {
  attack?: number;
  defense?: number;
  speed?: number;
  modifiers?: CoffeemonModifiers;
  compact?: boolean;
}

export default function StatsDisplay({ attack, defense, speed, modifiers, compact = false }: StatsDisplayProps) {
  const hasModifiers = modifiers && (
    modifiers.attackModifier !== 1 ||
    modifiers.defenseModifier !== 1
  );

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {attack && (
          <View style={styles.compactStat}>
            <Text style={styles.compactLabel}>ATK</Text>
            <Text style={[
              styles.compactValue,
              modifiers && modifiers.attackModifier > 1 && styles.buffedStat,
              modifiers && modifiers.attackModifier < 1 && styles.debuffedStat,
            ]}>
              {Math.floor(attack * (modifiers?.attackModifier || 1))}
            </Text>
          </View>
        )}
        {defense && (
          <View style={styles.compactStat}>
            <Text style={styles.compactLabel}>DEF</Text>
            <Text style={[
              styles.compactValue,
              modifiers && modifiers.defenseModifier > 1 && styles.buffedStat,
              modifiers && modifiers.defenseModifier < 1 && styles.debuffedStat,
            ]}>
              {Math.floor(defense * (modifiers?.defenseModifier || 1))}
            </Text>
          </View>
        )}
        {speed && (
          <View style={styles.compactStat}>
            <Text style={styles.compactLabel}>SPD</Text>
            <Text style={styles.compactValue}>{speed}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {attack && (
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>⚔️ ATK:</Text>
          <Text style={[
            styles.statValue,
            modifiers && modifiers.attackModifier > 1 && styles.buffedStat,
            modifiers && modifiers.attackModifier < 1 && styles.debuffedStat,
          ]}>
            {Math.floor(attack * (modifiers?.attackModifier || 1))}
            {modifiers && modifiers.attackModifier !== 1 && (
              <Text style={styles.modifierIndicator}>
                {modifiers.attackModifier > 1 ? '↑' : '↓'}
              </Text>
            )}
          </Text>
        </View>
      )}
      {defense && (
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🛡️ DEF:</Text>
          <Text style={[
            styles.statValue,
            modifiers && modifiers.defenseModifier > 1 && styles.buffedStat,
            modifiers && modifiers.defenseModifier < 1 && styles.debuffedStat,
          ]}>
            {Math.floor(defense * (modifiers?.defenseModifier || 1))}
            {modifiers && modifiers.defenseModifier !== 1 && (
              <Text style={styles.modifierIndicator}>
                {modifiers.defenseModifier > 1 ? '↑' : '↓'}
              </Text>
            )}
          </Text>
        </View>
      )}
      {speed && (
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>⚡ SPD:</Text>
          <Text style={styles.statValue}>{speed}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  statLabel: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: pixelArt.colors.textLight,
  },
  statValue: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 10,
    color: pixelArt.colors.textDark,
  },
  buffedStat: {
    color: pixelArt.colors.success,
  },
  debuffedStat: {
    color: pixelArt.colors.error,
  },
  modifierIndicator: {
    fontSize: 8,
    marginLeft: 2,
  },
  compactContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  compactStat: {
    alignItems: 'center',
    marginRight: 6,
  },
  compactLabel: {
    ...pixelArt.typography.pixelBody,
    fontSize: 7,
    color: pixelArt.colors.textLight,
  },
  compactValue: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 10,
    color: pixelArt.colors.textDark,
  },
});
