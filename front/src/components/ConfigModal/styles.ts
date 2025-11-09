import { StyleSheet } from 'react-native';
import { colors, metrics } from '../../theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadius.md,
    padding: metrics.spacing.xl,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: metrics.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: metrics.spacing.lg,
    color: colors.text,
  },
  input: {
    width: '100%',
    maxWidth: metrics.input.maxWidth,
    height: metrics.input.height,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: metrics.borderRadius.sm,
    paddingHorizontal: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
    backgroundColor: colors.white,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: metrics.spacing.sm,
  },
  modalButton: {
    flex: 1,
    padding: metrics.spacing.md,
    borderRadius: metrics.borderRadius.sm,
    alignItems: 'center',
    marginHorizontal: metrics.spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.buttonCancel,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: metrics.fontSize.md,
  },
});
