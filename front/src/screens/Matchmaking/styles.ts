import { StyleSheet } from 'react-native';
import { colors, metrics } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  matchmakingContainer: {
    flex: 1,
    padding: metrics.spacing.lg,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: metrics.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: metrics.spacing.lg,
    color: colors.text,
  },
  backButton: {
    position: 'absolute',
    top: metrics.spacing.sm,
    left: metrics.spacing.sm,
    backgroundColor: colors.secondary,
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.sm,
    borderRadius: metrics.borderRadius.sm,
    zIndex: 1,
  },
  backButtonText: {
    color: colors.white,
    fontSize: metrics.fontSize.md,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: '#fff3cd',
    padding: metrics.spacing.md,
    borderRadius: metrics.borderRadius.sm,
    marginBottom: metrics.spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  statusText: {
    fontSize: metrics.fontSize.md,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600',
  },
  // BOTÕES PRINCIPAIS
  captureButton: {
    width: '100%',
    maxWidth: 300,
    height: metrics.button.height,
    backgroundColor: '#9b59b6',
    borderRadius: metrics.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    elevation: 5,
  },
  captureButtonText: {
    color: colors.white,
    fontSize: metrics.fontSize.md,
    fontWeight: 'bold',
  },
  // Botões de Matchmaking
  botButtonsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: metrics.spacing.md,
  },
  botSectionTitle: {
    fontSize: metrics.fontSize.sm,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
    fontStyle: 'italic',
  },
  findMatchButton: {
    width: '100%',
    maxWidth: 300,
    height: metrics.button.height,
    borderRadius: metrics.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    elevation: 5,
  },
  pvpButton: {
    backgroundColor: colors.primary,
  },
  jessieButton: {
    backgroundColor: '#e67e22',
  },
  jamesButton: {
    backgroundColor: colors.error,
  },
  findMatchButtonText: {
    color: colors.white,
    fontSize: metrics.fontSize.sm,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    width: '100%',
    maxWidth: 300,
    height: 40,
    backgroundColor: colors.buttonCancel,
    borderRadius: metrics.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.lg,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: metrics.fontSize.sm,
    fontWeight: 'bold',
  },
});
