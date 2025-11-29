import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export type NavScreen = 'shop' | 'team' | 'battle' | 'catalog' | 'friends';

interface BottomNavProps {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  labelActive: {
    color: '#000',
    fontWeight: '700',
  },
});

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems: { key: NavScreen; label: string; icon: string }[] = [
    { key: 'shop', label: 'Shop', icon: '🛒' },
    { key: 'team', label: 'Time', icon: '👥' },
    { key: 'battle', label: 'Batalha', icon: '⚔️' },
    { key: 'catalog', label: 'Catálogo', icon: '📖' },
    { key: 'friends', label: 'Amigos', icon: '🤝' },
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
          activeOpacity={0.7}
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
