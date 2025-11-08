
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { pixelArt } from '../../../theme';

// Para Android, considera a altura da status bar
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
  },

  scrollView: {
    flex: 1,
  },

  gradientContainer: {
    flex: 1,
  },

  contentContainer: {
    padding: pixelArt.spacing.lg,
    paddingBottom: 100,
  },

  // ========================================
  // HEADER
  // ========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pixelArt.spacing.lg,
    paddingTop: pixelArt.spacing.lg + statusBarHeight, // Evita sobreposição com status bar
    backgroundColor: '#f5f2e8', // Cor creme clara
    borderBottomWidth: 3,
    borderBottomColor: '#d4c5a0', // Borda creme mais escura
    borderTopWidth: 2,
    borderTopColor: '#faf8f0', // Borda creme mais clara
    ...pixelArt.shadows.innerBorder,
  },

  backButton: {
    marginRight: pixelArt.spacing.md,
    padding: 8,
  },

  backButtonText: {
    fontSize: 24,
    color: '#8B7355',
    fontWeight: '700',
  },

  headerTitle: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 16,
  },

  // ========================================
  // AVATAR E INFO DO USUÁRIO
  // ========================================
  profileCard: {
    padding: pixelArt.spacing.lg,
    backgroundColor: '#f5f2e8',
    borderRadius: pixelArt.borders.radiusMedium,
    marginBottom: pixelArt.spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    ...pixelArt.shadows.card,
  },

  profileInner: {
    backgroundColor: '#ffffff',
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0e6d2',
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor: pixelArt.colors.coffeePrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: pixelArt.colors.coffeeLight,
    borderLeftColor: pixelArt.colors.coffeeLight,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: pixelArt.colors.coffeeDark,
    borderRightColor: pixelArt.colors.coffeeDark,
  },

  avatarText: {
    ...pixelArt.typography.pixelTitle,
    color: '#ffffff',
    fontSize: 40,
  },

  username: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.sm,
    fontSize: 18,
  },

  email: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    marginBottom: pixelArt.spacing.xs,
  },

  role: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.buttonPrimary,
    fontSize: 12,
  },

  // ========================================
  // CARD DE INFORMAÇÕES
  // ========================================
  infoCard: {
    padding: pixelArt.spacing.lg,
    backgroundColor: '#f5f2e8',
    borderRadius: pixelArt.borders.radiusMedium,
    marginBottom: pixelArt.spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    ...pixelArt.shadows.card,
  },

  infoInner: {
    backgroundColor: '#ffffff',
    borderRadius: pixelArt.borders.radiusSmall,
    padding: pixelArt.spacing.lg,
    borderWidth: 2,
    borderColor: '#f0e6d2',
  },

  infoTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: pixelArt.spacing.sm,
  },

  infoLabel: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    flex: 1,
  },

  infoValue: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    fontWeight: '700',
    flex: 2,
  },

  // ========================================
  // BOTÕES DE AÇÃO
  // ========================================
  actionsContainer: {
    gap: pixelArt.spacing.md,
  },

  actionButton: {
    ...pixelArt.buttons.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: pixelArt.spacing.sm,
    paddingVertical: pixelArt.spacing.lg,
  },

  logoutButton: {
    ...pixelArt.buttons.danger,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: pixelArt.spacing.sm,
    paddingVertical: pixelArt.spacing.lg,
  },

  actionButtonText: {
    ...pixelArt.buttons.text,
  },

  actionButtonIcon: {
    width: 34,
    height: 34,
  },

  actionButtonArrow: {
    ...pixelArt.buttons.text,
    fontSize: 16,
  },

  // Botões para estados de erro
  retryButton: {
    ...pixelArt.buttons.action,
    marginBottom: pixelArt.spacing.md,
  },

  retryButtonText: {
    ...pixelArt.buttons.text,
  },

  loginButton: {
    ...pixelArt.buttons.primary,
  },

  loginButtonText: {
    ...pixelArt.buttons.text,
  },

  // ========================================
  // LOADING
  // ========================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    marginTop: pixelArt.spacing.md,
  },

  // ========================================
  // ESTADOS DE ERRO
  // ========================================
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
    padding: pixelArt.spacing.xxl,
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: pixelArt.spacing.lg,
  },

  errorText: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.error,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.md,
  },

  errorSubtext: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },

  // ========================================
  // ESTILOS PARA ÍCONES
  // ========================================
  retryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  retryIcon: {
    width: 32,
    height: 32,
  },

  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  loginIcon: {
    width: 32,
    height: 32,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIcon: {
    width: 36,
    height: 36,
  },

  // ========================================
  // MISSING STYLES
  // ========================================
  profileHeader: {
    alignItems: 'center',
    padding: pixelArt.spacing.xxl,
    backgroundColor: '#f5f2e8',
    borderRadius: pixelArt.borders.radiusMedium,
    margin: pixelArt.spacing.lg,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: pixelArt.colors.coffeePrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.md,
  },



  adminBadge: {
    backgroundColor: pixelArt.colors.buttonPrimary,
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.xs,
    borderRadius: 4,
    marginTop: pixelArt.spacing.sm,
  },

  adminBadgeText: {
    ...pixelArt.typography.pixelBody,
    color: '#ffffff',
    fontSize: 12,
  },

  section: {
    margin: pixelArt.spacing.lg,
  },

  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.md,
  },

  divider: {
    height: 1,
    backgroundColor: pixelArt.colors.borderDark,
    marginVertical: pixelArt.spacing.sm,
  },

  helpIcon: {
    width: 80,
    height: 80,
    marginBottom: pixelArt.spacing.lg,
  },

  settingsIcon: {
    width: 32,
    height: 32,
  },

  profileIcon: {
    width: 32,
    height: 32,
  },

  footer: {
    alignItems: 'center',
    padding: pixelArt.spacing.xxl,
  },

  footerText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    fontSize: 12,
  },
});
