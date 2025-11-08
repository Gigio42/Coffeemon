import { StyleSheet, Platform, StatusBar } from 'react-native';
import { pixelArt } from '../../../theme';

// Para Android, considera a altura da status bar
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f0', // Cor creme muito clara para background
  },

  scrollView: {
    flex: 1,
  },

  gradientContainer: {
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
  // IMAGEM DO PRODUTO COM CONTAINER PIXELADO
  // ========================================
  imageContainer: {
    margin: pixelArt.spacing.lg,
    padding: pixelArt.spacing.md,
    backgroundColor: '#ffffff',
    borderRadius: pixelArt.borders.radiusMedium,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    ...pixelArt.shadows.card,
    elevation: 4,
  },

  imageWrapper: {
    backgroundColor: 'transparent',
    borderRadius: pixelArt.borders.radiusSmall,
    overflow: 'hidden',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  placeholderImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0e6d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pixelArt.borders.radiusSmall,
  },

  placeholderText: {
    ...pixelArt.typography.pixelBody,
    color: '#c9b896',
    fontSize: 14,
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

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: pixelArt.spacing.md,
  },

  productName: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.textDark,
    fontSize: 20,
    flex: 1,
    marginRight: pixelArt.spacing.md,
  },

  stockBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
    borderRadius: 4,
    borderWidth: 2,
    borderTopColor: '#66BB6A',
    borderLeftColor: '#66BB6A',
    borderBottomColor: '#388E3C',
    borderRightColor: '#388E3C',
  },

  stockBadgeText: {
    ...pixelArt.typography.pixelBody,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  priceContainer: {
    backgroundColor: '#fff9f0',
    padding: pixelArt.spacing.md,
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: 2,
    borderColor: '#f0e6d2',
    marginBottom: pixelArt.spacing.lg,
  },

  priceLabel: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    fontSize: 12,
    marginBottom: pixelArt.spacing.xs,
  },

  productDescription: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    lineHeight: 22,
    fontSize: 14,
  },

  productPrice: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 28,
  },

  // ========================================
  // CONTROLES DE QUANTIDADE
  // ========================================
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: pixelArt.spacing.md,
  },

  quantityLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginRight: pixelArt.spacing.md,
  },

  quantityButton: {
    backgroundColor: '#8B4513',
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: '#a0612f',
    borderLeftColor: '#a0612f',
    borderBottomColor: '#6b3410',
    borderRightColor: '#6b3410',
    ...pixelArt.shadows.card,
  },

  quantityButtonDisabled: {
    opacity: 0.5,
  },

  quantityButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
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
    backgroundColor: '#8B4513',
    flex: 1,
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.md,
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: 3,
    borderTopColor: '#a0612f',
    borderLeftColor: '#a0612f',
    borderBottomColor: '#6b3410',
    borderRightColor: '#6b3410',
    ...pixelArt.shadows.card,
    elevation: 5,
  },

  addButtonLoading: {
    opacity: 0.7,
  },

  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  addButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
  },

  // ========================================
  // MISSING STYLES
  // ========================================
  infoContainer: {
    padding: pixelArt.spacing.xl,
    backgroundColor: '#ffffff',
    borderRadius: pixelArt.borders.radiusMedium,
    margin: pixelArt.spacing.lg,
    marginTop: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    ...pixelArt.shadows.card,
    elevation: 3,
  },

  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: '#8B4513',
    marginBottom: pixelArt.spacing.md,
    fontSize: 14,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#f0e6d2',
    marginVertical: pixelArt.spacing.xl,
  },

  quantityInput: {
    backgroundColor: '#f5f2e8',
    borderWidth: 2,
    borderColor: '#d4c5a0',
    borderRadius: 6,
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: pixelArt.spacing.sm,
    minWidth: 50,
    color: '#8B4513',
  },

  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: pixelArt.spacing.xl,
    paddingTop: pixelArt.spacing.xl,
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.lg,
    backgroundColor: '#fff9f0',
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: 2,
    borderColor: '#f0e6d2',
  },

  subtotalLabel: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },

  subtotalValue: {
    ...pixelArt.typography.pixelPrice,
    color: '#8B4513',
    fontSize: 22,
    fontWeight: 'bold',
  },

  footer: {
    padding: pixelArt.spacing.md,
    backgroundColor: '#ffffff',
    borderTopWidth: 3,
    borderTopColor: '#f0e6d2',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  subtotalContainerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.sm,
    paddingHorizontal: pixelArt.spacing.xs,
  },

  subtotalLabelFooter: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    fontSize: 12,
    fontWeight: '600',
  },

  subtotalValueFooter: {
    ...pixelArt.typography.pixelPrice,
    color: '#8B4513',
    fontSize: 14,
    fontWeight: 'bold',
  },

  addButtonDisabled: {
    opacity: 0.6,
  },
});
