import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const HORIZONTAL_PADDING = theme.spacing.lg;
const GRID_GAP = theme.spacing.sm;
const AVAILABLE_WIDTH = width - (HORIZONTAL_PADDING * 2) - (GRID_GAP * (COLUMN_COUNT - 1));
const CARD_WIDTH = Math.floor(AVAILABLE_WIDTH / COLUMN_COUNT);

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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
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
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: HORIZONTAL_PADDING,
    backgroundColor: theme.colors.surface.base,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
    zIndex: 10,
    overflow: 'hidden',
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: GRID_GAP,
  },
  deckSlotContainer: {
    flex: 1,
    maxWidth: (width - (HORIZONTAL_PADDING * 2) - (GRID_GAP * 2)) / 3,
    minHeight: 152,
    maxHeight: 152,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
  },
  emptySlot: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    borderStyle: 'dashed',
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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

  // Search & Filters - Consistent with Catalog
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: HORIZONTAL_PADDING,
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
    paddingBottom: theme.spacing.xs,
    overflow: 'visible',
  },
  typeFilterContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 8,
    gap: 8,
    alignItems: 'center',
    overflow: 'visible',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: theme.radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: theme.spacing.sm,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: GRID_GAP,
  },
  collectionItem: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.sm,
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
