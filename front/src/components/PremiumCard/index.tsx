import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme/theme';

interface PremiumCardProps {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  badge?: string;
  badgeColor?: string;
  stats?: Array<{ label: string; value: string | number }>;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'large';
  isActive?: boolean;
}

export default function PremiumCard({
  title,
  subtitle,
  image,
  badge,
  badgeColor = theme.colors.accent.primary,
  stats,
  onPress,
  variant = 'default',
  isActive = false,
}: PremiumCardProps) {
  const cardHeight = variant === 'compact' ? 180 : variant === 'large' ? 280 : 220;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { height: cardHeight },
        isActive && styles.containerActive,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Active glow */}
      {isActive && (
        <View style={styles.activeGlow}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.15)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Badge */}
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}

        {/* Image container */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBackground}>
            <LinearGradient
              colors={['#F3F4F6', '#E5E7EB']}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Border */}
      <View style={[styles.border, isActive && styles.borderActive]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
    position: 'relative',
  },

  containerActive: {
    ...theme.shadows.xl,
  },

  activeGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.xl,
  },

  content: {
    flex: 1,
    padding: theme.spacing.md,
  },

  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    zIndex: 10,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  imageContainer: {
    width: '100%',
    height: 100,
    marginBottom: theme.spacing.sm,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageBackground: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },

  image: {
    width: 85,
    height: 85,
    zIndex: 1,
  },

  infoSection: {
    flex: 1,
  },

  title: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },

  statsContainer: {
    marginTop: theme.spacing.xs,
    gap: 4,
  },

  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statLabel: {
    fontSize: 10,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weight.medium,
  },

  statValue: {
    fontSize: 11,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.semibold,
  },

  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    pointerEvents: 'none',
  },

  borderActive: {
    borderWidth: 2,
    borderColor: theme.colors.accent.primary,
  },
});
