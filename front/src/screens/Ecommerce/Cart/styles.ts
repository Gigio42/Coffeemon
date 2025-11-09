import { StyleSheet, Platform, StatusBar } from 'react-native';
import { pixelArt } from '../../../theme';

// Para Android, considera a altura da status bar
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },

  gradientContainer: {
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
    paddingTop: pixelArt.spacing.lg + statusBarHeight, // Evita sobreposição com status bar
    backgroundColor: '#f5f2e8', // Cor creme clara
    borderBottomWidth: 3,
    borderBottomColor: '#d4c5a0', // Borda creme mais escura
    borderTopWidth: 2,
    borderTopColor: '#faf8f0', // Borda creme mais clara
    ...pixelArt.shadows.innerBorder,
  },

  backButton: {
    marginRight: pixelArt.spacing.md,
    padding: 8,
  },

  backButtonText: {
    fontSize: 24,
    color: '#8B7355',
    fontWeight: '700',
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
  // RESUMO DO CARRINHO
  // ========================================
  summaryCard: {
    backgroundColor: pixelArt.colors.cardOuterBg,
    borderRadius: pixelArt.borders.radiusMedium,
    marginBottom: pixelArt.spacing.lg,
    padding: pixelArt.spacing.md,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },

  // ========================================
  // LISTA DE ITENS
  // ========================================
  itemsList: {
    marginBottom: pixelArt.spacing.lg,
  },

  // ========================================
  // BOTÕES DE AÇÃO
  // ========================================
  actionsContainer: {
    flexDirection: 'row',
    gap: pixelArt.spacing.md,
    marginTop: pixelArt.spacing.lg,
  },

  checkoutButton: {
    ...pixelArt.buttons.secondary,
    paddingVertical: pixelArt.spacing.lg,
  },

  checkoutButtonDisabled: {
    opacity: 0.5,
  },

  checkoutButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 12,
  },

  clearButton: {
    ...pixelArt.buttons.danger,
    paddingVertical: pixelArt.spacing.lg,
  },

  clearButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 12,
  },

  // Botões genéricos com estados pressionados
  retryButton: {
    ...pixelArt.buttons.action,
    marginBottom: pixelArt.spacing.md,
  },

  retryButtonText: {
    ...pixelArt.buttons.text,
  },

  loginButton: {
    ...pixelArt.buttons.primary,
  },

  loginButtonText: {
    ...pixelArt.buttons.text,
  },

  shopButton: {
    ...pixelArt.buttons.primary,
    marginTop: pixelArt.spacing.lg,
  },

  shopButtonText: {
    ...pixelArt.buttons.text,
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
  // ESTADOS DE ERRO E CARREGAMENTO
  // ========================================
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
    padding: pixelArt.spacing.xxl,
  },

  errorIcon: {
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

  // ========================================
  // FOOTER COM TOTAL
  // ========================================
  footer: {
    padding: pixelArt.spacing.lg,
    backgroundColor: '#f5f2e8',
    borderTopWidth: 3,
    borderTopColor: '#d4c5a0',
    ...pixelArt.shadows.innerBorder,
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
  },

  totalLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    fontSize: 16,
  },

  totalValue: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 20,
  },

  // ========================================
  // ESTILOS PARA ÍCONES
  // ========================================
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

  checkoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  checkoutIcon: {
    width: 20,
    height: 20,
  },

  // ========================================
  // MISSING ICON STYLES
  // ========================================
  helpIcon: {
    width: 80,
    height: 80,
    marginBottom: pixelArt.spacing.lg,
  },

  settingsIcon: {
    width: 32,
    height: 32,
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
