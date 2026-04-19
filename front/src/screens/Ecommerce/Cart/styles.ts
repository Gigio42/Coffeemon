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
    paddingHorizontal: 16,
    paddingTop: 16 + statusBarHeight,
    paddingBottom: 16,
    backgroundColor: '#1C1007',
    shadowColor: '#1C1007',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
  },

  backButton: {
    marginRight: 12,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  backButtonText: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
  },

  headerTitle: {
    fontFamily: 'monospace',
    color: '#F5D080',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#F5D080',
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
