import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER DO ITEM (Borda Externa 3D)
  // ========================================
  cartItem: {
    padding: pixelArt.spacing.sm,
    backgroundColor: pixelArt.colors.cardOuterBg,
    borderRadius: pixelArt.borders.radiusMedium,
    marginBottom: pixelArt.spacing.md,
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

  cartItemInner: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.md,
    flexDirection: 'row',
    borderWidth: 2,
    borderTopColor: '#e0e0e0',
    borderLeftColor: '#e0e0e0',
    borderBottomColor: '#f8f8f8',
    borderRightColor: '#f8f8f8',
  },

  // ========================================
  // IMAGEM DO PRODUTO
  // ========================================
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: pixelArt.borders.radiusSmall,
    marginRight: pixelArt.spacing.md,
    backgroundColor: '#f0e0d0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },

  // ========================================
  // INFO DO PRODUTO
  // ========================================
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  itemName: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    fontSize: 12,
    marginBottom: pixelArt.spacing.xs,
  },

  itemPrice: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.coffeePrimary,
    fontWeight: '700',
    marginBottom: pixelArt.spacing.sm,
    fontSize: 13,
  },

  // ========================================
  // CONTROLES DE QUANTIDADE
  // ========================================
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.sm,
  },

  quantityButton: {
    ...pixelArt.buttons.small,
  },

  quantityButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 16,
  },

  quantityText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    fontWeight: '700',
    marginHorizontal: pixelArt.spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },

  subtotal: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 13,
  },

  // ========================================
  // BOTÃO REMOVER
  // ========================================
  removeButton: {
    ...pixelArt.buttons.danger,
    alignSelf: 'flex-start',
    paddingVertical: pixelArt.spacing.xs,
    paddingHorizontal: pixelArt.spacing.sm,
  },

  removeButtonText: {
    fontSize: 16,
  },

  removeButtonIcon: {
    width: 32,
    height: 32,
  },
});
