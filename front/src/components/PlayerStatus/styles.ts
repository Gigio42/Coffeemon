import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    position: 'relative',
  },

  // Gear button
  gearButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  gearIcon: {
    width: 22,
    height: 22,
    tintColor: theme.colors.accent.primary,
  },

  // Player Info
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },

  avatarText: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.inverse,
  },

  playerDetails: {
    flex: 1,
  },

  playerName: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },

  levelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },

  levelLabel: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
  },

  levelValue: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.primary,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
  },

  statIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.accent.primary,
  },

  statIconEmoji: {
    fontSize: 24,
  },

  statInfo: {
    flex: 1,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  statValue: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.primary,
  },

  // XP Section
  xpSection: {
    gap: theme.spacing.xs,
  },

  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  xpLabel: {
    fontSize: 11,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
  },

  xpText: {
    fontSize: 11,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },

  xpBarBackground: {
    height: 8,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },

  xpBarFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },

  // ── Settings Modal ────────────────────────────────────────────────────────────
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  menuCard: {
    width: Math.min(SCREEN_WIDTH - theme.spacing.xl * 2, 340),
    backgroundColor: theme.colors.surface.base,
    borderRadius: theme.radius.xxl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },

  // Profile header inside card
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  menuAvatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuAvatarText: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.black,
    color: theme.colors.text.inverse,
  },
  menuUserInfo: {
    flex: 1,
    gap: 2,
  },
  menuUsername: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },
  menuUid: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
    letterSpacing: 1,
  },
  menuLevelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  menuLevelText: {
    fontSize: 10,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.inverse,
  },
  menuCloseButton: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuCloseText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.bold,
    lineHeight: 16,
  },

  // Divider
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing.md,
  },

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  menuItemEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  menuItemBody: {
    flex: 1,
    gap: 1,
  },
  menuItemTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
  },
  menuItemTitleDanger: {
    color: theme.colors.feedback.error,
  },
  menuItemSub: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  menuItemArrow: {
    fontSize: 22,
    color: theme.colors.text.tertiary,
    lineHeight: 24,
  },

  // Loading & Error
  loadingText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  errorText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.error,
    textAlign: 'center',
  },
});
