import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    borderRadius: theme.radius.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitleWrapper: {
    backgroundColor: theme.colors.surface.elevated,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.md,
  },
  modalTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.text.tertiary,
  },
  modalContent: {
    paddingBottom: theme.spacing.lg,
  },
  carousel: {
    width: '100%',
  },
  carouselContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingRight: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  carouselItem: {
    marginRight: theme.spacing.md,
    width: 280,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxl,
    fontWeight: theme.typography.weight.medium,
  },
});
