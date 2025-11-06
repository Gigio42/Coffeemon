import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pixelArt.colors.bgLight,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    padding: pixelArt.spacing.lg,
    paddingBottom: 100,
  },

  // ========================================
  // HEADER
  // ========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pixelArt.spacing.lg,
    backgroundColor: pixelArt.colors.headerBg,
    borderBottomWidth: 3,
    borderBottomColor: pixelArt.colors.borderDark,
    borderTopWidth: 2,
    borderTopColor: '#ffffff',
    ...pixelArt.shadows.innerBorder,
  },

  backButton: {
    ...pixelArt.buttons.action,
    marginRight: pixelArt.spacing.md,
  },

  backButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 12,
  },

  // Botões adicionais para estados de erro
  retryButton: {
    ...pixelArt.buttons.action,
    marginBottom: pixelArt.spacing.md,
  },

  retryButtonText: {
    ...pixelArt.buttons.text,
  },

  shopButton: {
    ...pixelArt.buttons.primary,
    marginTop: pixelArt.spacing.lg,
  },

  shopButtonText: {
    ...pixelArt.buttons.text,
  },

  headerTitle: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 16,
  },

  // ========================================
  // EMPTY STATE
  // ========================================
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.xxl,
  },

  emptyText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },

  // ========================================
  // LISTA DE PEDIDOS
  // ========================================
  ordersList: {
    gap: pixelArt.spacing.md,
  },

  // ========================================
  // LOADING
  // ========================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    marginTop: pixelArt.spacing.md,
  },

  // ========================================
  // ESTILOS PARA ÍCONES
  // ========================================
  errorIcon: {
    width: 80,
    height: 80,
    marginBottom: pixelArt.spacing.lg,
  },

  retryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  retryIcon: {
    width: 32,
    height: 32,
  },

  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  loginIcon: {
    width: 32,
    height: 32,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIcon: {
    width: 36,
    height: 36,
  },

  // ========================================
  // MISSING STYLES
  // ========================================
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.xxl,
  },

  helpIcon: {
    width: 80,
    height: 80,
    marginBottom: pixelArt.spacing.lg,
  },

  errorText: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.error,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.md,
  },

  errorSubtext: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },

  settingsIcon: {
    width: 32,
    height: 32,
  },

  loginButton: {
    ...pixelArt.buttons.primary,
  },

  loginButtonText: {
    ...pixelArt.buttons.text,
  },

  profileIcon: {
    width: 32,
    height: 32,
  },

  emptyIcon: {
    width: 36,
    height: 36,
  },
});
