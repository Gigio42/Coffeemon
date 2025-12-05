import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, radius, typography, getTypeColorScheme } from '../../theme/colors';

const { width } = Dimensions.get('window');

const CARD_WIDTH_LARGE = 220;
const CARD_WIDTH_SMALL = 160;

export const styles = StyleSheet.create({
  // Container
  touchableWrapper: {
    marginBottom: spacing.md,
    shadowColor: colors.shadow.lg,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  touchableWrapperSmall: {
    marginBottom: spacing.sm,
  },

  // Card Base
  cardContainer: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardContainerSmall: {
    borderRadius: radius.lg,
  },
  cardSelected: {
    borderColor: colors.accent.primary,
    borderWidth: 2,
  },
  
  // Image Section
  imageSection: {
    height: 220,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  imageSectionSmall: {
    height: 160,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Header (Name & Type)
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  typeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Main Image
  coffeemonImage: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginTop: spacing.md,
    zIndex: 5,
  },
  coffeemonImageSmall: {
    width: 120,
    height: 120,
    marginTop: spacing.sm,
  },
  
  // Footer / Info Section
  infoSection: {
    padding: spacing.md,
    backgroundColor: colors.surface.card,
  },
  nameContainer: {
    marginBottom: spacing.sm,
  },
  nameText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.black,
    color: colors.text.primary,
    marginBottom: 2,
  },
  levelText: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },
  
  // Stats Preview (HP Bar)
  hpContainer: {
    marginTop: spacing.xs,
  },
  hpBarBg: {
    height: 6,
    backgroundColor: colors.surface.elevated,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  hpText: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 2,
    textAlign: 'right',
  },
  
  // Expanded Content
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.surface.elevated,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface.base,
  },
  tabButtonActive: {
    backgroundColor: colors.button.primary,
  },
  tabText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.inverse,
    fontWeight: typography.weight.bold,
  },
  
  // Tab Content Area
  tabContent: {
    padding: spacing.md,
    minHeight: 120,
  },
  
  // Stats Tab
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    width: 40,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.secondary,
  },
  statBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surface.base,
    borderRadius: radius.full,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: radius.full,
  },
  statValue: {
    width: 30,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'right',
  },
  
  // Moves Tab
  moveItem: {
    backgroundColor: colors.surface.base,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  moveName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  moveType: {
    fontSize: 9,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  moveDesc: {
    fontSize: 10,
    color: colors.text.secondary,
    lineHeight: 14,
  },
  
  // About Tab
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  aboutLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  aboutValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  
  // Actions
  actionButtonContainer: {
    padding: spacing.md,
    paddingTop: 0,
  },
  removeButton: {
    backgroundColor: colors.feedback.errorBg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.feedback.error,
  },
  removeButtonText: {
    color: colors.feedback.error,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.sm,
  },
  
  // Loading/Locked
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 15,
  },
});