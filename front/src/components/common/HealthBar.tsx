import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

/**
 * ========================================
 * HEALTH BAR - ÁTOMO
 * ========================================
 * 
 * Barra de HP para Coffeemons
 * Mostra HP atual/máximo com animação visual
 */

interface HealthBarProps {
  currentHp: number;
  maxHp: number;
  variant?: 'player' | 'opponent';
  showNumbers?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  currentHp,
  maxHp,
  variant = 'player',
  showNumbers = true,
}) => {
  const hpPercentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  
  // Cor baseada na porcentagem de HP
  const getBarColor = () => {
    if (hpPercentage > 50) return theme.colors.success;
    if (hpPercentage > 25) return theme.colors.warning;
    return theme.colors.error;
  };
  
  return (
    <View style={styles.container}>
      {showNumbers && (
        <Text style={styles.hpText}>
          HP: {Math.floor(currentHp)}/{maxHp}
        </Text>
      )}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${hpPercentage}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
  } as ViewStyle,
  hpText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  barBackground: {
    height: theme.dimensions.hpBarHeight,
    backgroundColor: theme.colors.hpBarBackground,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.border,
  } as ViewStyle,
  barFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
};
