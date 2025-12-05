import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { getTypeColorScheme } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import { theme as staticTheme } from '../../theme/theme';

interface CoffeemonCardProps {
  coffeemon: PlayerCoffeemon;
  onToggleParty?: (coffeemon: PlayerCoffeemon) => Promise<boolean | void> | void;
  isLoading?: boolean;
  variant?: 'large' | 'small';
  disabled?: boolean;
  onPress?: (coffeemon: PlayerCoffeemon) => void;
  showHp?: boolean;
  showStats?: boolean;
  showPartyIndicator?: boolean;
}

const getTypeIcon = (type?: string): string => {
  const icons: Record<string, string> = {
    roasted: '🔥',
    sweet: '🍬',
    bitter: '☕',
    milky: '🥛',
    iced: '❄️',
    nutty: '🌰',
    fruity: '🍎',
    spicy: '🌶️',
    sour: '🍋',
    floral: '🌸',
  };
  return icons[type || 'roasted'] || '☕';
};

export default function CoffeemonCard({
  coffeemon,
  onToggleParty,
  isLoading = false,
  variant = 'large',
  disabled = false,
  onPress,
  showHp = true,
  showStats = true,
  showPartyIndicator = true,
}: CoffeemonCardProps) {
  const { colors } = useTheme();
  const isSmall = variant === 'small';
  
  const primaryType = coffeemon.coffeemon.types?.[0] || 'roasted';
  const typeColors = getTypeColorScheme(primaryType);
  
  const maxHp = (coffeemon.coffeemon.baseHp || 50) + coffeemon.level * 2;
  const hpPercentage = Math.max(0, Math.min(100, (coffeemon.hp / maxHp) * 100));

  const handlePress = async () => {
    if (disabled || isLoading) return;
    
    if (onPress) {
      onPress(coffeemon);
    }
  };

  const handleTogglePartyPress = async (e: any) => {
    e.stopPropagation();
    if (disabled || isLoading || !onToggleParty) return;
    await onToggleParty(coffeemon);
  };

  // Minimalist Glass Container
  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    shadowColor: typeColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        containerStyle,
        disabled && styles.containerDisabled,
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={disabled || isLoading}
    >
      {/* Soft Gradient Background */}
      <LinearGradient
        colors={typeColors.gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        opacity={0.6}
      />

      {/* Party Indicator - Floating Badge */}
      {showPartyIndicator && coffeemon.isInParty && (
        <View style={[styles.partyBadge, { backgroundColor: typeColors.primary, shadowColor: typeColors.primary }]}>
          <Text style={styles.partyCheck}>★</Text>
        </View>
      )}

      <View style={[styles.content, isSmall && styles.contentSmall]}>
        {/* Header: Minimalist Type & Level */}
        <View style={styles.header}>
          <View style={[styles.typePill, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
            <Text style={styles.typeIcon}>{getTypeIcon(primaryType)}</Text>
            {!isSmall && (
              <Text style={[styles.typeName, { color: typeColors.dark }]}>
                {primaryType.charAt(0).toUpperCase() + primaryType.slice(1)}
              </Text>
            )}
          </View>
          
          <View style={styles.levelContainer}>
            <Text style={[styles.levelLabel, { color: colors.text.tertiary }]}>LV</Text>
            <Text style={[styles.levelValue, { color: colors.text.primary }]}>{coffeemon.level}</Text>
          </View>
        </View>

        {/* Image Area with Glow */}
        <View style={[styles.imageContainer, isSmall && styles.imageContainerSmall]}>
          <View style={[styles.glowEffect, { shadowColor: typeColors.primary }]}>
             <Image
              source={getCoffeemonImage(
                coffeemon.coffeemon.name,
                getVariantForStatusEffects(coffeemon.statusEffects, 'default')
              )}
              style={[styles.image, isSmall && styles.imageSmall]}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Info Area */}
        <View style={styles.infoSection}>
          <Text style={[styles.name, { color: colors.text.primary }, isSmall && styles.nameSmall]} numberOfLines={1}>
            {coffeemon.coffeemon.name}
          </Text>

          {/* Botão de Adicionar/Remover do Time */}
          {showPartyIndicator && onToggleParty && (
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: coffeemon.isInParty ? typeColors.primary : 'rgba(0,0,0,0.1)',
                }
              ]}
              onPress={handleTogglePartyPress}
              activeOpacity={0.8}
              disabled={disabled || isLoading}
            >
              <Text style={[
                styles.addButtonText,
                { color: coffeemon.isInParty ? '#FFF' : colors.text.secondary }
              ]}>
                {isLoading ? '...' : coffeemon.isInParty ? '★ No Time' : '+ Adicionar'}
              </Text>
            </TouchableOpacity>
          )}

          {showHp && !showPartyIndicator && (
            <View style={styles.hpContainer}>
              <View style={[styles.hpTrack, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                <LinearGradient
                  colors={
                    hpPercentage > 50
                      ? [colors.feedback.success, '#34D399']
                      : hpPercentage > 25
                      ? [colors.feedback.warning, '#FBBF24']
                      : [colors.feedback.error, '#F87171']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.hpFill, { width: `${hpPercentage}%` }]}
                />
              </View>
            </View>
          )}

          {showStats && !isSmall && (
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>ATK</Text>
                <Text style={[styles.statValue, { color: colors.text.secondary }]}>{coffeemon.attack}</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>DEF</Text>
                <Text style={[styles.statValue, { color: colors.text.secondary }]}>{coffeemon.defense}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 24, // More rounded corners
    overflow: 'hidden',
    marginBottom: 4,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  content: {
    padding: 16,
  },
  contentSmall: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeIcon: {
    fontSize: 12,
  },
  typeName: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  levelLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  levelValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  partyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  partyCheck: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  imageContainerSmall: {
    height: 70,
    marginVertical: 2,
  },
  glowEffect: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  imageSmall: {
    width: 65,
    height: 65,
  },
  infoSection: {
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  nameSmall: {
    fontSize: 11,
    marginBottom: 0,
  },
  addButton: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  hpTrack: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
  },
});