import { StyleSheet, Platform, StatusBar } from 'react-native';
import { pixelArt } from '../../../theme';

// Para Android, considera a altura da status bar
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER PRINCIPAL COM GRADIENTE - Como no HTML
  // ========================================
  container: {
    flex: 1,
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
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
    padding: pixelArt.spacing.xl, // Padding maior
    backgroundColor: '#f5f2e8', // Cor creme clara
    borderBottomWidth: 3,
    borderBottomColor: '#d4c5a0', // Borda creme mais escura
    // Borda 3D no header
    borderTopWidth: 2,
    borderTopColor: '#faf8f0', // Borda creme mais clara
    ...pixelArt.shadows.innerBorder,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  // ========================================
  // BARRA DE PESQUISA
  // ========================================
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0, // Remove padding vertical
    height: 48, // Altura fixa
    borderWidth: 2,
    borderColor: '#d4c5a0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },

  searchIcon: {
    width: 24, // Maior para melhor visibilidade
    height: 24,
    marginRight: 12, // Mais espaço
    opacity: 1, // Totalmente visível
    // Removido tintColor para manter cor original
  },

  searchInput: {
    flex: 1,
    ...pixelArt.typography.pixelBody,
    fontSize: 16,
    color: '#000000',
    height: 40, // Altura fixa para evitar sobreposição
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontWeight: '500',
    textAlignVertical: 'center', // Centraliza verticalmente no Android
  },

  // ========================================
  // BOTÃO DE MATCHMAKING
  // ========================================
  matchmakingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513', // Cor café
    width: '100%', // Largura total
    paddingVertical: 10, // Mais fino
    paddingHorizontal: 20,
    // Sem margin e padding externos
    margin: 0,
    // Efeito 3D melhorado
    borderTopWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: '#A0522D',
    borderBottomWidth: 4,
    borderBottomColor: '#5D2E0A',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  matchmakingButtonPressed: {
    backgroundColor: '#5D2E0A',
    borderTopColor: '#5D2E0A',
    borderBottomColor: '#8B4513',
    transform: [{ translateY: 1 }],
  },

  matchmakingIcon: {
    width: 28, // Maior
    height: 28,
    marginRight: 12, // Mais espaço
    tintColor: '#ffffff',
  },

  matchmakingText: {
    ...pixelArt.typography.pixelButton,
    color: '#ffffff',
    fontSize: 16, // Maior
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // ========================================
  // BOTÃO DO CARRINHO (REMOVIDO - mantido para referência)
  // ========================================
  /*
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
  */

  // ========================================
  // CONTADOR DE RESULTADOS
  // ========================================
  resultsCounter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4c5a0',
  },

  resultsText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '600',
  },

  // ========================================
  // SCROLL VIEW E GRID
  // ========================================
  gradientContainer: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  productsGrid: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },

  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },

  // ========================================
  // LOADING E ERROR STATES
  // ========================================
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
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
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
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
