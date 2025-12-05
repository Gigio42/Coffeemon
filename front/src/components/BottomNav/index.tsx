import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { battleIcons } from "../../../assets/iconsv2";
import { theme } from "../../theme/theme";

export type NavScreen = "shop" | "team" | "battle" | "catalog" | "cafe";

interface BottomNavProps {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.base,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border.light,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    ...theme.shadows.lg,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    marginHorizontal: 2,
  },
  navItemActive: {
    backgroundColor: theme.colors.accent.primary,
    shadowColor: theme.colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  label: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.semiBold,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weight.bold,
    letterSpacing: 0.5,
  },
});

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
}) => {
  const navItems: { key: NavScreen; label: string; icon: any }[] = [
    { key: "shop", label: "Loja", icon: battleIcons.marketplace },
    { key: "team", label: "Time", icon: battleIcons.paw },
    { key: "battle", label: "Batalha", icon: battleIcons.versus },
    { key: "catalog", label: "Catálogo", icon: battleIcons.card },
    { key: "cafe", label: "Café", icon: battleIcons.coffeeBreak },
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
          <Image
            source={item.icon}
            style={[
              styles.icon,
              {
                tintColor:
                  activeScreen === item.key
                    ? theme.colors.text.inverse
                    : theme.colors.text.secondary,
              },
            ]}
            resizeMode="contain"
          />
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
