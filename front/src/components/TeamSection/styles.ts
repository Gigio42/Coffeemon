import { StyleSheet } from 'react-native';
import { colors, metrics } from '../../theme';

export const styles = StyleSheet.create({
  teamSection: {
    width: '100%',
    maxWidth: 400,
    marginBottom: metrics.spacing.lg,
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadius.md,
    padding: metrics.spacing.md,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: metrics.fontSize.lg,
    marginBottom: metrics.spacing.md,
    color: colors.text,
  },
  emptyText: {
    fontSize: metrics.fontSize.sm,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: metrics.spacing.lg,
  },
  teamGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  availableScroll: {
    maxHeight: 180,
  },
});
