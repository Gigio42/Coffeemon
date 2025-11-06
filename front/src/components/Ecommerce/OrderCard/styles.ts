import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  orderHeader: {
    padding: 15,
  },
  orderMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderSummary: {
    marginTop: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 3,
  },
  orderQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
  },
});
