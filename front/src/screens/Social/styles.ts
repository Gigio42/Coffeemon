import { StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

const { colors, spacing, radius, typography } = theme;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.size.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    flexShrink: 0,
  },
  // UID row — lado direito, na mesma linha do título
  uidRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  uidLabel: {
    fontSize: typography.size.xs,
    fontWeight: '700',
    color: colors.text.tertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  uidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border.default,
    minWidth: 90,
  },
  uidChipValue: {
    fontSize: typography.size.sm,
    fontWeight: '800',
    color: colors.accent.primary,
    letterSpacing: 2,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  copyButtonDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  copyIcon: {
    width: 16,
    height: 16,
    tintColor: colors.text.secondary,
  },
  copiedText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },

  // ── Sub-tabs ─────────────────────────────────────────────────────────────────
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface.base,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.background.tertiary,
  },
  tabButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  tabButtonText: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tabButtonTextActive: {
    color: colors.text.inverse,
  },

  // ── Scroll content ───────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // ── Add friend row ───────────────────────────────────────────────────────────
  addFriendRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  addFriendInput: {
    flex: 1,
    height: 46,
    backgroundColor: colors.surface.input,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    fontSize: typography.size.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  addFriendButton: {
    height: 46,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accent.primary,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendButtonText: {
    color: colors.text.inverse,
    fontWeight: '700',
    fontSize: typography.size.sm,
  },
  qrButton: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.base,
    borderWidth: 1,
    borderColor: colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButtonIcon: {
    width: 22,
    height: 22,
    tintColor: colors.text.secondary,
  },

  // ── Section ──────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: typography.size.xs,
    fontWeight: '700',
    color: colors.text.tertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },

  // ── Cards ────────────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.base,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...theme.shadows.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.text.inverse,
    fontWeight: '700',
    fontSize: typography.size.base,
  },
  cardInfo: {
    flex: 1,
  },
  cardUsername: {
    fontSize: typography.size.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cardMeta: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: colors.surface.base,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.accent.primary,
  },
  actionButtonDanger: {
    backgroundColor: colors.feedback.error,
  },
  actionButtonText: {
    color: colors.text.inverse,
    fontSize: typography.size.xs,
    fontWeight: '700',
  },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // ── Unread badge ─────────────────────────────────────────────────────────────
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.text.inverse,
    fontSize: typography.size.xs,
    fontWeight: '700',
  },

  // ── Chat window overlay ───────────────────────────────────────────────────────
  chatOverlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.background.primary,
    zIndex: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.md,
  },
  chatBackButton: {
    padding: spacing.sm,
  },
  chatBackText: {
    fontSize: typography.size.lg,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  chatHeaderUsername: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.text.primary,
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  messageBubbleMine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleTheirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface.elevated,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    lineHeight: 20,
  },
  messageTextMine: {
    color: colors.text.inverse,
  },
  messageTime: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  messageTimeMine: {
    color: 'rgba(255,255,255,0.7)',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.base,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.sm,
  },
  chatInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: colors.surface.input,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.text.inverse,
    fontSize: typography.size.lg,
    fontWeight: '700',
  },
  scrollToBottomBtn: {
    position: 'absolute',
    bottom: spacing.md,
    alignSelf: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  scrollToBottomText: {
    color: colors.text.inverse,
    fontSize: typography.size.lg,
    fontWeight: '700',
    lineHeight: 20,
  },
});
