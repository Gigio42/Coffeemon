import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER MINIMALISTA
  // ========================================
  cartItem: {
    padding: 4,
    backgroundColor: '#f5f2e8',
    borderRadius: 8,
    marginBottom: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },

  cartItemInner: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 10,
  },

  // ========================================
  // LAYOUT HORIZONTAL COMPACTO
  // ========================================
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ========================================
  // IMAGEM PEQUENA E COMPACTA
  // ========================================
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    resizeMode: 'cover',
  },

  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f5f2e8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 24,
    opacity: 0.3,
  },

  // ========================================
  // INFORMAÇÕES CENTRAIS
  // ========================================
  centerInfo: {
    flex: 1,
    gap: 4,
  },

  itemName: {
    ...pixelArt.typography.pixelSubtitle,
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },

  unitPrice: {
    ...pixelArt.typography.pixelBody,
    color: '#888888',
    fontSize: 11,
  },

  // ========================================
  // CONTROLES DE QUANTIDADE INLINE
  // ========================================
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },

  quantityButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: '#a0612f',
    borderLeftColor: '#a0612f',
    borderBottomColor: '#6b3410',
    borderRightColor: '#6b3410',
  },

  quantityButtonPressed: {
    backgroundColor: '#6b3410',
    borderTopColor: '#6b3410',
    borderLeftColor: '#6b3410',
    borderBottomColor: '#a0612f',
    borderRightColor: '#a0612f',
  },

  quantityButtonDisabled: {
    opacity: 0.3,
  },

  quantityButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  quantityText: {
    ...pixelArt.typography.pixelBody,
    color: '#333333',
    fontWeight: '700',
    fontSize: 14,
    minWidth: 20,
    textAlign: 'center',
  },

  // ========================================
  // SEÇÃO DIREITA: REMOVER E SUBTOTAL
  // ========================================
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },

  removeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f44336',
    borderRadius: 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: '#ef5350',
    borderLeftColor: '#ef5350',
    borderBottomColor: '#c62828',
    borderRightColor: '#c62828',
  },

  removeButtonPressed: {
    backgroundColor: '#c62828',
    borderTopColor: '#c62828',
    borderLeftColor: '#c62828',
    borderBottomColor: '#ef5350',
    borderRightColor: '#ef5350',
  },

  removeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },

  subtotalValue: {
    ...pixelArt.typography.pixelPrice,
    color: '#8B4513',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
