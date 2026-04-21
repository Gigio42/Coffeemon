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
    paddingHorizontal: 16,
    paddingTop: 16 + statusBarHeight,
    paddingBottom: 16,
    backgroundColor: '#1C1007',
    shadowColor: '#1C1007',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
  },

  backButton: {
    marginRight: 12,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  backButtonText: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
  },

  // Botões adicionais para estados de erro
  retryButton: {
    ...pixelArt.buttons.action,
    marginBottom: pixelArt.spacing.md,
  },

  retryButtonText: {
    ...pixelArt.buttons.text,
  },

  shopButton: {
    ...pixelArt.buttons.primary,
    marginTop: pixelArt.spacing.lg,
  },

  shopButtonText: {
    ...pixelArt.buttons.text,
  },

  headerTitle: {
    fontFamily: 'monospace',
    color: '#F5D080',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ========================================
  // EMPTY STATE
  // ========================================
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.xxl,
  },

  emptyText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },

  // ========================================
  // LISTA DE PEDIDOS
  // ========================================
  ordersList: {
    gap: pixelArt.spacing.md,
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
  // ESTILOS PARA ÍCONES
  // ========================================
  errorIcon: {
    width: 80,
    height: 80,
    marginBottom: pixelArt.spacing.lg,
  },

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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  headerIcon: {
    width: 22,
    height: 22,
    tintColor: '#F5D080',
  },

  // ========================================
  // MISSING STYLES
  // ========================================
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
    padding: pixelArt.spacing.xxl,
  },

  helpIcon: {
    width: 80,
    height: 80,
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

  settingsIcon: {
    width: 32,
    height: 32,
  },

  loginButton: {
    ...pixelArt.buttons.primary,
  },

  loginButtonText: {
    ...pixelArt.buttons.text,
  },

  profileIcon: {
    width: 32,
    height: 32,
  },

  emptyIcon: {
    width: 36,
    height: 36,
  },
});
