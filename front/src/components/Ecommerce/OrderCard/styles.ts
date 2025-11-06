import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER DO PEDIDO (Borda Externa 3D)
  // ========================================
  orderCard: {
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

  orderCardInner: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.md,
    borderWidth: 2,
    borderTopColor: '#e0e0e0',
    borderLeftColor: '#e0e0e0',
    borderBottomColor: '#f8f8f8',
    borderRightColor: '#f8f8f8',
  },

  // ========================================
  // HEADER DO PEDIDO
  // ========================================
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.md,
    paddingBottom: pixelArt.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: pixelArt.colors.borderDark,
  },

  orderLeft: {
    flex: 1,
  },

  orderId: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    fontSize: 12,
    marginBottom: pixelArt.spacing.xs,
  },

  orderDate: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    fontSize: 11,
  },

  // ========================================
  // STATUS DO PEDIDO
  // ========================================
  statusBadge: {
    paddingVertical: pixelArt.spacing.xs,
    paddingHorizontal: pixelArt.spacing.sm,
    borderRadius: pixelArt.borders.radiusSmall,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  statusPending: {
    backgroundColor: pixelArt.colors.warning,
    borderTopColor: '#f39c12',
    borderLeftColor: '#f39c12',
    borderBottomColor: '#e67e22',
    borderRightColor: '#e67e22',
  },

  statusCompleted: {
    backgroundColor: pixelArt.colors.success,
    borderTopColor: '#2ecc71',
    borderLeftColor: '#2ecc71',
    borderBottomColor: '#27ae60',
    borderRightColor: '#27ae60',
  },

  statusCancelled: {
    backgroundColor: pixelArt.colors.error,
    borderTopColor: '#e74c3c',
    borderLeftColor: '#e74c3c',
    borderBottomColor: '#c0392b',
    borderRightColor: '#c0392b',
  },

  statusText: {
    ...pixelArt.typography.pixelButton,
    color: '#ffffff',
    fontSize: 10,
  },

  // ========================================
  // INFORMAÇÕES DO PEDIDO
  // ========================================
  orderInfo: {
    marginBottom: pixelArt.spacing.md,
  },

  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pixelArt.spacing.xs,
  },

  orderLabel: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    fontSize: 12,
  },

  orderValue: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    fontWeight: '700',
    fontSize: 12,
  },

  orderTotal: {
    ...pixelArt.typography.pixelPrice,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 16,
  },

  // ========================================
  // BOTÃO EXPANDIR
  // ========================================
  expandButton: {
    backgroundColor: pixelArt.colors.buttonPrimary,
    paddingVertical: pixelArt.spacing.sm,
    paddingHorizontal: pixelArt.spacing.md,
    borderRadius: pixelArt.borders.radiusSmall,
    alignItems: 'center',
    marginTop: pixelArt.spacing.sm,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: pixelArt.colors.buttonShadowLight,
    borderLeftColor: pixelArt.colors.buttonShadowLight,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: pixelArt.colors.buttonShadowDark,
    borderRightColor: pixelArt.colors.buttonShadowDark,
  },

  expandButtonText: {
    ...pixelArt.typography.pixelButton,
    color: '#ffffff',
    fontSize: 11,
  },

  // ========================================
  // ITENS DO PEDIDO (Expandido)
  // ========================================
  itemsList: {
    marginTop: pixelArt.spacing.md,
    paddingTop: pixelArt.spacing.md,
    borderTopWidth: 2,
    borderTopColor: pixelArt.colors.borderDark,
  },

  itemsTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.sm,
    fontSize: 12,
  },

  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pixelArt.spacing.xs,
    paddingVertical: pixelArt.spacing.xs,
    paddingHorizontal: pixelArt.spacing.sm,
    backgroundColor: '#f8f8f8',
    borderRadius: pixelArt.borders.radiusSmall,
  },

  itemName: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    flex: 1,
    fontSize: 11,
  },

  itemQuantity: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    marginHorizontal: pixelArt.spacing.sm,
    fontSize: 11,
  },

  itemPrice: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.coffeePrimary,
    fontWeight: '700',
    fontSize: 11,
  },
});
