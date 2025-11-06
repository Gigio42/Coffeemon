import { StyleSheet } from 'react-native';
import { colors, metrics } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: metrics.spacing.md,
  },
  configButton: {
    position: 'absolute',
    top: metrics.spacing.xs,
    right: metrics.spacing.sm,
    padding: metrics.spacing.sm,
    zIndex: 10,
  },
  configButtonText: {
    fontSize: metrics.fontSize.xxl,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.lg,
  },
  loginTitle: {
    fontSize: metrics.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: metrics.spacing.xxl,
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
  loginButton: {
    width: '100%',
    maxWidth: metrics.button.maxWidth,
    height: metrics.button.height,
    backgroundColor: colors.primary,
    borderRadius: metrics.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.spacing.sm,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: metrics.fontSize.md,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: metrics.spacing.md,
    paddingVertical: metrics.spacing.sm,
  },
  toggleButtonText: {
    color: colors.primary,
    fontSize: metrics.fontSize.sm,
    textDecorationLine: 'underline',
  },
  message: {
    marginTop: metrics.spacing.md,
    fontSize: metrics.fontSize.sm,
    textAlign: 'center',
  },
  clearCacheButton: {
    marginTop: metrics.spacing.xxl,
    paddingVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.md,
  },
  clearCacheText: {
    color: colors.textLight,
    fontSize: metrics.fontSize.xs,
    textDecorationLine: 'underline',
  },
});
