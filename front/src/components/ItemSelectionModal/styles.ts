import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 3,
    borderColor: '#4A4A4C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4A4A4C',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemCardDisabled: {
    opacity: 0.5,
    borderColor: '#4A4A4C',
  },
  itemIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemIcon: {
    fontSize: 32,
  },
  quantityBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 28,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemNameDisabled: {
    color: '#8E8E93',
  },
  itemDescription: {
    fontSize: 14,
    color: '#AEAEB2',
  },
  itemDescriptionDisabled: {
    color: '#636366',
  },
  outOfStockBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
