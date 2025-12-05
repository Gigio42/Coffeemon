import { StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme/colors';

export const styles = StyleSheet.create({
  customizer: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },

  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.black,
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: typography.weight.bold,
  },

  // Loading
  loadingText: {
    fontSize: typography.size.base,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  // Slots Container
  slotsContainer: {
    marginBottom: spacing.lg,
  },

  slotsTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },

  slotsHelper: {
    fontSize: typography.size.xs,
    marginBottom: spacing.md,
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  slot: {
    width: '48.5%',
    height: 70,
  },

  slotFilled: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  slotContent: {
    width: '100%',
    alignItems: 'center',
  },

  slotNumber: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 2,
  },

  slotEmpty: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },

  slotMoveName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  slotMoveType: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.85,
    marginTop: 2,
    textAlign: 'center',
  },

  slotEmptyNumber: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },

  slotEmptyText: {
    fontSize: 10,
    fontStyle: 'italic',
  },

  // Moves List
  movesListContainer: {
    flex: 1,
    minHeight: 0,
  },

  movesTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  movesSubtitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  movesList: {
    flex: 1,
  },

  movesListContent: {
    paddingBottom: spacing.lg,
  },

  moveCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xs,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  moveCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.15,
    elevation: 5,
  },

  moveCardDisabled: {
    opacity: 0.35,
  },

  moveCardLeft: {
    flex: 1,
  },

  moveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  moveCardName: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },

  moveCardDescription: {
    fontSize: typography.size.xs,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },

  moveCardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },

  moveCardTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
  },

  moveCardTypeText: {
    fontSize: 11,
    fontWeight: typography.weight.semibold,
  },

  moveCardCategoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    minWidth: 32,
    alignItems: 'center',
  },

  moveCardCategoryText: {
    fontSize: 12,
    fontWeight: typography.weight.bold,
  },

  moveCardPowerBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  moveCardPowerText: {
    fontSize: 11,
    fontWeight: typography.weight.semibold,
  },

  moveCardLevelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
  },

  moveCardLevelText: {
    fontSize: 11,
    fontWeight: typography.weight.bold,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },

  emptyStateText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  emptyStateSubtext: {
    fontSize: typography.size.sm,
    textAlign: 'center',
  },

  checkmark: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: typography.weight.bold,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    backgroundColor: 'transparent',
  },

  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },

  saveButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
  },
});
