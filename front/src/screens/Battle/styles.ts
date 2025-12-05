import { Dimensions, StyleSheet } from "react-native";
import { pixelArt } from "../../theme/pixelArt";

const { width, height } = Dimensions.get("window");

// Tamanhos responsivos baseados na largura da tela - otimizados para ocupar mais espaço
const buttonSizes = {
  attack: Math.min(width * 0.3, 140), // 30% da largura, máx 140px (era 28%, 130px)
  switch: Math.min(width * 0.24, 95), // 24% da largura, máx 95px (era 22%, 85px)
  item: Math.min(width * 0.19, 75), // 19% da largura, máx 75px (era 18%, 70px)
  flee: Math.min(width * 0.19, 75), // 19% da largura, máx 75px (era 18%, 70px)
};

const buttonPositions = {
  marginBottom: Math.max(height * 0.09, 10), // Min 10px, 2% da altura
  marginSide: Math.max(width * 0.03, 12), // Min 12px, 3% da largura (era 5%)
  spacing: Math.max(width * 0.025, 10), // Min 10px, 2.5% da largura (era 3%)

  // Posição do botão ROXO (fugir) - ajuste esses valores
  fleeOffsetX: -260, // Ajuste horizontal extra (positivo = mais à esquerda)
  fleeOffsetY: -60, // Ajuste vertical extra (positivo = sobe)
};

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER PRINCIPAL
  // ========================================
  battleContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column", // Layout vertical
  },

  // ========================================
  // ARENA DE BATALHA - Fundo com Sprites
  // ========================================
  battleArena: {
    position: "relative",
    width: "100%",
    flex: 1, // Ocupa todo espaço restante acima dos botões
    backgroundColor: "transparent",
  },
  battleArenaBackground: {
    position: "relative",
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
  },
  clickOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 35,
  },
  clickIndicator: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  clickIndicatorText: {
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
  },

  // ========================================
  // BARRAS DE HP - Topo da Tela (Estilo Pixel Art)
  // Container Principal - background-color semi-transparente, border-radius, padding
  // ========================================
  hudContainer: {
    position: "absolute",
    zIndex: 30,
  },

  // HUD do Player (esquerda, acima do sprite)
  playerHudPosition: {
    bottom: "60%",
    left: "1%",
  },

  // HUD do Oponente (direita, abaixo do sprite)
  opponentHudPosition: {
    bottom: "35%",
    right: "1%",
  },

  // Container Principal com display: flex e align-items: center
  hudMainContent: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "column",
  },

  // Rótulo de Texto - font-family pixelada, text-transform: uppercase
  hudNameLabel: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },

  // Container da Barra de Status - display: flex, flex-direction: row
  hudStatusBarContainer: {
    flexDirection: "row",
    height: 12,
    borderWidth: 2,
    borderColor: "#444444",
    backgroundColor: "rgba(224, 224, 224, 0.5)",
    borderRadius: 2,
    paddingHorizontal: 2,
  },

  // Segmentos da Barra (Filhos) - flex: 1, height fixo
  hudStatusSegment: {
    flex: 1,
    height: "100%",
    marginHorizontal: 0.6,
    borderRadius: 1,
  },

  // Removido hudHeader, hudIcon, hudName, hudHpBarContainer, hudHpBarSegments, hudHpSegment, hudHpFraction
  // pois agora usamos a nova estrutura

  // ========================================
  // SPRITES DOS COFFEEMON
  // ========================================
  coffeemonSpriteContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15, // Maior que o battleLogContainer (zIndex: 10)
  },

  // Player (esquerda, maior)
  playerSpritePosition: {
    bottom: "20%",
    left: "-20%",
    width: width * 0.75,
    height: height * 0.45,
  },

  // Oponente (direita, menor)
  opponentSpritePosition: {
    top: "30%",
    right: "8%",
    width: width * 0.4,
    height: height * 0.28,
  },

  pokemonImg: {
    width: "100%",
    height: "100%",
  },

  // ========================================
  // DAMAGE DISPLAY - Below Health Bar
  // ========================================
  damageText: {
    position: "absolute",
    bottom: -25,
    left: "50%",
    transform: [{ translateX: -25 }],
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#FF4444",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    zIndex: 50,
  },

  // ========================================
  // TEXT BOX INTERATIVO - Topo da Tela
  // ========================================
  battleTextBox: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 40,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#000000",
    padding: 18,
    minHeight: 85,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  battleTextBoxUnread: {
    borderColor: "#FFD700",
    borderWidth: 4,
    shadowColor: "#FFD700",
    shadowOpacity: 0.8,
  },
  textBoxContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  textBoxMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: "monospace",
    color: "#2a2a2a",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    width: "100%",
  },
  textBoxIndicator: {
    fontSize: 16,
    color: "#2a2a2a",
    marginLeft: 8,
    opacity: 0.7,
  },
  continueIndicator: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  continueIndicatorText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#FF6B00",
    fontWeight: "bold",
    textAlign: "center",
  },
  textBoxCounterContainer: {
    position: "absolute",
    bottom: 6,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textBoxCounter: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
  },
  textBoxCounterUnread: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  textBoxNavButton: {
    padding: 4,
  },
  textBoxNavArrow: {
    fontSize: 14,
    color: "#2a2a2a",
    fontWeight: "bold",
  },
  textBoxNavArrowDisabled: {
    opacity: 0.2,
  },

  // ========================================
  // ÁREA DE LOGS (Lado Direito sem caixa) - REMOVIDO
  // ========================================
  battleLogContainer: {
    display: "none",
  },

  logGradient: {
    flex: 1,
    paddingTop: 20, // Reduzido para evitar que logs fiquem escondidos
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
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  logEmptyState: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },

  logEntryRow: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 4,
  },

  logEntryTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  logEntryText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#FFFFFF",
    textAlign: "right",
    letterSpacing: 0.5,
  },

  logEntryDamageText: {
    color: "#FF4B4B",
    fontWeight: "bold",
  },

  // ========================================
  // CONTAINER DE AÇÕES - Painel Inferior
  // ========================================
  battleActionsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
    height: 300,
    zIndex: 20,
  },

  // ========================================
  // ÁREA DE PROMPT DE AÇÃO
  // ========================================
  actionPromptContainer: {
    display: "none",
  },
  actionPromptText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#333",
    textAlign: "center",
    textTransform: "uppercase",
    flex: 1,
  },
  backButtonSmall: {
    backgroundColor: "#5A67D8",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#434190",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    position: 'absolute', // Posicionamento absoluto para não afetar o layout do texto
    left: 12,
    zIndex: 10, // Garante que o botão fique sobre o texto para receber cliques
  },
  backButtonIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  // ========================================
  // GRID DE BOTÕES DE AÇÃO (4 botões principais)
  // Layout circular flutuante estilo mobile game
  // ========================================
  mainActionButtonsContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  unreadMessagesBanner: {
    position: "absolute",
    bottom: "50%",
    left: "5%",
    right: "5%",
    zIndex: 100,
    backgroundColor: "rgba(255, 215, 0, 0.95)",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#FF6B00",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 15,
  },
  unreadMessagesText: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#2a2a2a",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  mainActionsGrid: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  mainActionButton: {
    position: "absolute",
    borderRadius: 1000,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  // Botão Atacar (Vermelho) - MAIOR, CANTO INFERIOR DIREITO (movido um pouco para cima)
  attackActionButton: {
    backgroundColor: "#FF4757",
    width: buttonSizes.attack,
    height: buttonSizes.attack,
    bottom: buttonPositions.marginBottom + height * 0.015, // +1.5% da altura para subir levemente
    right: buttonPositions.marginSide,
  },
  // Botão Trocar (Azul) - MÉDIO, À ESQUERDA DO ATACAR (orbitando)
  specialActionButton: {
    backgroundColor: "#3EDBF0",
    width: buttonSizes.switch,
    height: buttonSizes.switch,
    bottom: buttonPositions.marginBottom + height * 0.005, // Levemente acima (0.5%)
    right:
      buttonSizes.attack + buttonPositions.marginSide + buttonPositions.spacing,
  },
  // Botão Item (Verde) - PEQUENO, ACIMA E À ESQUERDA (orbitando o atacar)
  itemActionButton: {
    backgroundColor: "#26D07C",
    width: buttonSizes.item,
    height: buttonSizes.item,
    bottom: buttonSizes.attack * 0.85 + buttonPositions.marginBottom, // Acima e à esquerda do atacar
    right:
      buttonSizes.attack + buttonPositions.marginSide - buttonSizes.item * 0.1, // À esquerda orbitando
  },
  // Botão Fugir (Roxo) - PEQUENO, ENTRE O AZUL E O VERMELHO (embaixo)
  fleeActionButton: {
    backgroundColor: "#A29BFE",
    width: buttonSizes.flee,
    height: buttonSizes.flee,
    bottom: buttonPositions.marginBottom + buttonPositions.fleeOffsetY,
    right:
      buttonSizes.attack +
      buttonPositions.marginSide +
      buttonPositions.spacing +
      buttonSizes.switch +
      buttonPositions.spacing +
      buttonPositions.fleeOffsetX,
  },
  actionButtonDisabled: {
    opacity: 0.3,
    backgroundColor: "#CCCCCC",
  },
  actionButtonContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonIconImage: {
    width: Math.min(width * 0.12, 50),
    height: Math.min(width * 0.12, 50),
    tintColor: "#FFFFFF",
  },
  actionButtonIcon: {
    fontSize: Math.min(width * 0.12, 48),
  },
  actionButtonText: {
    display: "none",
  },

  // ========================================
  // GRID DE ATAQUES - Estilo Pokémon Moderno
  // ========================================
  attacksContainer: {
    flex: 1,
    justifyContent: "center",
  },
  attacksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 4,
  },
  attackButton: {
    width: "48%",
    minHeight: 125,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#333",
    backgroundColor: "#FFFFFF",
    ...pixelArt.shadows.card,
  },
  emptySlot: {
    width: "48%",
    minHeight: 125,
    borderRadius: 14,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#666",
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptySlotText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 18,
    color: "#666",
    opacity: 0.5,
    letterSpacing: 2,
  },
  attackButtonDisabled: {
    opacity: 0.4,
    borderColor: "#999",
  },
  attackButtonGradient: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  attackButtonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  attackTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attackTypeIcon: {
    fontSize: 16,
  },
  attackTypeText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  attackCategoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  attackCategoryText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  attackButtonName: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginVertical: 6,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  attackDescription: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 14,
    marginBottom: 6,
  },
  attackButtonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attackPowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attackPowerLabel: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  attackPowerValue: {
    ...pixelArt.typography.pixelButton,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  attackEffectIndicator: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  attackEffectText: {
    fontSize: 10,
  },

  // ========================================
  // BOTÕES DE TROCA - Pixel Art Cards
  // ========================================
  switchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  switchButton: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: pixelArt.borders.radiusMedium,
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.sm,
    marginBottom: pixelArt.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    borderWidth: pixelArt.borders.widthBold,
    borderColor: "#333",
  },
  switchButtonDisabled: {
    backgroundColor: "#C0C0C0",
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
    color: "#333",
    textAlign: "center",
    marginBottom: pixelArt.spacing.xs,
  },
  switchButtonHpBar: {
    width: "90%",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: 2,
    borderColor: "#333",
    overflow: "hidden",
    marginTop: pixelArt.spacing.xs,
  },
  switchButtonHpFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  switchButtonHpText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    fontWeight: "bold",
  },

  // ========================================
  // BOTÕES INFERIORES - Pixel Art
  // ========================================
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  bagButton: {
    width: "48%",
    ...pixelArt.buttons.action,
    opacity: 0.5,
  },
  bagButtonText: {
    ...pixelArt.buttons.text,
  },
  runButton: {
    width: "48%",
    backgroundColor: pixelArt.buttons.danger.backgroundColor,
    borderRadius: pixelArt.buttons.danger.borderRadius,
    paddingVertical: pixelArt.buttons.danger.paddingVertical,
    alignItems: "center",
    justifyContent: "center",
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  battleEndCard: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.xxl,
    alignItems: "center",
    width: "85%",
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
    textAlign: "center",
    marginBottom: pixelArt.spacing.lg,
  },
  battleEndWinner: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 16,
    color: pixelArt.colors.textDark,
    textAlign: "center",
    marginBottom: pixelArt.spacing.md,
  },
  battleEndSubtext: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    textAlign: "center",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.lg,
    width: "90%",
    maxWidth: 600,
    maxHeight: "80%",
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
    textAlign: "center",
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
    backgroundColor: "#f9f9f9",
  },
  teamColumnTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    color: pixelArt.colors.textLight,
    textAlign: "center",
    marginBottom: pixelArt.spacing.md,
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#f0f0f0",
  },
  teamCardOpponent: {
    backgroundColor: "#f8f9fa",
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
    justifyContent: "center",
    alignItems: "center",
    padding: pixelArt.spacing.xl,
  },
  errorText: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 16,
    color: pixelArt.colors.error,
    marginBottom: pixelArt.spacing.sm,
    textAlign: "center",
  },
  errorSubtext: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    marginBottom: pixelArt.spacing.lg,
    textAlign: "center",
  },
  loadingText: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 18,
    color: pixelArt.colors.sparkleColor,
    marginBottom: pixelArt.spacing.sm,
    textAlign: "center",
  },
  loadingSubtext: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
    textAlign: "center",
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
    backgroundColor: "rgba(245, 230, 211, 0.95)",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#8B7355",
    padding: 12,
    alignItems: "center",
    minHeight: 160,
  },
  switchCandidateCardDisabled: {
    backgroundColor: "rgba(150, 150, 150, 0.5)",
    borderColor: "#666",
  },
  switchCandidateImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  switchCandidateName: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  switchCandidateHp: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  switchCandidateReason: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: "#ff6b6b",
    textAlign: "center",
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
    backgroundColor: "rgba(44, 44, 46, 0.95)",
    borderRadius: 12,
    borderWidth: 3,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemButtonDisabled: {
    opacity: 0.5,
    borderColor: "#4A4A4C",
  },
  itemButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  itemIcon: {
    fontSize: 32,
    width: 40,
    textAlign: "center",
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  itemNameDisabled: {
    color: "#8E8E93",
  },
  itemDescription: {
    fontSize: 12,
    color: "#AEAEB2",
  },
  itemDescriptionDisabled: {
    color: "#636366",
  },
  itemQuantityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: "center",
  },
  itemQuantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  itemOutOfStockBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: "center",
  },
  itemOutOfStockText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  
  // ========================================
  // CARDS DE ATAQUE COMPACTOS
  // ========================================
  attackBackdrop: {
    flex: 1,
    justifyContent: "center",
  },
  attackButtonCompact: {
    width: "48%",
    minHeight: 125,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#333",
    backgroundColor: "#FFFFFF",
    ...pixelArt.shadows.card,
    position: "relative",
  },
  attackButtonContent: {
    flex: 1,
    padding: 19,
    justifyContent: "space-between",
    alignItems: "center",
  },
  attackTypeEmojiLarge: {
    fontSize: 38,
  },
  attackButtonNameCompact: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  infoButtonBattle: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  infoIconBattle: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

