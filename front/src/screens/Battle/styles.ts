import { StyleSheet, Dimensions } from 'react-native';
import { pixelArt } from '../../theme/pixelArt';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER PRINCIPAL
  // ========================================
  battleContainer: {
    flex: 1,
    backgroundColor: '#87CEEB',
    flexDirection: 'column', // Layout vertical
  },
  
  // ========================================
  // ARENA DE BATALHA - Fundo com Sprites
  // ========================================
  battleArena: {
    position: 'relative',
    width: '100%',
    flex: 1, // Ocupa todo espaço restante acima dos botões
    backgroundColor: '#87CEEB',
  },
  
  // ========================================
  // BARRAS DE HP - Topo da Tela (Estilo Pixel Art)
  // Container Principal - background-color semi-transparente, border-radius, padding
  // ========================================
  hudContainer: {
    position: 'absolute',
    zIndex: 30,
  },
  
  // HUD do Player (esquerda superior)
  playerHudPosition: {
    bottom: '38%',
    left: '10%',
  },
  
  // HUD do Oponente (direita superior)
  opponentHudPosition: {
    top: '18%',
    right: '12%',
  },
  
  // Container Principal com display: flex e align-items: center
  hudMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Seção do Ícone - Pixel Art com image-rendering: pixelated
  hudPixelIcon: {
    width: 34,
    height: 34,
    marginRight: 8,
  },
  
  // Bloco de Informações - flex-direction: column
  hudInfoBlock: {
    flex: 1,
    flexDirection: 'column',
  },
  
  // Rótulo de Texto - font-family pixelada, text-transform: uppercase
  hudNameLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  
  // Container da Barra de Status - display: flex, flex-direction: row
  hudStatusBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderWidth: 2,
    borderColor: '#444444',
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  
  // Segmentos da Barra (Filhos) - flex: 1, height fixo
  hudStatusSegment: {
    flex: 1,
    height: '100%',
    marginHorizontal: 0.6,
    borderRadius: 1,
  },
  
  // Removido hudHeader, hudIcon, hudName, hudHpBarContainer, hudHpBarSegments, hudHpSegment, hudHpFraction
  // pois agora usamos a nova estrutura
  
  // ========================================
  // SPRITES DOS COFFEEMON
  // ========================================
  coffeemonSpriteContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15, // Maior que o battleLogContainer (zIndex: 10)
  },
  
  // Player (esquerda, maior)
  playerSpritePosition: {
    bottom: '-5%',
    left: '-9%',
    width: width * 0.75,
    height: height * 0.45,
  },
  
  // Oponente (direita, menor)
  opponentSpritePosition: {
    top: '25%',
    right: '8%',
    width: width * 0.4,
    height: height * 0.32,
  },
  
  pokemonImg: {
    width: '100%',
    height: '100%',
  },
  
  // ========================================
  // DAMAGE DISPLAY - Below Health Bar
  // ========================================
  damageText: {
    position: 'absolute',
    bottom: -25,
    left: '50%',
    transform: [{ translateX: -25 }],
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#FF4444',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    zIndex: 50,
  },
  
  // ========================================
  // ÁREA DE LOGS (Lado Direito sem caixa)
  // ========================================
  battleLogContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0, // Ocupa toda a altura da arena
    width: '350%', // Expansão máxima
    zIndex: 10,
    alignItems: 'flex-end',
  },
  
  logGradient: {
    flex: 1,
    paddingTop: 500, // Aumentado significativamente para fazer texto começar muito mais abaixo
    paddingBottom: 12,
    paddingRight: 12, // Reduzido de 120 para 12 para aproximar texto da lateral
    paddingLeft: 0,
    borderTopLeftRadius: 16,
  },

  logScrollView: {
    flex: 1, // Ocupa todo espaço disponível no container
  },

  logScrollContent: {
    gap: 6,
  },

  logEmptyState: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },

  logEntryRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 4,
  },

  logEntryTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  logEntryText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#FFFFFF',
    textAlign: 'right',
    letterSpacing: 0.5,
  },

  logEntryDamageText: {
    color: '#FF4B4B',
    fontWeight: 'bold',
  },
  
  // ========================================
  // CONTAINER DE AÇÕES - Painel Inferior
  // ========================================
  battleActionsContainer: {
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 12,
    paddingTop: 13,
    height: 200, // Altura fixa para garantir layout preciso
    borderTopWidth: 3,
    borderTopColor: '#8B7355',
    zIndex: 20,
  },
  
  // ========================================
  // ÁREA DE PROMPT DE AÇÃO
  // ========================================
  actionPromptContainer: {
    backgroundColor: '#FFFFF0',
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionPromptText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#333',
    textAlign: 'center',
    textTransform: 'uppercase',
    flex: 1,
  },
  backButtonSmall: {
    backgroundColor: '#5A67D8',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#434190',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  backButtonIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  // ========================================
  // GRID DE BOTÕES DE AÇÃO (4 botões principais)
  // ========================================
  mainActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mainActionButton: {
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Botão Atacar (Vermelho/Laranja)
  attackActionButton: {
    backgroundColor: '#E57C5C',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#F5A88E',
    borderLeftColor: '#F5A88E',
  },
  // Botão Habilidade Especial (Roxo)
  specialActionButton: {
    backgroundColor: '#9C7DBF',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#C5A8E0',
    borderLeftColor: '#C5A8E0',
  },
  // Botão Item (Amarelo)
  itemActionButton: {
    backgroundColor: '#F5D663',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#FFE896',
    borderLeftColor: '#FFE896',
  },
  // Botão Fugir (Azul)
  fleeActionButton: {
    backgroundColor: '#7DB8D9',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#A8D5ED',
    borderLeftColor: '#A8D5ED',
  },
  actionButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#C0C0C0',
    borderTopColor: '#D0D0D0',
    borderLeftColor: '#D0D0D0',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: pixelArt.spacing.sm,
  },
  actionButtonText: {
    ...pixelArt.typography.pixelButton,
    fontSize: 13,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  
  // ========================================
  // GRID DE ATAQUES (quando modo ataque ativo)
  // ========================================
  attacksContainer: {
    marginBottom: pixelArt.spacing.md,
  },
  attacksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  attackButton: {
    marginBottom: pixelArt.spacing.sm,
    borderRadius: pixelArt.borders.radiusMedium,
    paddingVertical: pixelArt.spacing.lg,
    paddingHorizontal: pixelArt.spacing.md,
    backgroundColor: '#9C7DBF',
    borderWidth: pixelArt.borders.widthBold,
    borderColor: '#333',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#C5A8E0',
    borderLeftColor: '#C5A8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attackButtonDisabled: {
    backgroundColor: '#C0C0C0',
    opacity: 0.5,
    borderTopColor: '#D0D0D0',
    borderLeftColor: '#D0D0D0',
  },
  attackButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attackTypeIcon: {
    fontSize: 28,
    marginBottom: pixelArt.spacing.xs,
  },
  attackButtonText: {
    ...pixelArt.typography.pixelButton,
    fontSize: 12,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  movePowerBadge: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: pixelArt.spacing.xs,
    opacity: 0.9,
  },
  
  // ========================================
  // BOTÕES DE TROCA - Pixel Art Cards
  // ========================================
  switchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  switchButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: pixelArt.borders.radiusMedium,
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.sm,
    marginBottom: pixelArt.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: pixelArt.borders.widthBold,
    borderColor: '#333',
  },
  switchButtonDisabled: {
    backgroundColor: '#C0C0C0',
    opacity: 0.5,
  },
  switchButtonImage: {
    width: 70,
    height: 70,
    marginBottom: pixelArt.spacing.sm,
  },
  switchButtonName: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: pixelArt.spacing.xs,
  },
  switchButtonHpBar: {
    width: '90%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: 2,
    borderColor: '#333',
    overflow: 'hidden',
    marginTop: pixelArt.spacing.xs,
  },
  switchButtonHpFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  switchButtonHpText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: 'bold',
  },
  
  // ========================================
  // BOTÕES INFERIORES - Pixel Art
  // ========================================
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  bagButton: {
    width: '48%',
    ...pixelArt.buttons.action,
    opacity: 0.5,
  },
  bagButtonText: {
    ...pixelArt.buttons.text,
  },
  runButton: {
    width: '48%',
    backgroundColor: pixelArt.buttons.danger.backgroundColor,
    borderRadius: pixelArt.buttons.danger.borderRadius,
    paddingVertical: pixelArt.buttons.danger.paddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: pixelArt.buttons.danger.borderTopWidth,
    borderLeftWidth: pixelArt.buttons.danger.borderLeftWidth,
    borderTopColor: pixelArt.buttons.danger.borderTopColor,
    borderLeftColor: pixelArt.buttons.danger.borderLeftColor,
    borderBottomWidth: pixelArt.buttons.danger.borderBottomWidth,
    borderRightWidth: pixelArt.buttons.danger.borderRightWidth,
    borderBottomColor: pixelArt.buttons.danger.borderBottomColor,
    borderRightColor: pixelArt.buttons.danger.borderRightColor,
    ...pixelArt.shadows.button,
  },
  runButtonText: {
    ...pixelArt.buttons.text,
  },
  
  // ========================================
  // OVERLAY DE FIM DE BATALHA
  // ========================================
  battleEndOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleEndCard: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.xxl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    ...pixelArt.shadows.outerBorder,
  },
  battleEndTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 20,
    color: pixelArt.colors.sparkleColor,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },
  battleEndWinner: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 16,
    color: pixelArt.colors.textDark,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.md,
  },
  battleEndSubtext: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.xl,
  },
  battleEndButton: {
    ...pixelArt.buttons.primary,
    minWidth: 200,
  },
  battleEndButtonText: {
    ...pixelArt.buttons.text,
  },
  
  // ========================================
  // MODAL DE SELEÇÃO - Pixel Art
  // ========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.lg,
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    ...pixelArt.shadows.outerBorder,
  },
  modalTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 16,
    color: pixelArt.colors.textDark,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.lg,
  },
  modalScroll: {
    maxHeight: 500,
  },
  teamColumn: {
    marginBottom: pixelArt.spacing.lg,
    borderWidth: pixelArt.borders.widthThick,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.md,
    backgroundColor: '#f9f9f9',
  },
  teamColumnTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    marginBottom: pixelArt.spacing.md,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderWidth: pixelArt.borders.widthThick,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.md,
    marginBottom: pixelArt.spacing.sm,
    ...pixelArt.shadows.innerBorder,
  },
  teamCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
  },
  teamCardOpponent: {
    backgroundColor: '#f8f9fa',
  },
  teamCardImage: {
    width: 60,
    height: 60,
    marginRight: pixelArt.spacing.md,
  },
  teamCardInfo: {
    flex: 1,
  },
  teamCardName: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 13,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.xs,
  },
  teamCardHp: {
    ...pixelArt.typography.pixelBody,
    fontSize: 11,
    color: pixelArt.colors.textLight,
  },
  
  // ========================================
  // TELAS DE ERRO E LOADING
  // ========================================
  container: {
    flex: 1,
    backgroundColor: pixelArt.colors.bgLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.xl,
  },
  errorText: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 16,
    color: pixelArt.colors.error,
    marginBottom: pixelArt.spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    marginBottom: pixelArt.spacing.lg,
    textAlign: 'center',
  },
  loadingText: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 18,
    color: pixelArt.colors.sparkleColor,
    marginBottom: pixelArt.spacing.sm,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
  },
  returnButton: {
    ...pixelArt.buttons.primary,
    paddingHorizontal: pixelArt.spacing.xxl,
    paddingVertical: pixelArt.spacing.md,
  },
  returnButtonText: {
    ...pixelArt.buttons.text,
  },
  
  // ========================================
  // SWITCH MODE - Cards de Troca
  // ========================================
  switchCandidateCard: {
    backgroundColor: 'rgba(245, 230, 211, 0.95)',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#8B7355',
    padding: 12,
    alignItems: 'center',
    minHeight: 160,
  },
  switchCandidateCardDisabled: {
    backgroundColor: 'rgba(150, 150, 150, 0.5)',
    borderColor: '#666',
  },
  switchCandidateImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  switchCandidateName: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  switchCandidateHp: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  switchCandidateReason: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 4,
  },

  // ========================================
  // ITEM MODE - Lista de Itens
  // ========================================
  itemsScrollView: {
    flex: 1,
  },
  itemsScrollContent: {
    padding: 12,
    gap: 8,
  },
  itemButton: {
    backgroundColor: 'rgba(44, 44, 46, 0.95)',
    borderRadius: 12,
    borderWidth: 3,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemButtonDisabled: {
    opacity: 0.5,
    borderColor: '#4A4A4C',
  },
  itemButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemIcon: {
    fontSize: 32,
    width: 40,
    textAlign: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemNameDisabled: {
    color: '#8E8E93',
  },
  itemDescription: {
    fontSize: 12,
    color: '#AEAEB2',
  },
  itemDescriptionDisabled: {
    color: '#636366',
  },
  itemQuantityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  itemQuantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemOutOfStockBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  itemOutOfStockText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});


