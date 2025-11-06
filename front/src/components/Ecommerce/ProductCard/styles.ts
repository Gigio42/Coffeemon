import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
});
