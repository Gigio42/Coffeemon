import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; // 3 columns with padding

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3', // Light beige background
  },
  header: {
    padding: 20,
    backgroundColor: '#8B4513', // Saddle brown
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Courier New', // Pixel-art friendly font
  },
  subtitle: {
    fontSize: 14,
    color: '#E6CCB2',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Courier New',
  },
  listContent: {
    padding: 12,
    paddingBottom: 100, // Space for bottom nav
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 12,
    alignItems: 'center',
    height: 200, // Fixed height container for the scaled card
    overflow: 'hidden', // Clip any overflow from scaling
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8B4513',
    fontFamily: 'Courier New',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    fontFamily: 'Courier New',
  },
  
  // Items Section Styles
  itemsSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#D7CCC8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: 'Courier New',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: (width - 36) / 2, // 2 columns for items
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#D7CCC8',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Courier New',
  },
  itemCost: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Courier New',
  },
  itemDescription: {
    fontSize: 10,
    color: '#795548',
    textAlign: 'center',
    fontFamily: 'Courier New',
    lineHeight: 14,
  },
});
