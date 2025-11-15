import { StyleSheet } from 'react-native';

type PaletteTriplet = { light: string; dark: string; accent: string };
type RGB = { r: number; g: number; b: number };

const CARD_WIDTH_LARGE = 210;
const CARD_WIDTH_SMALL = 160;
const CARD_MIN_HEIGHT_LARGE = 320;
const CARD_MIN_HEIGHT_SMALL = 260;
const CARD_SHADOW_OFFSET = 10;
const BORDER_WIDTH = 4;
const PIXEL_CORNER_SIZE = BORDER_WIDTH * 2;
const PIXEL_CORNER_OFFSET = BORDER_WIDTH + 2;

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace('#', '').trim();
  if (![3, 6].includes(normalized.length)) {
    return null;
  }

  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const int = Number.parseInt(expanded, 16);
  if (Number.isNaN(int)) {
    return null;
  }

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (channel: number) => clampChannel(channel).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(colorA: string, colorB: string, ratio: number): string {
  const mix = clamp01(ratio);
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);

  if (!rgbA || !rgbB) {
    return colorA;
  }

  const blended: RGB = {
    r: rgbA.r + (rgbB.r - rgbA.r) * mix,
    g: rgbA.g + (rgbB.g - rgbA.g) * mix,
    b: rgbA.b + (rgbB.b - rgbA.b) * mix,
  };

  return rgbToHex(blended);
}

function lightenColor(color: string, amount: number): string {
  return mixColors(color, '#ffffff', clamp01(amount));
}

function darkenColor(color: string, amount: number): string {
  return mixColors(color, '#000000', clamp01(amount));
}

function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return `rgba(0, 0, 0, ${clamp01(alpha)})`;
  }
  const clampedAlpha = clamp01(alpha);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedAlpha})`;
}

export type PixelCardColors = {
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  cardOuterFill: string;
  cardOuterBorder: string;
  cardGradientTop: string;
  cardGradientBottom: string;
  cardHighlight: string;
  cardLowlight: string;
  headerBackground: string;
  headerBorder: string;
  headerShadow: string;
  iconBackground: string;
  iconBorder: string;
  iconShadow: string;
  titleColor: string;
  titleShadow: string;
  barOuterBackground: string;
  barOuterBorder: string;
  barInnerBackground: string;
  hpFill: string;
  imageBackground: string;
  imageBorder: string;
  imageShadow: string;
  footerBackground: string;
  footerBorder: string;
  footerShadow: string;
  statBackground: string;
  statBorder: string;
  statShadow: string;
  statLabelColor: string;
  statValueColor: string;
  statTextShadow: string;
  overlayColor: string;
  loadingOverlay: string;
  removeButtonBackground: string;
  removeButtonBorder: string;
  removeButtonText: string;
  cardShadowBlock: string;
  cardShadowBorder: string;
  cornerPixel: string;
  cornerBorder: string;
};

export function buildPixelCardColors(palette: PaletteTriplet): PixelCardColors {
  const baseDark = darkenColor(palette.dark, 0.65);
  const deepDark = darkenColor(baseDark, 0.35);
  const luminousLight = lightenColor(palette.light, 0.35);

  const cardOuterBorder = darkenColor(deepDark, 0.15);
  const cardOuterFill = darkenColor(baseDark, 0.05);
  const cardBorder = darkenColor(baseDark, 0.1);
  const cardBackground = mixColors(luminousLight, palette.accent, 0.25);
  const cardGradientTop = lightenColor(cardBackground, 0.08);
  const cardGradientBottom = mixColors(palette.accent, palette.dark, 0.45);
  const cardShadow = darkenColor(deepDark, 0.1);
  const cardShadowBlock = darkenColor(deepDark, 0.2);
  const cardShadowBorder = darkenColor(cardShadowBlock, 0.15);
  const cardHighlight = mixColors(palette.accent, luminousLight, 0.6);
  const cardLowlight = mixColors(palette.accent, deepDark, 0.7);

  const headerBackground = mixColors(baseDark, palette.accent, 0.35);
  const headerBorder = darkenColor(baseDark, 0.15);
  const headerShadow = darkenColor(baseDark, 0.35);

  const iconBackground = lightenColor(palette.light, 0.48);
  const iconBorder = darkenColor(palette.accent, 0.4);
  const iconShadow = darkenColor(palette.accent, 0.55);

  const titleColor = lightenColor(palette.light, 0.08);
  const titleShadow = darkenColor(baseDark, 0.5);

  const barOuterBackground = lightenColor(palette.accent, 0.25);
  const barOuterBorder = darkenColor(palette.accent, 0.5);
  const barInnerBackground = darkenColor(palette.accent, 0.3);
  const hpFill = mixColors(palette.accent, luminousLight, 0.25);

  const imageBackground = mixColors(luminousLight, palette.accent, 0.55);
  const imageBorder = darkenColor(palette.accent, 0.45);
  const imageShadow = darkenColor(palette.accent, 0.6);

  const footerBackground = mixColors(luminousLight, baseDark, 0.6);
  const footerBorder = darkenColor(baseDark, 0.2);
  const footerShadow = darkenColor(baseDark, 0.4);

  const statBackground = lightenColor(palette.light, 0.4);
  const statBorder = darkenColor(palette.accent, 0.45);
  const statShadow = darkenColor(palette.accent, 0.6);
  const statLabelColor = darkenColor(palette.accent, 0.15);
  const statValueColor = darkenColor(palette.dark, 0.2);
  const statTextShadow = darkenColor(palette.accent, 0.6);

  const overlayColor = withAlpha(darkenColor(baseDark, 0.15), 0.65);
  const loadingOverlay = withAlpha(darkenColor(baseDark, 0.05), 0.45);

  const removeButtonBackground = withAlpha(darkenColor(palette.accent, 0.1), 0.65);
  const removeButtonBorder = lightenColor(palette.light, 0.4);
  const removeButtonText = lightenColor(palette.light, 0.25);
  const cornerPixel = mixColors(palette.accent, luminousLight, 0.5);
  const cornerBorder = darkenColor(cardOuterBorder, 0.35);

  return {
    cardBackground,
    cardBorder,
    cardShadow,
    cardOuterFill,
    cardOuterBorder,
    cardGradientTop,
    cardGradientBottom,
    cardHighlight,
    cardLowlight,
    headerBackground,
    headerBorder,
    headerShadow,
    iconBackground,
    iconBorder,
    iconShadow,
    titleColor,
    titleShadow,
    barOuterBackground,
    barOuterBorder,
    barInnerBackground,
    hpFill,
    imageBackground,
    imageBorder,
    imageShadow,
    footerBackground,
    footerBorder,
    footerShadow,
    statBackground,
    statBorder,
    statShadow,
    statLabelColor,
    statValueColor,
    statTextShadow,
    overlayColor,
    loadingOverlay,
    removeButtonBackground,
    removeButtonBorder,
    removeButtonText,
    cardShadowBlock,
    cardShadowBorder,
    cornerPixel,
    cornerBorder,
  };
}

// Cores específicas para cada Coffeemon
const coffeemonColors: { [key: string]: PaletteTriplet } = {
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
const typeColors: { [key: string]: PaletteTriplet } = {
  floral: { light: '#A57BC4', dark: '#4A236A', accent: '#7D4B9F' },
  sweet: { light: '#E8A26A', dark: '#8E4B1F', accent: '#C1743A' },
  fruity: { light: '#FFF4D6', dark: '#E67E22', accent: '#F39C12' },
  nutty: { light: '#F0E6D2', dark: '#8B6F47', accent: '#A0826D' },
  roasted: { light: '#FFD6B3', dark: '#D35400', accent: '#E67E22' },
  spicy: { light: '#FFD4D4', dark: '#C0392B', accent: '#E74C3C' },
  sour: { light: '#D8F0DC', dark: '#27AE60', accent: '#2ECC71' },
};

export const PIXEL_FONT = 'PressStart2P_400Regular';

const defaultPalette: PaletteTriplet = { light: '#F5F5F5', dark: '#795548', accent: '#8D6E63' };

export function getTypeColor(type: string | undefined, name: string): { light: string; dark: string; accent: string } {
  // Primeiro tenta buscar pela cor específica do Coffeemon
  const coffeemonColor = coffeemonColors[name.toLowerCase()];
  if (coffeemonColor) {
    return coffeemonColor;
  }
  // Se não encontrar, usa a cor do tipo
  if (!type) {
    return defaultPalette;
  }

  const normalizedType = type.toLowerCase();
  return typeColors[normalizedType] || defaultPalette;
}

export const styles = StyleSheet.create({
  touchableWrapper: {
    width: '100%',
    marginBottom: 20,
  },

  touchableWrapperSmall: {
    width: '100%',
    marginBottom: 16,
  },

  cardPixelWrapper: {
    position: 'relative',
    borderWidth: BORDER_WIDTH,
    borderRadius: 0,
    marginBottom: CARD_SHADOW_OFFSET,
    overflow: 'visible',
    backgroundColor: '#111111',
    borderColor: '#000000',
    alignSelf: 'flex-start',
    padding: 0,
    width: CARD_WIDTH_LARGE,
  },

  cardPixelWrapperSmall: {
    marginBottom: CARD_SHADOW_OFFSET,
    alignSelf: 'flex-start',
    width: CARD_WIDTH_SMALL,
  },

  coffeemonCard: {
    width: CARD_WIDTH_LARGE,
    minHeight: CARD_MIN_HEIGHT_LARGE,
    borderRadius: 0,
    borderWidth: BORDER_WIDTH,
    borderColor: '#000000',
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },

  coffeemonCardSmall: {
    width: CARD_WIDTH_SMALL,
    minHeight: CARD_MIN_HEIGHT_SMALL,
  },

  coffeemonCardSelected: {
    opacity: 0.95,
  },

  // ========================================
  // HEADER
  // ========================================
  cardHeader: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    shadowColor: '#808080',
    elevation: 1,
    marginBottom: 10,
    backgroundColor: '#c0c0c0',
  },

  headerNameAndHp: {
    flex: 1,
  },

  headerIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    shadowColor: '#888888',
    elevation: 1,
    marginRight: 8,
    backgroundColor: '#ffffff',
  },

  headerIcon: {
    fontSize: 16,
  },

  coffeemonName: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: PIXEL_FONT,
    letterSpacing: 0.8,
    textAlign: 'right',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    marginBottom: 3,
    color: '#ffffff',
    textShadowColor: '#000000',
  },

  // Barra de HP no Header (abaixo do nome)
  headerStatBarOuter: {
    width: '100%',
    height: 12,
    borderRadius: 0,
    padding: 1,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#ffe0a9',
  },

  headerStatBarInner: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },

  headerStatBarFill: {
    height: '100%',
    borderRadius: 0,
    backgroundColor: '#8BC34A',
  },

  // ========================================
  // IMAGEM
  // ========================================
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderWidth: 2,
    borderColor: '#000000',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    shadowColor: '#606060',
    elevation: 1,
    marginBottom: 10,
    backgroundColor: '#a0a0a0',
  },

  coffeemonImage: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#000000',
  },

  // ========================================
  // FOOTER
  // ========================================
  cardFooter: {
    borderTopWidth: 0,
    marginTop: 'auto',
  },

  footerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    shadowColor: '#808080',
    elevation: 1,
    backgroundColor: '#c0c0c0',
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    flex: 1,
    justifyContent: 'center',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    shadowColor: '#888888',
    elevation: 1,
    marginHorizontal: 4,
    backgroundColor: '#ffffff',
  },

  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: PIXEL_FONT,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginRight: 6,
    color: '#333333',
  },

  statValue: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: PIXEL_FONT,
    letterSpacing: 0.6,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    color: '#0c2a66',
    textShadowColor: '#000000',
  },

  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  removeButton: {
    width: 48,
    height: 48,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },

  removeButtonText: {
    fontSize: 36,
    lineHeight: 38,
    fontWeight: 'bold',
    fontFamily: PIXEL_FONT,
    color: '#FFFFFF',
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
    borderRadius: 0,
  },

  cardShadowBlock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050505',
    borderColor: '#000000',
    transform: [{ translateX: CARD_SHADOW_OFFSET }, { translateY: CARD_SHADOW_OFFSET }],
    borderRadius: 0,
    borderWidth: BORDER_WIDTH,
    pointerEvents: 'none',
    zIndex: -1,
  },

  pixelOverlayContainer: {
    position: 'absolute',
    top: BORDER_WIDTH,
    right: BORDER_WIDTH,
    bottom: BORDER_WIDTH,
    left: BORDER_WIDTH,
    zIndex: 10,
    pointerEvents: 'none',
  },

  pixelBorderHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BORDER_WIDTH,
  },

  pixelBorderTop: {
    top: 0,
  },

  pixelBorderBottom: {
    bottom: 0,
  },

  pixelBorderVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: BORDER_WIDTH,
  },

  pixelBorderLeft: {
    left: 0,
  },

  pixelBorderRight: {
    right: 0,
  },

  pixelCorner: {
    position: 'absolute',
    width: PIXEL_CORNER_SIZE,
    height: PIXEL_CORNER_SIZE,
    borderRadius: 0,
    borderWidth: BORDER_WIDTH / 2,
  },

  pixelCornerTopLeft: {
    top: PIXEL_CORNER_OFFSET,
    left: PIXEL_CORNER_OFFSET,
  },

  pixelCornerTopRight: {
    top: PIXEL_CORNER_OFFSET,
    right: PIXEL_CORNER_OFFSET,
  },

  pixelCornerBottomLeft: {
    bottom: PIXEL_CORNER_OFFSET,
    left: PIXEL_CORNER_OFFSET,
  },

  pixelCornerBottomRight: {
    bottom: PIXEL_CORNER_OFFSET,
    right: PIXEL_CORNER_OFFSET,
  },
});