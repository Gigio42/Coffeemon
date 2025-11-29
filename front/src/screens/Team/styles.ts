import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GRID_PADDING = 8;
const ITEM_MARGIN = 4;
const AVAILABLE_WIDTH = width - (GRID_PADDING * 2) - (ITEM_MARGIN * 2 * COLUMN_COUNT);
const ITEM_WIDTH = AVAILABLE_WIDTH / COLUMN_COUNT;

// Card dimensions (Small variant)
const CARD_ORIGINAL_WIDTH = 224; // 160 * 1.4
const CARD_ORIGINAL_HEIGHT = 280; // Approx height including margins
const SCALE_FACTOR = ITEM_WIDTH / CARD_ORIGINAL_WIDTH;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
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
  
  // Deck Section
  deckSection: {
    backgroundColor: '#E6CCB2', // Slightly darker beige for contrast
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Courier New',
  },
  elixirBadge: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  elixirText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Courier New',
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  deckSlotContainer: {
    width: ITEM_WIDTH,
    height: CARD_ORIGINAL_HEIGHT * SCALE_FACTOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Wrapper to contain the scaled card without affecting layout flow
  cardWrapper: {
    width: CARD_ORIGINAL_WIDTH,
    height: CARD_ORIGINAL_HEIGHT,
    transform: [{ scale: SCALE_FACTOR }],
    // We need to center the scaled element within the slot
    // Since transform origin is center, and we want it to fit in the slot...
    // Actually, if we put this in a container of size ITEM_WIDTH, and scale it...
    // It's easier to just have a container of the target size, and center the scaled content.
  },
  // New approach for card scaling
  cardContainer: {
    width: ITEM_WIDTH,
    height: CARD_ORIGINAL_HEIGHT * SCALE_FACTOR,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Clip any potential overflow
  },
  cardScaler: {
    transform: [{ scale: SCALE_FACTOR }],
    width: CARD_ORIGINAL_WIDTH,
    height: CARD_ORIGINAL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptySlot: {
    width: '90%',
    height: '90%',
    borderWidth: 2,
    borderColor: '#BBB',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  emptySlotText: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Courier New',
  },

  // Collection Section
  collectionSection: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  collectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D7CCC8',
    backgroundColor: '#F5E6D3',
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Courier New',
  },
  collectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Courier New',
  },
  collectionGrid: {
    padding: GRID_PADDING,
    paddingBottom: 100,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  collectionItem: {
    width: ITEM_WIDTH,
    height: CARD_ORIGINAL_HEIGHT * SCALE_FACTOR,
    margin: ITEM_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCollectionText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 14,
    fontFamily: 'Courier New',
    width: '100%',
  },

  // Items Section
  itemsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D7CCC8',
    backgroundColor: '#F5E6D3',
    marginTop: 16,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Courier New',
  },
  itemsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Courier New',
  },
  itemCard: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2, // Slightly taller than wide
    margin: ITEM_MARGIN,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  itemBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Courier New',
    marginTop: 4,
  },
});
