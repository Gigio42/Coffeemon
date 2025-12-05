import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme/colors';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8F9FA',
  },
  
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: -statusBarHeight,
    paddingTop: statusBarHeight,
  },
  
  loadingContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundColor: '#FFFFFF',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  loadingLogoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  loadingIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  loadingLogoEmoji: {
    fontSize: 48,
  },

  loadingLogo: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },

  loadingSubtitle: {
    fontSize: typography.size.sm,
    color: '#64748B',
    marginBottom: spacing.xxl * 2.5,
    letterSpacing: 0.5,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Modern Loading Bar
  loadingBarContainer: {
    position: 'absolute',
    bottom: spacing.xxl * 3,
    left: spacing.xxl,
    right: spacing.xxl,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: radius.full,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  
  loadingBar: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: radius.full,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  
  loadingBarGlow: {
    position: 'absolute',
    right: -30,
    top: -4,
    width: 80,
    height: 16,
    backgroundColor: '#38BDF8',
    borderRadius: radius.full,
    opacity: 0.7,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  
  loadingText: {
    position: 'absolute',
    bottom: spacing.xxl * 3 + 32,
    color: '#64748B',
    fontSize: typography.size.sm,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  loadingPercentage: {
    position: 'absolute',
    bottom: spacing.xxl * 3 + 64,
    color: '#0F172A',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -2,
  },
  
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg + statusBarHeight,
    paddingBottom: spacing.md,
    elevation: 0,
    shadowColor: 'transparent',
  },

  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.black,
    color: '#1A1A1A',
  },

  backButton: {
    padding: spacing.sm,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#1A1A1A',
    fontWeight: typography.weight.bold,
  },
  
  floatingBackButton: {
    position: 'absolute',
    top: statusBarHeight + spacing.lg,
    left: spacing.lg,
    zIndex: 1000,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  floatingBackButtonText: {
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: typography.weight.bold,
  },

  // Debug Menu
  debugMenuButton: {
    position: 'absolute',
    top: statusBarHeight + spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  debugMenuIcon: {
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: typography.weight.bold,
  },

  debugMenuPopup: {
    position: 'absolute',
    top: statusBarHeight + spacing.lg + 50,
    right: spacing.lg,
    zIndex: 1001,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 200,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },

  debugMenuItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  debugMenuItemLast: {
    borderBottomWidth: 0,
  },

  debugMenuItemText: {
    fontSize: typography.size.sm,
    color: '#1A1A1A',
    fontWeight: typography.weight.medium,
  },
  
  // Background & Scroll
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F9FA',
  },

  dynamicBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8F9FA',
  },

  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
  },
  
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },

  scrollBody: {
    paddingTop: spacing.md,
    paddingBottom: 0,
  },


  // Team Display - Nova visualização dinâmica
  teamContainer: {
    width: '100%',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  teamTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },

  teamCount: {
    fontSize: typography.size.sm,
    color: '#6B7280',
    fontWeight: '600',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  // Player Header
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: statusBarHeight + spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: spacing.md,
    backgroundColor: '#F3F4F6',
  },
  
  playerName: {
    fontSize: typography.size.lg,
    color: '#1A1A1A',
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },

  bottomBarPill: {
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  bottomBarPillLeft: {
    width: 64,
    height: 64,
  },

  bottomBarPillCenter: {
    width: 80,
    height: 80,
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    transform: [{ translateY: -20 }],
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  bottomBarPillRight: {
    width: 64,
    height: 64,
  },

  bottomBarPillDisabled: {
    opacity: 0.4,
    backgroundColor: '#F9FAFB',
  },

  bottomBarIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#1A1A1A',
  },

  bottomBarIconCenter: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  // Sheet Styles
  sheetSectionContent: {
    flex: 1,
    width: '100%',
    padding: spacing.md,
    paddingTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },

  backpackSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: spacing.lg,
    width: '100%',
  },

  selectorButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
  },

  selectorButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  selectorButtonText: {
    fontSize: typography.size.sm,
    color: '#6B7280',
    fontWeight: typography.weight.semibold,
  },

  selectorButtonTextActive: {
    color: '#1A1A1A',
    fontWeight: typography.weight.bold,
  },

  sheetEmptyText: {
    fontSize: typography.size.base,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: spacing.xl,
    fontStyle: 'italic',
  },

  sheetCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: spacing.md,
  },

  sheetCardWrapper: {
    width: 160,
    marginBottom: spacing.md,
  },

  sheetCardScaler: {
    width: '100%',
    alignItems: 'center',
  },

  sheetItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  sheetItemCard: {
    width: '48%',
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sheetItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  sheetItemEmoji: {
    fontSize: 24,
  },

  sheetItemBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: '#3B82F6',
  },

  sheetItemBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: typography.weight.bold,
  },

  sheetItemName: {
    fontSize: typography.size.sm,
    color: '#1A1A1A',
    fontWeight: typography.weight.semibold,
  },

  // Bots List
  sheetBotsList: {
    width: '100%',
    gap: spacing.md,
  },

  sheetBotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sheetBotButtonDisabled: {
    opacity: 0.5,
  },

  sheetBotImage: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    marginRight: spacing.md,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sheetBotContent: {
    flex: 1,
  },

  sheetBotInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },

  sheetBotLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: '#1A1A1A',
  },

  sheetBotDescription: {
    fontSize: typography.size.xs,
    color: '#6B7280',
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
});
