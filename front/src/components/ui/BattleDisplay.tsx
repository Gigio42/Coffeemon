import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { CoffeemonSprite } from '../common/CoffeemonSprite';
import { HealthBar } from '../common/HealthBar';
import { theme } from '../../styles/theme';
import { CoffeemonState } from '../../types';

/**
 * ========================================
 * BATTLE DISPLAY - MOLÉCULA
 * ========================================
 * 
 * Display de Coffeemon em batalha
 * Mostra sprite, nome, HP e status
 */

interface BattleDisplayProps {
  coffeemon: CoffeemonState;
  variant: 'player' | 'opponent';
  isAnimating?: boolean;
}

export const BattleDisplay: React.FC<BattleDisplayProps> = ({
  coffeemon,
  variant,
  isAnimating = false,
}) => {
  const isPlayer = variant === 'player';
  
  return (
    <View style={[styles.container, isPlayer ? styles.playerContainer : styles.opponentContainer]}>
      {/* Sprite */}
      <CoffeemonSprite
        name={coffeemon.name}
        variant={isAnimating ? 'hurt' : (isPlayer ? 'back' : 'default')}
        size={theme.dimensions.spriteSize}
        isAnimating={isAnimating}
      />
      
      {/* Info Panel */}
      <View style={styles.infoPanel}>
        <Text style={styles.name}>{coffeemon.name}</Text>
        
        <HealthBar
          currentHp={coffeemon.currentHp}
          maxHp={coffeemon.maxHp}
          variant={variant}
          showNumbers={true}
        />
        
        {/* Status Effects */}
        {coffeemon.statusEffects && coffeemon.statusEffects.length > 0 && (
          <View style={styles.statusContainer}>
            {coffeemon.statusEffects.map((effect, index) => (
              <View key={index} style={styles.statusBadge}>
                <Text style={styles.statusText}>{effect.type}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Fainted Overlay */}
        {coffeemon.isFainted && (
          <View style={styles.faintedOverlay}>
            <Text style={styles.faintedText}>Desmaiado</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    padding: theme.spacing.md,
  } as ViewStyle,
  playerContainer: {
    // Player no bottom
  } as ViewStyle,
  opponentContainer: {
    // Opponent no top
  } as ViewStyle,
  infoPanel: {
    width: '100%',
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  } as ViewStyle,
  name: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  } as ViewStyle,
  statusBadge: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
    textTransform: 'uppercase',
  } as TextStyle,
  faintedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  faintedText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
  } as TextStyle,
};
