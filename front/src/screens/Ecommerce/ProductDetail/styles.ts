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
  },

  // ========================================
  // HEADER COM BOTÃO VOLTAR
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
  // IMAGEM DO PRODUTO COM CONTAINER PIXELADO
  // ========================================
  imageContainer: {
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

  imageInner: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusSmall,
    overflow: 'hidden',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0e0d0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========================================
  // CARD DE INFORMAÇÕES
  // ========================================
  infoCard: {
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

  infoCardInner: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopColor: '#e0e0e0',
    borderLeftColor: '#e0e0e0',
    borderBottomColor: '#f8f8f8',
    borderRightColor: '#f8f8f8',
  },

  productName: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.md,
    fontSize: 18,
  },

  productDescription: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    marginBottom: pixelArt.spacing.lg,
    lineHeight: 24,
  },

  productPrice: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 24,
    marginBottom: pixelArt.spacing.lg,
  },

  // ========================================
  // CONTROLES DE QUANTIDADE
  // ========================================
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pixelArt.spacing.xl,
  },

  quantityLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginRight: pixelArt.spacing.md,
  },

  quantityButton: {
    ...pixelArt.buttons.small,
    width: 40,
    height: 40,
  },

  quantityButtonDisabled: {
    opacity: 0.5,
  },

  quantityButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 18,
  },

  quantityValue: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.textDark,
    marginHorizontal: pixelArt.spacing.xl,
    minWidth: 40,
    textAlign: 'center',
  },

  // ========================================
  // BOTÃO ADICIONAR AO CARRINHO
  // ========================================
  addButton: {
    ...pixelArt.buttons.secondary,
    paddingVertical: pixelArt.spacing.lg,
  },

  addButtonLoading: {
    opacity: 0.7,
  },

  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  addButtonIcon: {
    width: 32,
    height: 32,
  },

  addButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 14,
  },

  // ========================================
  // MISSING STYLES
  // ========================================
  infoContainer: {
    padding: pixelArt.spacing.lg,
    backgroundColor: pixelArt.colors.cardOuterBg,
    borderRadius: pixelArt.borders.radiusMedium,
    margin: pixelArt.spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
  },

  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.md,
    marginTop: pixelArt.spacing.lg,
  },

  divider: {
    height: 2,
    backgroundColor: pixelArt.colors.borderDark,
    marginVertical: pixelArt.spacing.lg,
  },

  quantityInput: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: pixelArt.colors.borderDark,
    borderRadius: 4,
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
    fontSize: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginHorizontal: pixelArt.spacing.md,
    minWidth: 60,
  },

  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: pixelArt.spacing.lg,
    paddingTop: pixelArt.spacing.lg,
    borderTopWidth: 2,
    borderTopColor: pixelArt.colors.borderDark,
  },

  subtotalLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
  },

  subtotalValue: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 18,
  },

  footer: {
    padding: pixelArt.spacing.lg,
    backgroundColor: pixelArt.colors.headerBg,
    borderTopWidth: 3,
    borderTopColor: pixelArt.colors.borderDark,
  },

  addButtonDisabled: {
    opacity: 0.5,
  },
});
