import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

/**
 * ========================================
 * ECOMMERCE SCREEN
 * ========================================
 * 
 * Tela de e-commerce (placeholder)
 * TODO: Implementar funcionalidade completa
 */

export const EcommerceScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Loja</Text>
      <Text style={styles.subtitle}>Em desenvolvimento...</Text>
      <Text style={styles.description}>
        A loja de itens e produtos estará disponível em breve!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
