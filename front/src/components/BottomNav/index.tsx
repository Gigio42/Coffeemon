import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export type NavScreen = 'shop' | 'team' | 'battle' | 'catalog' | 'cafe';

interface BottomNavProps {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    ...theme.shadows.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.lg,
  },
  navItemActive: {
    backgroundColor: theme.colors.accent.primary,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  labelActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weight.bold,
  },
});

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems: { key: NavScreen; label: string; icon: string }[] = [
    { key: 'shop', label: 'Shop', icon: '🛒' },
    { key: 'team', label: 'Time', icon: '👥' },
    { key: 'battle', label: 'Batalha', icon: '⚔️' },
    { key: 'catalog', label: 'Catálogo', icon: '📖' },
    { key: 'cafe', label: 'Café', icon: '☕' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.navItem,
            activeScreen === item.key && styles.navItemActive,
          ]}
          onPress={() => onNavigate(item.key)}
          activeOpacity={0.8}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text
            style={[
              styles.label,
              activeScreen === item.key && styles.labelActive,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
