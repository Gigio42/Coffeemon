import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

const CONTAINER_PADDING = 16;
const GAP = 12;
const COLUMNS = 3;
const AVAILABLE_WIDTH = width - (CONTAINER_PADDING * 2);
const ITEM_WIDTH = Math.floor((AVAILABLE_WIDTH - (GAP * (COLUMNS - 1))) / COLUMNS);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // Header
  header: {
    paddingTop: 16,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -1,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 251, 235, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(254, 243, 199, 1)',
    ...theme.shadows.sm,
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  coinAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D97706',
  },
  
  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: theme.radius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
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
  activeTabText: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  
  // Content
  content: {
    flex: 1,
  },
  
  // Gacha Banner Section
  bannersContainer: {
    paddingTop: theme.spacing.lg,
    paddingBottom: 40,
    backgroundColor: theme.colors.background.primary,
    overflow: 'visible',
  },
  bannerCard: {
    width: width - 48,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    height: 220,
  },
  bannerGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  bannerHeader: {
    flex: 1,
  },
  bannerName: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.text.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  bannerDescription: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    lineHeight: 22,
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  bannerCostIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  bannerCostText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  buyButton: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  // Pagination Dots
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
  },
  
  // Dynamic Content
  dynamicContent: {
    flex: 1,
  },
  
  // Obtainable Coffeemons Section
  obtainableSection: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingBottom: 100,
  },
  obtainableHeader: {
    marginBottom: theme.spacing.lg,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  obtainableTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  obtainableSubtitle: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  obtainableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  coffeemonIconContainer: {
    width: ITEM_WIDTH,
    aspectRatio: 1,
    borderRadius: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coffeemonIcon: {
    width: '75%',
    height: '65%',
    marginBottom: 6,
  },
  coffeemonIconName: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  typeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
  },
  
  // Items Tab
  itemsContainer: {
    padding: theme.spacing.lg,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
  },
  itemCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md * 3) / 2,
    margin: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  itemIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  itemIcon: {
    fontSize: 32,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCostIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  itemCostText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D97706',
  },
  itemBuyButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: theme.colors.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  itemBuyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xxl,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.feedback.error,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.radius.lg,
    ...theme.shadows.md,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
