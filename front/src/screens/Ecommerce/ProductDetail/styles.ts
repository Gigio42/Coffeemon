import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#8B4513',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 8,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  subtotalLabel: {
    fontSize: 18,
    color: '#666',
  },
  subtotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#8B4513',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
