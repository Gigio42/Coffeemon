import { StyleSheet } from 'react-native';
import { metrics } from '../../theme';
import { pixelArt } from '../../theme/pixelArt';

// Cores específicas para cada Coffeemon
const coffeemonColors: { [key: string]: { light: string; dark: string; accent: string } } = {
  jasminelle: { light: '#E6D4F0', dark: '#7B4B9E', accent: '#A066C7' }, // Roxo suave (floral)
  limonetto: { light: '#FFF9B8', dark: '#D4A017', accent: '#F5C243' }, // Amarelo limão
  maprion: { light: '#E8A26A', dark: '#8E4B1F', accent: '#C1743A' }, // Laranja/Marrom
  cocoly: { light: '#D4C4A8', dark: '#8B6F47', accent: '#A89968' }, // Bege/Castanho (nutty)
  emberly: { light: '#FF9966', dark: '#CC4400', accent: '#E65C00' }, // Laranja queimado
  cinnara: { light: '#FF8585', dark: '#B71C1C', accent: '#E53935' }, // Vermelho picante
  herban: { light: '#B8E6B8', dark: '#2E7D32', accent: '#4CAF50' }, // Verde (sour)
  chocobrawl: { light: '#D2A679', dark: '#6F4E37', accent: '#A67B5B' }, // Marrom chocolate
};

// Cores de fallback por tipo
const typeColors: { [key: string]: { light: string; dark: string; accent: string } } = {
  floral: { light: '#A57BC4', dark: '#4A236A', accent: '#7D4B9F' },
  sweet: { light: '#E8A26A', dark: '#8E4B1F', accent: '#C1743A' },
  fruity: { light: '#FFF4D6', dark: '#E67E22', accent: '#F39C12' },
  nutty: { light: '#F0E6D2', dark: '#8B6F47', accent: '#A0826D' },
  roasted: { light: '#FFD6B3', dark: '#D35400', accent: '#E67E22' },
  spicy: { light: '#FFD4D4', dark: '#C0392B', accent: '#E74C3C' },
  sour: { light: '#D8F0DC', dark: '#27AE60', accent: '#2ECC71' },
};

export function getTypeColor(type: string, name: string): { light: string; dark: string; accent: string } {
  // Primeiro tenta buscar pela cor específica do Coffeemon
  const coffeemonColor = coffeemonColors[name.toLowerCase()];
  if (coffeemonColor) {
    return coffeemonColor;
  }
  // Se não encontrar, usa a cor do tipo
  return typeColors[type.toLowerCase()] || { light: '#F5F5F5', dark: '#795548', accent: '#8D6E63' };
}

export const styles = StyleSheet.create({
  touchableWrapper: {
    width: '100%',
  },
  touchableWrapperSmall: {
    width: '100%',
  },
  coffeemonCard: {
    width: 180,
    marginBottom: 16,
    borderRadius: pixelArt.borders.radiusMedium,
    overflow: 'hidden',
    borderWidth: pixelArt.borders.widthBold,
    // borderColor é definido no componente
    minHeight: 280,
    position: 'relative',
  },
  coffeemonCardSmall: {
    width: 140,
    minHeight: 230,
  },
  coffeemonCardSelected: {
    opacity: 0.95,
  },

  // ========================================
  // HEADER
  // ========================================
  cardHeader: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: pixelArt.borders.widthBold,
    // backgroundColor e borderBottomColor definidos no componente
  },
  headerNameAndHp: {
    flex: 1,
    gap: 4,
  },
  headerIconContainer: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: pixelArt.borders.radiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: pixelArt.borders.widthThin,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerIcon: {
    fontSize: 18,
  },
  coffeemonName: {
    fontSize: 16, // Fonte maior
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Barra de HP no Header (abaixo do nome)
  headerStatBarOuter: {
    width: '100%',
    height: 12,
    // backgroundColor definido no componente (usa typeColor.accent para ser mais escuro que o card)
    borderRadius: pixelArt.borders.radiusSmall,
    padding: 2,
  },
  headerStatBarInner: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: pixelArt.borders.radiusSmall,
    overflow: 'hidden',
  },
  headerStatBarFill: {
    height: '100%',
    borderRadius: pixelArt.borders.radiusSmall,
  },

  // ========================================
  // IMAGEM
  // ========================================
  imageContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // Sem padding para a imagem preencher
  },
  coffeemonImage: {
    width: '100%',
    height: 130, // Altura maior para a imagem principal
  },

  // ========================================
  // STATS (REMOVIDO)
  // ========================================
  // ... Estilos de statsContainer, statRow, etc. foram removidos ...

  // ========================================
  // FOOTER
  // ========================================
  cardFooter: {
    padding: 0,
    alignItems: 'center',
    borderTopWidth: pixelArt.borders.widthBold,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 'auto',
  },
  footerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: pixelArt.borders.widthThin,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    justifyContent: 'center',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    opacity: 0.8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // Barra de EXP no Footer
  footerStatBarOuter: {
    flex: 1, // Ocupa o espaço disponível
    height: 18,
    backgroundColor: '#1A0F08',
    borderRadius: 9,
    padding: 3,
    marginRight: 8, // Espaço antes do nível
  },
  footerStatBarInner: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  footerStatBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  // Level (reutilizado)
  levelIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelIconText: {
    fontSize: 16,
  },
  levelBadge: {
    backgroundColor: '#2C1810',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderTopColor: '#4A3426',
    borderLeftColor: '#4A3426',
    borderBottomColor: '#1A0F08',
    borderRightColor: '#1A0F08',
    marginHorizontal: 4,
    minWidth: 30,
    alignItems: 'center',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: pixelArt.borders.widthBold,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 34,
    fontWeight: 'bold',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});