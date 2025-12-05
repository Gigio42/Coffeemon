import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GRID_PADDING = theme.spacing.lg;
const ITEM_MARGIN = theme.spacing.sm;
const AVAILABLE_WIDTH = width - (GRID_PADDING * 2) - (ITEM_MARGIN * (COLUMN_COUNT - 1));
const CARD_WIDTH = AVAILABLE_WIDTH / COLUMN_COUNT;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // Header - Clean & Minimal
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  elixirBadge: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    ...theme.shadows.sm,
  },
  elixirText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  
  // Deck Section - Premium Look
  deckSection: {
    paddingVertical: theme.spacing.lg,
    backgroundColor: '#FFFFFF', // White background for contrast
    marginBottom: theme.spacing.md,
    borderBottomLeftRadius: theme.radius.xxl,
    borderBottomRightRadius: theme.radius.xxl,
    ...theme.shadows.sm,
    zIndex: 10,
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
  },
  deckSlotContainer: {
    flex: 1,
    maxWidth: (width - theme.spacing.lg * 2 - 24) / 3,
    aspectRatio: 0.8,
  },
  emptySlot: {
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: 'dashed',
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
  },
  emptySlotText: {
    color: theme.colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  
  // Collection Section
  collectionSection: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  collectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 0,
  },
  collectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  collectionSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // Search & Filters - Consistent with Catalog
  filterSection: {
    marginBottom: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    padding: theme.spacing.xs,
  },
  
  typeFilterContainer: {
    marginTop: theme.spacing.md,
  },
  typeFilterContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginRight: 8,
    ...theme.shadows.sm,
  },
  typeChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0,0,0,0.05)',
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: theme.radius.full,
    marginRight: 6,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  
  // Collection Grid
  collectionList: {
    padding: GRID_PADDING,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: ITEM_MARGIN,
  },
  collectionItem: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.sm,
  },
  
  // Inventory Section
  inventorySection: {
    marginTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    paddingTop: theme.spacing.lg,
  },
  itemsHeader: {
    marginBottom: theme.spacing.md,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  itemsSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  itemCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md * 2) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...theme.shadows.sm,
  },
  itemBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  
  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyCollectionText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
