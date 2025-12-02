import { colors, spacing, radius, typography, gradients } from './colors';

// Sistema de tema centralizado para todo o app
export const theme = {
  colors,
  spacing,
  radius,
  typography,
  gradients,
  
  // Sombras sofisticadas
  shadows: {
    sm: {
      shadowColor: colors.accent.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: colors.accent.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.accent.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 8,
    },
    xl: {
      shadowColor: colors.accent.primary,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 32,
      elevation: 16,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 0, // Glass effect doesn't use elevation in the same way
    }
  },
};

export type Theme = typeof theme;
