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
    padding: pixelArt.spacing.lg,
    backgroundColor: pixelArt.colors.cardOuterBg,
    borderRadius: pixelArt.borders.radiusMedium,
    marginBottom: pixelArt.spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    ...pixelArt.shadows.card,
  },

  summaryInner: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopColor: '#e0e0e0',
    borderLeftColor: '#e0e0e0',
    borderBottomColor: '#f8f8f8',
    borderRightColor: '#f8f8f8',
  },

  summaryTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.md,
    textAlign: 'center',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pixelArt.spacing.sm,
  },

  summaryLabel: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
  },

  summaryValue: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    fontWeight: '700',
  },

  summaryDivider: {
    height: 2,
    backgroundColor: pixelArt.colors.borderDark,
    marginVertical: pixelArt.spacing.md,
  },

  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pixelArt.spacing.sm,
  },

  summaryTotalLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
  },

  summaryTotalValue: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 20,
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
    flex: 1,
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
    backgroundColor: pixelArt.colors.headerBg,
    borderTopWidth: 3,
    borderTopColor: pixelArt.colors.borderDark,
    ...pixelArt.shadows.innerBorder,
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: pixelArt.colors.borderLight,
    borderBottomWidth: 2,
    borderBottomColor: pixelArt.colors.borderDark,
  },

  totalLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    fontSize: 16,
  },

  totalValue: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 18,
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
    width: 32,
    height: 32,
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
