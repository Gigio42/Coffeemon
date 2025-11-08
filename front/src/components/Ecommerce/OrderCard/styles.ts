import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER DO PEDIDO (Borda Externa 3D)
  // ========================================
  orderCard: {
    padding: pixelArt.spacing.md,
    backgroundColor: '#f5f2e8',
    borderRadius: pixelArt.borders.radiusMedium,
    marginHorizontal: pixelArt.spacing.lg,
    marginBottom: pixelArt.spacing.md,
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

  orderCardInner: {
    backgroundColor: '#ffffff',
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.lg,
    borderWidth: 2,
    borderColor: '#f0e6d2',
  },

  // ========================================
  // HEADER DO PEDIDO
  // ========================================
  orderHeader: {
    flexDirection: 'column',
    marginBottom: 0,
  },

  orderMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.sm,
  },

  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: pixelArt.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f0e6d2',
  },

  orderLeft: {
    flex: 1,
  },

  orderId: {
    ...pixelArt.typography.pixelSubtitle,
    color: '#8B4513',
    fontSize: 14,
    fontWeight: 'bold',
  },

  orderStatus: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    fontWeight: 'bold',
  },

  orderDate: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    fontSize: 11,
  },

  orderQuantity: {
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
    color: '#8B4513',
    fontSize: 16,
    fontWeight: 'bold',
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
  orderDetails: {
    marginTop: pixelArt.spacing.md,
    paddingTop: pixelArt.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f0e6d2',
  },

  detailsTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: '#8B4513',
    marginBottom: pixelArt.spacing.sm,
    fontSize: 12,
    fontWeight: 'bold',
  },

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
    paddingVertical: pixelArt.spacing.sm,
    paddingHorizontal: pixelArt.spacing.md,
    backgroundColor: '#faf8f0',
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: 1,
    borderColor: '#f0e6d2',
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
