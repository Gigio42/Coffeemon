import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

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