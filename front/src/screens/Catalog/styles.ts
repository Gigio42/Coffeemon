import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

// Coffeemons: 2 por linha (cards maiores e premium)
const COLUMN_COUNT = 2;
const GRID_PADDING = theme.spacing.lg;
const ITEM_MARGIN = theme.spacing.md;
const AVAILABLE_WIDTH = width - (GRID_PADDING * 2) - ITEM_MARGIN;
const CARD_WIDTH = AVAILABLE_WIDTH / COLUMN_COUNT;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // Header - Clean & Minimal
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Tabs - Modern Pill Style
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
  },
  tabTextActive: {
    color: theme.colors.text.primary,
    fontWeight: '800',
  },

  // Search - Glassy Input
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
    opacity: 0.4,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  clearIcon: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    padding: theme.spacing.xs,
  },

  // Filters - Horizontal Scroll
  filtersContainer: {
    marginTop: theme.spacing.lg,
  },
  filtersContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginRight: 8,
  },
  filterEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },

  // Toggle
  toggleContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toggleText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },

  // Content
  listContent: {
    padding: GRID_PADDING,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: ITEM_MARGIN,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.md,
  },

  // Locked Overlay - Glass Effect
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    zIndex: 1,
  },

  // Loading & Error
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.feedback.error,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Items Grid
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_MARGIN,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Glass background
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  itemIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    // Background color set dynamically in index.tsx
  },
  itemIcon: {
    fontSize: 32,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  itemCost: {
    fontSize: 13,
    color: theme.colors.coin.goldDark,
    fontWeight: '800',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
