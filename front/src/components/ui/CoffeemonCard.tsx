import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { CoffeemonSprite } from '../common/CoffeemonSprite';
import { Button } from '../common/Button';
import { theme } from '../../styles/theme';
import { PlayerCoffeemons } from '../../types';

/**
 * ========================================
 * COFFEEMON CARD - MOLÉCULA
 * ========================================
 * 
 * Card para exibir Coffeemon com informações e ações
 * Usado em listas de seleção e party management
 */

interface CoffeemonCardProps {
  coffeemon: PlayerCoffeemons;
  onPress?: () => void;
  onActionPress?: () => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'secondary' | 'success' | 'error';
  showStats?: boolean;
  isInParty?: boolean;
}

export const CoffeemonCard: React.FC<CoffeemonCardProps> = ({
  coffeemon,
  onPress,
  onActionPress,
  actionLabel,
  actionVariant = 'primary',
  showStats = true,
  isInParty = false,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  return (
    <CardWrapper
      style={[styles.card, isInParty && styles.cardInParty]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Sprite */}
      <CoffeemonSprite
        name={coffeemon.coffeemon.name}
        variant="default"
        size={80}
      />
      
      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{coffeemon.coffeemon.name}</Text>
        <Text style={styles.type}>{coffeemon.coffeemon.type}</Text>
        
        {showStats && (
          <View style={styles.stats}>
            <Text style={styles.statText}>Lv. {coffeemon.level}</Text>
            <Text style={styles.statText}>HP: {coffeemon.hp}</Text>
            <Text style={styles.statText}>ATK: {coffeemon.attack}</Text>
            <Text style={styles.statText}>DEF: {coffeemon.defense}</Text>
          </View>
        )}
      </View>
      
      {/* Action Button */}
      {onActionPress && actionLabel && (
        <View style={styles.actionContainer}>
          <Button
            title={actionLabel}
            onPress={onActionPress}
            variant={actionVariant}
            style={styles.actionButton}
          />
        </View>
      )}
      
      {/* Party Badge */}
      {isInParty && (
        <View style={styles.partyBadge}>
          <Text style={styles.partyBadgeText}>★ Party</Text>
        </View>
      )}
    </CardWrapper>
  );
};

const styles = {
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  } as ViewStyle,
  cardInParty: {
    borderColor: theme.colors.success,
    backgroundColor: '#e8f5e9',
  } as ViewStyle,
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  } as ViewStyle,
  name: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  type: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  } as ViewStyle,
  statText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surfaceDark,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  } as TextStyle,
  actionContainer: {
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  } as ViewStyle,
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    minWidth: 100,
  } as ViewStyle,
  partyBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  partyBadgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
  } as TextStyle,
};
