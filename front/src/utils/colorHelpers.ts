type RGB = { r: number; g: number; b: number };

export interface Palette {
  light: string;
  dark: string;
  accent: string;
}

export interface GradientPalette {
  base: string;
  primary: [string, string, string, string];
  accent: [string, string, string];
  highlight: [string, string];
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace('#', '');
  const normalized = cleaned.length === 3
    ? cleaned.split('').map((char) => char + char).join('')
    : cleaned;

  if (normalized.length !== 6) {
    return null;
  }

  const value = parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toChannel = (channel: number) => channel.toString(16).padStart(2, '0');
  return `#${toChannel(Math.round(r))}${toChannel(Math.round(g))}${toChannel(Math.round(b))}`;
}

export function mixColors(colorA: string, colorB: string, ratio: number): string {
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

export function lightenColor(color: string, amount: number): string {
  return mixColors(color, '#ffffff', amount);
}

export function darkenColor(color: string, amount: number): string {
  return mixColors(color, '#000000', amount);
}

export function buildGradientPalette(palette: Palette): GradientPalette {
  const base = darkenColor(palette.dark, 0.6);
  return {
    base,
    primary: [
      darkenColor(palette.dark, 0.45),
      palette.dark,
      mixColors(palette.dark, palette.accent, 0.4),
      lightenColor(palette.light, 0.25),
    ],
    accent: [
      darkenColor(palette.accent, 0.35),
      palette.accent,
      lightenColor(palette.light, 0.4),
    ],
    highlight: [
      lightenColor(palette.light, 0.3),
      lightenColor(palette.light, 0.6),
    ],
  };
}

export const DEFAULT_BACKGROUND_PALETTE: Palette = {
  light: '#F5F5F5',
  dark: '#2C1810',
  accent: '#8B4513',
};
