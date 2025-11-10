import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { colors, metrics } from '../../theme';
import { pixelArt } from '../../theme';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f0',
  },
  
  // ========================================
  // HEADER FIXO
  // ========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pixelArt.spacing.lg,
    paddingTop: pixelArt.spacing.lg + statusBarHeight,
    paddingBottom: pixelArt.spacing.md,
    // backgroundColor: 'rgba(245, 242, 232, 0.4)', // Removido - totalmente transparente
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(212, 197, 160, 0.7)',
    elevation: 0,
    shadowColor: 'transparent',
  },

  headerTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },

  backButton: {
    padding: 8,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#8B7355',
    fontWeight: '700',
  },
  
  // ========================================
  // GRADIENTE E SCROLL
  // ========================================
  backgroundContainer: {
    flex: 1,
  },

  gradientContainer: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: pixelArt.spacing.lg,
    paddingBottom: 40,
  },
  
  // ========================================
  // STATUS CARD
  // ========================================
  statusCard: {
    backgroundColor: '#fff9f0',
    padding: pixelArt.spacing.lg,
    borderRadius: 8,
    marginBottom: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    elevation: 3,
  },
  
  statusText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // ========================================
  // SEÇÕES
  // ========================================
  teamsSection: {
    marginBottom: pixelArt.spacing.lg,
  },

  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: pixelArt.spacing.md,
    textAlign: 'center',
  },

  divider: {
    height: 2,
    backgroundColor: '#f0e6d2',
    marginVertical: pixelArt.spacing.lg,
  },

  dividerSmall: {
    height: 1,
    backgroundColor: '#f0e6d2',
    marginVertical: pixelArt.spacing.sm,
  },

  orText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ========================================
  // ACTION CARD (CAPTURA)
  // ========================================
  actionCard: {
    backgroundColor: '#ffffff',
    padding: pixelArt.spacing.lg,
    borderRadius: 8,
    marginBottom: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    elevation: 3,
  },

  cardTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: pixelArt.spacing.md,
    textAlign: 'center',
  },
  
  captureButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: '#b370cf',
    borderLeftColor: '#b370cf',
    borderBottomColor: '#7d3c98',
    borderRightColor: '#7d3c98',
    elevation: 4,
  },
  
  captureButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  // ========================================
  // BATTLE SECTION
  // ========================================
  battleSection: {
    backgroundColor: '#ffffff',
    padding: pixelArt.spacing.lg,
    borderRadius: 8,
    marginBottom: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    elevation: 3,
  },

  battleButton: {
    paddingVertical: pixelArt.spacing.lg,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: 6,
    marginBottom: pixelArt.spacing.md,
    borderWidth: 3,
    elevation: 4,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  battleButtonEmoji: {
    fontSize: 32,
    marginRight: pixelArt.spacing.md,
  },

  buttonTextContainer: {
    flex: 1,
  },

  battleButtonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 2,
  },

  battleButtonSubtitle: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'monospace',
    opacity: 0.9,
  },
  
  pvpButton: {
    backgroundColor: '#3498db',
    borderTopColor: '#5dade2',
    borderLeftColor: '#5dade2',
    borderBottomColor: '#2980b9',
    borderRightColor: '#2980b9',
  },
  
  jessieButton: {
    backgroundColor: '#e67e22',
    borderTopColor: '#f39c12',
    borderLeftColor: '#f39c12',
    borderBottomColor: '#d35400',
    borderRightColor: '#d35400',
  },
  
  jamesButton: {
    backgroundColor: '#e74c3c',
    borderTopColor: '#ec7063',
    borderLeftColor: '#ec7063',
    borderBottomColor: '#c0392b',
    borderRightColor: '#c0392b',
  },
  
  // ========================================
  // LOGOUT BUTTON
  // ========================================
  logoutButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: pixelArt.spacing.md,
    borderWidth: 3,
    borderTopColor: '#bdc3c7',
    borderLeftColor: '#bdc3c7',
    borderBottomColor: '#7f8c8d',
    borderRightColor: '#7f8c8d',
  },
  
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  // ========================================
  // DEPRECATED (mantidos para compatibilidade)
  // ========================================
  matchmakingContainer: {
    flex: 1,
    padding: metrics.spacing.lg,
    paddingTop: metrics.spacing.lg + statusBarHeight,
    alignItems: 'center',
  },
  
  matchTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: metrics.spacing.lg,
    color: '#8B4513',
    textAlign: 'center',
  },
  
  statusContainer: {
    backgroundColor: '#fff9f0',
    padding: metrics.spacing.md,
    borderRadius: 6,
    marginBottom: metrics.spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#f0e6d2',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },
  
  botButtonsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: metrics.spacing.md,
  },
  
  botSectionTitle: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
    fontWeight: '600',
  },
  
  findMatchButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    elevation: 5,
    borderWidth: 3,
  },
  
  // ========================================
  // TEAM CAROUSEL - Pixel Art
  // ========================================
  carouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 170, // Reduzido de 200 para 170
    marginVertical: pixelArt.spacing.md,
  },

  carouselTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  carouselCard: {
    width: 100, // Reduzido de 120 para 100
    height: 100, // Reduzido de 120 para 100
    marginHorizontal: 6, // Reduzido de 8 para 6
    alignItems: 'center',
    justifyContent: 'center',
  },

  carouselCardContent: {
    width: '100%',
    height: '100%',
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    padding: pixelArt.spacing.xs, // Reduzido de sm para xs
    alignItems: 'center',
    justifyContent: 'center',
    ...pixelArt.shadows.innerBorder,
  },

  carouselCardImageContainer: {
    width: 50, // Reduzido de 60 para 50
    height: 50, // Reduzido de 60 para 50
    marginBottom: pixelArt.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carouselCardImage: {
    width: '100%',
    height: '100%',
  },

  carouselCardInfo: {
    alignItems: 'center',
  },

  carouselCardName: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 11,
    color: pixelArt.colors.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },

  carouselCardLevel: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: pixelArt.colors.textLight,
  },

  activeIndicator: {
    position: 'absolute',
    top: -6, // Reduzido de -8 para -6
    right: -6, // Reduzido de -8 para -6
    backgroundColor: '#FFD700',
    borderRadius: 10, // Reduzido de 12 para 10
    width: 20, // Reduzido de 24 para 20
    height: 20, // Reduzido de 24 para 20
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA500',
    zIndex: 400, // Maior que o card central (300) para aparecer sempre na frente
  },

  activeIndicatorText: {
    fontSize: 12, // Reduzido de 14 para 12
    color: '#8B4513',
    fontWeight: 'bold',
  },

  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: pixelArt.spacing.sm,
  },

  carouselIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    marginHorizontal: 4,
  },

  carouselIndicatorActive: {
    backgroundColor: '#8B4513',
    transform: [{ scaleX: 1.5 }],
  },

  addButtonSmall: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#45a049',
  },

  // ========================================
  // TEAM CAROUSEL - Estilos adicionais
  // ========================================
  teamColumn: {
    marginBottom: pixelArt.spacing.lg,
    // borderWidth: pixelArt.borders.widthThick,
    // borderTopColor: pixelArt.colors.borderLight,
    // borderLeftColor: pixelArt.colors.borderLight,
    // borderBottomColor: pixelArt.colors.borderDark,
    // borderRightColor: pixelArt.colors.borderDark,
    // borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.md,
    // backgroundColor: '#f9f9f9', // Removido - fundo transparente
  },

  teamColumnTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.md,
  },

  teamEmptyMessage: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
  },

  addButton: {
    marginTop: pixelArt.spacing.md,
    backgroundColor: '#4CAF50',
    paddingVertical: pixelArt.spacing.sm,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: pixelArt.borders.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: '#45a049',
    borderLeftColor: '#45a049',
    borderBottomColor: '#2E7D32',
    borderRightColor: '#2E7D32',
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  findMatchButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
