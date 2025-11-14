import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { colors, metrics } from '../../theme';
import { pixelArt } from '../../theme';
import { PIXEL_FONT } from '../../components/CoffeemonCard/styles';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    ...pixelArt.typography.pixelBody,
    marginTop: pixelArt.spacing.lg,
    color: '#fff9f0',
    fontFamily: PIXEL_FONT,
  },
  
  // ========================================
  // HEADER FIXO
  // ========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    fontFamily: PIXEL_FONT,
  },

  backButton: {
    padding: 8,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#8B7355',
    fontWeight: '700',
    fontFamily: PIXEL_FONT,
  },
  
  floatingBackButton: {
    position: 'absolute',
    top: statusBarHeight + pixelArt.spacing.xxl + pixelArt.spacing.lg,
    left: pixelArt.spacing.lg,
    zIndex: 1000,
    padding: 8,
  },
  
  floatingBackButtonText: {
    fontSize: 24,
    color: '#8B7355',
    fontWeight: '700',
    fontFamily: PIXEL_FONT,
  },
  // ========================================
  // GRADIENTE E SCROLL
  // ========================================
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  dynamicBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  gradientLayerAccent: {
    opacity: 0.7,
  },

  gradientLayerHighlight: {
    opacity: 0.4,
  },

  gradientFill: {
    flex: 1,
  },

  limonetoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '60%',
    opacity: 0.9,
  },

  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: '110%',
    height: '110%',
    opacity: 0.15,
  },

  gradientContainer: {
    flex: 1,
    width: '100%',
  },
  
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: pixelArt.spacing.lg,
    paddingBottom: pixelArt.spacing.xxl * 2,
  },

  teamCarouselSticky: {
    paddingTop: pixelArt.spacing.lg + 56,
    paddingHorizontal: pixelArt.spacing.lg,
    paddingBottom: pixelArt.spacing.md,
  
  },

  availableSticky: {
    paddingHorizontal: 0,
    paddingBottom: pixelArt.spacing.md,
    minHeight: 380,
    width: '100%',
  },

  scrollBody: {
    paddingTop: pixelArt.spacing.xl,
  },
  
  // ========================================
  // STATUS CARD
  // ========================================
  statusCardWrapper: {
    position: 'absolute',
    top: statusBarHeight + pixelArt.spacing.xxl * 2,
    alignSelf: 'center',
    width: '45%',
    maxWidth: 120,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
  },

  statusCardShadow: {
    position: 'absolute',
    top: 6,
    width: '100%',
    height: 0,
    borderTopWidth: 26,
    borderTopColor: 'rgba(0, 0, 0, 0.25)',
    borderLeftWidth: 14,
    borderLeftColor: 'transparent',
    borderRightWidth: 14,
    borderRightColor: 'transparent',
    transform: [{ translateY: 3 }],
    opacity: 0.6,
  },

  statusCardOutline: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 0,
    borderTopWidth: 32,
    borderTopColor: '#d4c5a0',
    borderLeftWidth: 16,
    borderLeftColor: 'transparent',
    borderRightWidth: 16,
    borderRightColor: 'transparent',
  },

  statusCardShape: {
    position: 'absolute',
    top: 4,
    width: '100%',
    height: 0,
    borderTopWidth: 26,
    borderTopColor: '#fff9f0',
    borderLeftWidth: 13,
    borderLeftColor: 'transparent',
    borderRightWidth: 13,
    borderRightColor: 'transparent',
  },

  statusCardContent: {
    position: 'absolute',
    top: 6,
    left: 18,
    right: 18,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: PIXEL_FONT,
  },

  // ========================================
  // SEÇÕES
  // ========================================
  teamsSection: {
    marginBottom: pixelArt.spacing.lg,
    alignItems: 'flex-start',
    width: '100%',
  },

  availableSectionWrapper: {
    alignItems: 'center',
    width: '100%',
    marginTop: pixelArt.spacing.xxl * 1.5,
    position: 'relative',
    overflow: 'visible',
    paddingHorizontal: pixelArt.spacing.xxl,
    paddingBottom: pixelArt.spacing.xxl * 1.25,
    minHeight: 440,
  },

  availableBackdrop: {
    position: 'absolute',
    top: pixelArt.spacing.xxl,
    left: -pixelArt.spacing.lg,
    right: -pixelArt.spacing.lg,
    bottom: -pixelArt.spacing.xxl,
    backgroundColor: '#FFF9F0',
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    ...pixelArt.shadows.innerBorder,
    borderRadius: pixelArt.borders.radiusMedium,
  },

  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: pixelArt.spacing.md,
    textAlign: 'center',
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
    marginBottom: 2,
  },

  battleButtonSubtitle: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
  },

  // ========================================
  // BOTTOM BAR EMOJI BUTTONS
  // ========================================
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: 0,
    gap: 0,
    width: '100%',
  },

  bottomBarButton: {
    flex: 1,
    height: 64,
    borderRadius: 0,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    alignItems: 'stretch',
    justifyContent: 'center',
    ...pixelArt.shadows.innerBorder,
  },

  bottomBarButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  bottomBarButtonLeft: {
    backgroundColor: pixelArt.colors.cardInnerBg,
  },

  bottomBarButtonCenter: {
    backgroundColor: pixelArt.colors.cardInnerBg,
  },

  bottomBarButtonRight: {
    backgroundColor: pixelArt.colors.cardInnerBg,
  },

  bottomBarButtonDisabled: {
    opacity: 0.45,
  },

  bottomBarText: {
    ...pixelArt.typography.pixelButton,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: PIXEL_FONT,
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
    marginTop: pixelArt.spacing.xl,
    marginBottom: pixelArt.spacing.md,
    width: '100%',
    maxWidth: Math.min(screenWidth * 0.9, 360),
    alignSelf: 'center',
  },

  carouselTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'visible',
  },

  carouselCardWrapper: {
    width: 110,
    height: 110,
    marginHorizontal: pixelArt.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...pixelArt.shadows.card,
  },

  carouselCard: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
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
    fontFamily: PIXEL_FONT,
  },

  carouselCardLevel: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: pixelArt.colors.textLight,
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
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
    marginBottom: pixelArt.spacing.sm,
    marginTop: pixelArt.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: Math.min(screenWidth * 0.9, 380),
    // borderWidth: pixelArt.borders.widthThick,
    // borderTopColor: pixelArt.colors.borderLight,
    // borderLeftColor: pixelArt.colors.borderLight,
    // borderBottomColor: pixelArt.colors.borderDark,
    // borderRightColor: pixelArt.colors.borderDark,
    // borderRadius: pixelArt.borders.radiusMedium,
    paddingHorizontal: 0,
    paddingVertical: pixelArt.spacing.sm,
    // backgroundColor: '#f9f9f9', // Removido - fundo transparente
  },

  teamColumnTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    color: pixelArt.colors.textDark,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.md,
    fontFamily: PIXEL_FONT,
  },

  teamEmptyMessage: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    fontFamily: PIXEL_FONT,
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
    fontFamily: PIXEL_FONT,
  },

  findMatchButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: PIXEL_FONT,
    textAlign: 'center',
  },
});
