import * as FileSystem from 'expo-file-system/legacy';
import { Image, Platform } from 'react-native';
import { Asset } from 'expo-asset';
import UPNG from 'upng-js';
import { decode as decodeBase64 } from 'base-64';
import { useEffect, useState } from 'react';
import type { ImageResolvedAssetSource, ImageSourcePropType } from 'react-native';

export type Palette = {
  light: string;
  dark: string;
  accent: string;
};

const paletteCache = new Map<string, Palette>();
const pixelCache = new Map<string, Uint8Array>();

const DEFAULT_PALETTE: Palette = {
  light: '#F5F5F5',
  dark: '#795548',
  accent: '#8D6E63',
};

function clamp(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((component) => component.toString(16).padStart(2, '0'))
    .join('')}`;
}

function adjustColorChannel(channel: number, amount: number): number {
  if (amount >= 0) {
    return clamp(channel + (255 - channel) * amount);
  }
  return clamp(channel * (1 + amount));
}

function adjustColor(color: { r: number; g: number; b: number }, amount: number): string {
  const r = adjustColorChannel(color.r, amount);
  const g = adjustColorChannel(color.g, amount);
  const b = adjustColorChannel(color.b, amount);
  return rgbToHex(r, g, b);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  if (s === 0) {
    const grey = clamp(Math.round(l * 255));
    return { r: grey, g: grey, b: grey };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tempT = t;
    if (tempT < 0) tempT += 1;
    if (tempT > 1) tempT -= 1;
    if (tempT < 1 / 6) return p + (q - p) * 6 * tempT;
    if (tempT < 1 / 2) return q;
    if (tempT < 2 / 3) return p + (q - p) * (2 / 3 - tempT) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return {
    r: clamp(Math.round(r * 255)),
    g: clamp(Math.round(g * 255)),
    b: clamp(Math.round(b * 255)),
  };
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = decodeBase64(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function computeAverageColor(pixelData: Uint8Array): { r: number; g: number; b: number } {
  let rTotal = 0;
  let gTotal = 0;
  let bTotal = 0;
  let count = 0;

  for (let i = 0; i < pixelData.length; i += 4) {
    const alpha = pixelData[i + 3];
    if (alpha < 64) {
      continue;
    }
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    rTotal += r;
    gTotal += g;
    bTotal += b;
    count += 1;
  }

  if (count === 0) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: rTotal / count,
    g: gTotal / count,
    b: bTotal / count,
  };
}

interface BucketStats {
  count: number;
  rTotal: number;
  gTotal: number;
  bTotal: number;
  saturationTotal: number;
}

interface DominantColorResult {
  color: { r: number; g: number; b: number };
  saturation: number;
}

function computeDominantColor(pixelData: Uint8Array): DominantColorResult | null {
  const buckets = new Map<number, BucketStats>();
  const sampleStride = 4 * 2; // sample every 2 pixels to reduce processing

  for (let i = 0; i < pixelData.length; i += sampleStride) {
    const alpha = pixelData[i + 3];
    if (alpha < 96) {
      continue;
    }

    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;

    const bucketKey = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(bucketKey);

    if (bucket) {
      bucket.count += 1;
      bucket.rTotal += r;
      bucket.gTotal += g;
      bucket.bTotal += b;
      bucket.saturationTotal += saturation;
    } else {
      buckets.set(bucketKey, {
        count: 1,
        rTotal: r,
        gTotal: g,
        bTotal: b,
        saturationTotal: saturation,
      });
    }
  }

  let bestScore = -1;
  let bestColor: { r: number; g: number; b: number } | null = null;
  let bestSaturation = 0;

  buckets.forEach((stats) => {
    if (stats.count < 5) {
      return;
    }

    const avgSaturation = stats.saturationTotal / stats.count;
    const score = stats.count * (0.4 + avgSaturation);

    if (score > bestScore) {
      bestScore = score;
      bestColor = {
        r: stats.rTotal / stats.count,
        g: stats.gTotal / stats.count,
        b: stats.bTotal / stats.count,
      };
      bestSaturation = avgSaturation;
    }
  });

  if (!bestColor) {
    return null;
  }

  return {
    color: bestColor,
    saturation: bestSaturation,
  };
}

function buildPaletteFromPixels(pixelData: Uint8Array, fallback: Palette): Palette {
  const average = computeAverageColor(pixelData);
  const dominantResult = computeDominantColor(pixelData);

  if (!dominantResult) {
    return fallback;
  }

  const dominant = dominantResult.color;
  const dominantHsl = rgbToHsl(dominant.r, dominant.g, dominant.b);
  const averageHsl = rgbToHsl(average.r, average.g, average.b);

  const ensuredSaturation = clamp01(Math.max(dominantHsl.s, 0.25));

  const lightHsl = {
    h: dominantHsl.h,
    s: clamp01(ensuredSaturation * 0.85 + 0.1),
    l: clamp01(dominantHsl.l + 0.18),
  };

  const darkHsl = {
    h: dominantHsl.h,
    s: clamp01(ensuredSaturation * 1.1),
    l: clamp01(dominantHsl.l - 0.15),
  };

  const accentHsl = {
    h: averageHsl.h,
    s: clamp01((averageHsl.s + ensuredSaturation) / 2 + 0.05),
    l: clamp01(averageHsl.l * 0.85 + 0.05),
  };

  const lightRgb = hslToRgb(lightHsl.h, lightHsl.s, lightHsl.l);
  const darkRgb = hslToRgb(darkHsl.h, darkHsl.s, darkHsl.l);
  const accentRgb = hslToRgb(accentHsl.h, accentHsl.s, accentHsl.l);

  return {
    light: rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
    dark: rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
    accent: rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b),
  };
}

function ensureResolvedSource(source: ImageSourcePropType | null | undefined): ImageResolvedAssetSource {
  if (!source) {
    throw new Error('No image source provided');
  }

  const imageModule = Image as unknown as {
    resolveAssetSource?: (src: ImageSourcePropType) => ImageResolvedAssetSource | null;
    default?: {
      resolveAssetSource?: (src: ImageSourcePropType) => ImageResolvedAssetSource | null;
    };
  };

  const resolver = imageModule.resolveAssetSource ?? imageModule.default?.resolveAssetSource;
  if (resolver) {
    const resolved = resolver(source);
    if (resolved?.uri) {
      return resolved;
    }
  }

  if (typeof source === 'object' && source !== null && 'uri' in source && source.uri) {
    const uriSource = source as { uri: string; width?: number; height?: number; scale?: number };
    return {
      uri: uriSource.uri,
      width: uriSource.width ?? 0,
      height: uriSource.height ?? 0,
      scale: uriSource.scale ?? 1,
    };
  }

  if (typeof source === 'string') {
    return {
      uri: source,
      width: 0,
      height: 0,
      scale: 1,
    };
  }

  throw new Error('Unable to resolve asset source URI');
}

function extractBase64FromDataUri(uri: string): string {
  const commaIndex = uri.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid data URI');
  }
  return uri.slice(commaIndex + 1);
}

function getResolvedLocalUri(resolved: ImageResolvedAssetSource): string | undefined {
  const candidate = (resolved as unknown as { localUri?: string }).localUri;
  return candidate ?? undefined;
}

async function loadRawAssetData(source: ImageSourcePropType, resolved: ImageResolvedAssetSource): Promise<Uint8Array> {
  let baseUri = getResolvedLocalUri(resolved) ?? resolved.uri;

  if (!baseUri) {
    throw new Error('Resolved asset missing URI');
  }

  if (baseUri.startsWith('data:')) {
    const base64 = extractBase64FromDataUri(baseUri);
    return base64ToUint8Array(base64);
  }

  if (Platform.OS === 'web') {
    const absoluteUri =
      baseUri.startsWith('http://') || baseUri.startsWith('https://') || baseUri.startsWith('/')
        ? baseUri
        : `${typeof window !== 'undefined' ? window.location.origin : ''}${baseUri}`;
    const response = await fetch(absoluteUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  let fileUri = baseUri;

  if (!fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
    if (typeof source === 'number') {
      try {
        const asset = Asset.fromModule(source);
        await asset.downloadAsync();
        const assetUri = asset.localUri ?? asset.uri;
        if (assetUri) {
          fileUri = assetUri;
        }
      } catch (assetError) {
        console.warn('[colorPalette] Failed to load asset via expo-asset', assetError);
      }
    }
  }

  if (!fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
    const directories = FileSystem as { cacheDirectory?: string | null; documentDirectory?: string | null };
    const baseDir = directories.cacheDirectory ?? directories.documentDirectory ?? '';
    const normalizedDir = baseDir.replace(/\\/g, '/');
    const dirWithSlash = normalizedDir.endsWith('/') ? normalizedDir : `${normalizedDir}/`;
    const cacheFileName = `palette-${encodeURIComponent(resolved.uri)}-${resolved.width ?? 'w'}x${resolved.height ?? 'h'}.png`;
    const targetUri = `${dirWithSlash}${cacheFileName}`;
    const downloadResult = await FileSystem.downloadAsync(baseUri, targetUri);
    fileUri = downloadResult.uri;
  }

  const fileContents = await FileSystem.readAsStringAsync(fileUri, {
    encoding: 'base64',
  });

  return base64ToUint8Array(fileContents);
}

async function getPixelsFromResolvedSource(
  source: ImageSourcePropType,
  resolved: ImageResolvedAssetSource,
): Promise<Uint8Array> {
  const cacheKey = resolved.uri;
  const cached = pixelCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const rawBytes = await loadRawAssetData(source, resolved);
  const png = UPNG.decode(rawBytes.buffer as ArrayBuffer);
  const rgbaFrames = UPNG.toRGBA8(png);
  const firstFrame = rgbaFrames?.[0];

  if (!firstFrame) {
    throw new Error('Unable to decode PNG data');
  }

  const pixels = new Uint8Array(firstFrame);
  pixelCache.set(cacheKey, pixels);
  return pixels;
}

async function computePaletteFromAsset(assetSource: ImageSourcePropType, fallback: Palette): Promise<Palette> {
  try {
    const resolved = ensureResolvedSource(assetSource);
    const cacheKey = resolved.uri;
    const cached = paletteCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const pixels = await getPixelsFromResolvedSource(assetSource, resolved);
    const palette = buildPaletteFromPixels(pixels, fallback);
    paletteCache.set(cacheKey, palette);
    return palette;
  } catch (error) {
    console.warn('[colorPalette] Failed to compute palette', error);
    return fallback;
  }
}

export async function getPaletteFromModule(
  imageModule: ImageSourcePropType | null | undefined,
  fallback: Palette = DEFAULT_PALETTE,
): Promise<Palette> {
  if (!imageModule) {
    return fallback;
  }
  return computePaletteFromAsset(imageModule, fallback);
}

export function useDynamicPalette(imageModule: ImageSourcePropType | null | undefined, fallback: Palette): Palette {
  const [palette, setPalette] = useState<Palette>(fallback);

  useEffect(() => {
    let isMounted = true;
    setPalette(fallback);

    if (!imageModule) {
      return () => {
        isMounted = false;
      };
    }

    getPaletteFromModule(imageModule, fallback)
      .then((result) => {
        if (isMounted) {
          setPalette(result);
        }
      })
      .catch(() => {
        // Errors already logged inside getPaletteFromModule
      });

    return () => {
      isMounted = false;
    };
  }, [imageModule, fallback.light, fallback.dark, fallback.accent]);

  return palette;
}
