import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER PRINCIPAL COM GRADIENTE - Como no HTML
  // ========================================
  container: {
    flex: 1,
    backgroundColor: '#e0f0ff', // --bg-light - fallback para o gradiente
  },

  // Overlay de scanline (simulação de CRT)
  scanlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    opacity: 0.15,
  },

  // ========================================
  // HEADER PIXEL ART
  // ========================================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: pixelArt.spacing.lg,
    backgroundColor: pixelArt.colors.headerBg,
    borderBottomWidth: 3,
    borderBottomColor: pixelArt.colors.borderDark,
    // Borda 3D no header
    borderTopWidth: 2,
    borderTopColor: '#ffffff',
    ...pixelArt.shadows.innerBorder,
  },

  headerTitle: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 16,
  },

  // ========================================
  // BOTÃO DO CARRINHO COM BADGE
  // ========================================
  cartButton: {
    ...pixelArt.buttons.primary,
    position: 'relative',
  },

  cartIcon: {
    fontSize: 20,
  },

  cartIconImage: {
    width: 36,
    height: 36,
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: pixelArt.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    // Borda do badge
    borderWidth: 2,
    borderColor: '#ffffff',
    ...pixelArt.shadows.button,
  },

  badgeText: {
    ...pixelArt.typography.pixelButton,
    color: '#ffffff',
    fontSize: 10,
  },

  // ========================================
  // SCROLL VIEW E GRID
  // ========================================
  scrollView: {
    flex: 1,
  },

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 80,
  },

  // ========================================
  // LOADING E ERROR STATES
  // ========================================
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: pixelArt.colors.bgLight,
  },

  loadingText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textDark,
    marginTop: pixelArt.spacing.md,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.xl,
    backgroundColor: pixelArt.colors.bgLight,
  },

  errorText: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.error,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },

  retryButton: {
    ...pixelArt.buttons.action,
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.xl,
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

  retryButtonText: {
    ...pixelArt.buttons.text,
  },
});
