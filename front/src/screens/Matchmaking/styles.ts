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
    backgroundColor: 'transparent',
    zIndex: -1,
  },

  backgroundVideo: {
    position: 'absolute',
    top: -statusBarHeight * 1.5, // Aumentando o valor para subir mais
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  // Barra de carregamento pixelada
  loadingBarContainer: {
    position: 'absolute',
    bottom: pixelArt.spacing.xxl * 2,
    left: pixelArt.spacing.xxl,
    right: pixelArt.spacing.xxl,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 3,
    borderColor: '#5A3B2C',
    borderRadius: 2,
    overflow: 'hidden',
    ...pixelArt.shadows.small,
  },
  
  loadingBar: {
    height: '100%',
    backgroundColor: '#F5E6D3',
    width: '0%',
    position: 'relative',
  },
  
  loadingBarPixelEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
  
  loadingText: {
    ...pixelArt.typography.pixelBody,
    position: 'absolute',
    bottom: pixelArt.spacing.xxl * 2 + 25, // Posiciona acima da barra
    color: '#F5E6D3',
    fontSize: 12,
    marginBottom: pixelArt.spacing.sm,
    textShadowColor: '#5A3B2C',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    letterSpacing: 1,
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
    color: '#fff2c2',
    fontWeight: '700',
    fontFamily: PIXEL_FONT,
  },

  // Debug Menu
  debugMenuButton: {
    position: 'absolute',
    top: statusBarHeight + pixelArt.spacing.xxl + pixelArt.spacing.lg,
    right: pixelArt.spacing.lg,
    zIndex: 1000,
    padding: 8,
    backgroundColor: '#fff2c2',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B7355',
  },

  debugMenuIcon: {
    fontSize: 20,
    color: '#8B7355',
    fontWeight: '700',
    fontFamily: PIXEL_FONT,
  },

  debugMenuPopup: {
    position: 'absolute',
    top: statusBarHeight + pixelArt.spacing.xxl + pixelArt.spacing.lg + 44,
    right: pixelArt.spacing.lg,
    zIndex: 1001,
    backgroundColor: '#fff2c2',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B7355',
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },

  debugMenuItem: {
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#d4c5a0',
  },

  debugMenuItemLast: {
    borderBottomWidth: 0,
  },

  debugMenuItemText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600',
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

  gradientLayerDark: {
    opacity: 0.6,
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
    height: '100%',
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
    paddingBottom: 0,
  },

  teamCarouselSticky: {
    paddingTop: pixelArt.spacing.lg * 7, // Reduced to lg
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
    paddingBottom: 0, // Espaço para não ficar escondido atrás do bottomBar
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
    borderTopColor: '#fff2c2',
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
    color: '#8B7355',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: PIXEL_FONT,
  },

  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.sm,
    marginLeft: pixelArt.spacing.md,
    position: 'absolute',
    top: pixelArt.spacing.xl + pixelArt.spacing.sm + pixelArt.spacing.xxl * 2,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#fff2c2',
    marginRight: pixelArt.spacing.sm,
    backgroundColor: '#654321',
    marginLeft: pixelArt.spacing.sm,
    marginTop: pixelArt.spacing.sm,
  },
  playerName: {
    fontSize: pixelArt.typography.pixelTitle.fontSize,
    color: '#fff2c2',
    fontFamily: PIXEL_FONT,
    fontWeight: 'bold',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pixelArt.spacing.lg,
    paddingBottom: pixelArt.spacing.md,
    paddingTop: pixelArt.spacing.xs,
    gap: pixelArt.spacing.md,
    width: '100%',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },

  bottomBarPill: {
    // Removed flex: 1 and height: 200 to reduce clickable area
    borderRadius: pixelArt.borders.radiusMedium,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: '#D4AF37',
    borderLeftColor: '#D4AF37',
    borderBottomColor: '#B8860B',
    borderRightColor: '#B8860B',
    alignItems: 'center',
    justifyContent: 'center',
    ...pixelArt.shadows.innerBorder,
  },

  bottomBarPillLeft: {
    // Removed flex: 0.2
    backgroundColor: 'transparent', // Remove background for icon only
    borderWidth: 0, // Remove border
    marginRight: 0,
  },

  bottomBarPillCenter: {
    // Removed flex: 8
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    shadowColor: '#fff2c2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 20,
    elevation: 15,
  },

  bottomBarPillRight: {
    // Removed flex: 0.2
    backgroundColor: 'transparent', // Remove background for icon only
    borderWidth: 0, // Remove border
    marginLeft: 0,
  },

  bottomBarPillDisabled: {
    opacity: 0.45,
  },

  bottomBarPillLabel: {
    ...pixelArt.typography.pixelButton,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: PIXEL_FONT,
  },

  bottomBarPillLabelCenter: {
    color: '#8B7355', // Light yellow/orange for contrast
  },

  bottomBarIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  bottomBarIconCenter: {
    width: 200,
    height: 80,
    resizeMode: 'cover', // Crop top/bottom transparent areas
  },

  sheetSectionContent: {
    flex: 1,
    width: '100%',
    padding: pixelArt.spacing.md,
    paddingTop: pixelArt.spacing.lg,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F5E6D3',
  },

  sheetEmptyText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
    fontFamily: PIXEL_FONT,
    marginTop: pixelArt.spacing.lg,
  },

  sheetCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: 0,
    margin: 0,
    gap: 6, // Adiciona um espaçamento consistente entre os itens
  },

  sheetCardWrapper: {
    width: '30%',
    aspectRatio: 0.7,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
    left: -27,
    top: -10,
    position: 'relative',
    transform: [{ scale: 0.9 }], // Reduzindo um pouco o tamanho dos cards
  },

  sheetCardScaler: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.4 }],
  },

  sheetItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  sheetItemCard: {
    width: '48%',
    marginBottom: pixelArt.spacing.md,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderRightColor: pixelArt.colors.borderDark,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.md,
    ...pixelArt.shadows.innerBorder,
  },

  sheetItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pixelArt.spacing.sm,
  },

  sheetItemEmoji: {
    fontSize: 18,
  },

  sheetItemBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: pixelArt.borders.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pixelArt.spacing.xs,
  },

  sheetItemBadgeText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: PIXEL_FONT,
  },

  sheetItemName: {
    ...pixelArt.typography.pixelBody,
    fontSize: 11,
    color: '#5A3B2C',
    fontFamily: PIXEL_FONT,
  },

  sheetBotsList: {
    width: '100%',
    padding: pixelArt.spacing.sm,
  },

  sheetBotButton: {
    width: '100%',
    height: 120,
    marginBottom: pixelArt.spacing.sm,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderBottomColor: '#8B7355',
    borderRightColor: '#8B7355',
    borderRadius: pixelArt.borders.radiusMedium,
    overflow: 'hidden',
    padding: 0, // Garantindo que não há padding interno
    ...pixelArt.shadows.small,
  },

  sheetBotImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F2E8',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    transform: [{ scale: 1.3 }] as any, // Usando type assertion para evitar erros de tipagem
  },

  sheetBotContent: {
    width: '100%',
    padding: pixelArt.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5E6D3', // Fundo bege consistente
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40, // Altura fixa maior
    borderTopWidth: 1,
    borderTopColor: '#E0D8C0',
    zIndex: 2,
  },

  sheetBotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // Substitui gap por marginRight no último elemento
  },

  sheetBotLabel: {
    ...pixelArt.typography.pixelButton,
    fontSize: 14,
    color: '#5A3B2C',
    fontFamily: PIXEL_FONT,
    letterSpacing: 0.5,
  },

  sheetBotDescription: {
    ...pixelArt.typography.pixelBody,
    fontSize: 11,
    color: '#8B7355',
    fontFamily: PIXEL_FONT,
    backgroundColor: '#F0E6D2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },

  sheetBotButtonDisabled: {
    opacity: 0.6, // Opacidade para botões desabilitados
  },

  sheetBotButtonActive: {
    borderColor: '#8B7355',
    backgroundColor: '#F5F2E8',
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
    marginTop: pixelArt.spacing.lg,
    marginBottom: pixelArt.spacing.md,
    width: '100%',
    maxWidth: Math.min(screenWidth * 0.9, 360),
    alignSelf: 'center',
    flexGrow: 1,
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
    justifyContent: 'flex-start',
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

  // ========================================
  // SEÇÃO DE ITENS
  // ========================================
  itemsSection: {
    marginTop: 100,
    marginHorizontal: pixelArt.spacing.lg,
    marginBottom: pixelArt.spacing.lg,
    backgroundColor: 'rgba(255, 249, 240, 0.98)',
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: 2,
    borderColor: '#8B7355',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  itemsSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B7355',
    marginBottom: 4,
    fontFamily: PIXEL_FONT,
    textAlign: 'center',
  },

  itemsList: {
    flexDirection: 'row',
    flexWrap: 'nowrap', // Não quebrar linha
    gap: 4,
    justifyContent: 'center',
  },

  itemsEmptyText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    fontFamily: PIXEL_FONT,
    paddingVertical: 8,
  },

  itemCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#d4c5a0',
    padding: 3,
    minWidth: 50,
    maxWidth: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  itemIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f2e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative',
  },

  itemIcon: {
    fontSize: 16,
  },

  itemInfo: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },

  itemName: {
    fontSize: 6,
    fontWeight: '600',
    color: '#5d4e37',
    fontFamily: PIXEL_FONT,
    textAlign: 'center',
    lineHeight: 8,
  },

  itemQuantityBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemQuantityText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#fff',
    fontFamily: PIXEL_FONT,
  },

  // ========================================
  // BACKPACK SELECTOR
  // ========================================
  backpackSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pixelArt.spacing.lg,
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    borderRadius: pixelArt.borders.radiusMedium,
    ...pixelArt.shadows.innerBorder,
  },

  selectorButton: {
    flex: 1,
    paddingVertical: pixelArt.spacing.sm,
    paddingHorizontal: pixelArt.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pixelArt.borders.radiusSmall,
    marginHorizontal: pixelArt.spacing.xs,
    backgroundColor: 'transparent',
  },

  selectorButtonActive: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: '#D4AF37',
    borderLeftColor: '#D4AF37',
    borderBottomColor: '#B8860B',
    borderRightColor: '#B8860B',
    ...pixelArt.shadows.innerBorder,
  },

  selectorButtonText: {
    ...pixelArt.typography.pixelButton,
    fontSize: 10,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    fontFamily: PIXEL_FONT,
  },

  selectorButtonTextActive: {
    color: pixelArt.colors.textDark,
    fontWeight: 'bold',
  },
});

