import { StyleSheet } from 'react-native';
import { colors, metrics } from '../../theme';

export const styles = StyleSheet.create({
  // Card grande (para o time)
  coffeemonCard: {
    width: '31%',
    backgroundColor: '#f8f9fa',
    borderRadius: metrics.borderRadius.md,
    padding: metrics.spacing.sm,
    marginBottom: metrics.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.success,
  },
  coffeemonImage: {
    width: 80,
    height: 80,
    marginBottom: metrics.spacing.sm,
  },
  coffeemonName: {
    fontSize: metrics.fontSize.sm,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  coffeemonLevel: {
    fontSize: metrics.fontSize.xs,
    color: '#666',
    marginBottom: metrics.spacing.sm,
  },

  // Card pequeno (para disponíveis)
  coffeemonCardSmall: {
    width: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: metrics.borderRadius.md,
    padding: metrics.spacing.sm,
    marginRight: metrics.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  coffeemonImageSmall: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  coffeemonNameSmall: {
    fontSize: metrics.fontSize.xs,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  coffeemonLevelSmall: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },

  // Botões de party
  partyButton: {
    paddingVertical: 6,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: colors.success,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: colors.white,
    fontSize: metrics.fontSize.xs,
    fontWeight: 'bold',
  },
});
