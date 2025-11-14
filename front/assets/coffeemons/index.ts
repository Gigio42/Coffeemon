/**
 * Mapeamento centralizado de imagens dos Coffeemons
 * Este arquivo gerencia todas as imagens (default e back) de cada Coffeemon
 */

import type { ImageSourcePropType } from 'react-native';

export type CoffeemonVariant = 'default' | 'back' | 'hurt' | 'sleeping';

export interface CoffeemonImages {
  default: ImageSourcePropType;
  back: ImageSourcePropType;
  hurt?: ImageSourcePropType;
  sleeping?: ImageSourcePropType;
}

export interface CoffeemonImageMap {
  [key: string]: CoffeemonImages;
}

const coffeemonImages: CoffeemonImageMap = {
  jasminelle: {
    default: require('./jasminelle/default.png'),
    back: require('./jasminelle/back.png'),
    hurt: require('./jasminelle/hurt.png'),
    sleeping: require('./jasminelle/sleeping.png'),
  },
  limonetto: {
    default: require('./limonetto/default.png'),
    back: require('./limonetto/back.png'),
    hurt: require('./limonetto/hurt.png'),
    sleeping: require('./limonetto/sleeping.png'),
  },
  maprion: {
    default: require('./maprion/default.png'),
    back: require('./maprion/back.png'),
    hurt: require('./maprion/hurt.png'),
    sleeping: require('./maprion/sleeping.png'),
  },
  emberly: {
    default: require('./emberly/default.png'),
    back: require('./emberly/back.png'),
    hurt: require('./emberly/hurt.png'),
    sleeping: require('./emberly/sleeping.png'),
  },
  almondino: {
    default: require('./almondino/default.png'),
    back: require('./almondino/back.png'),
    hurt: require('./almondino/hurt.png'),
    sleeping: require('./almondino/sleeping.png'),
  },
  gingerlynn: {
    default: require('./gingerlynn/default.png'),
    back: require('./gingerlynn/back.png'),
    hurt: require('./gingerlynn/hurt.png'),
    sleeping: require('./gingerlynn/sleeping.png'),
  },
};

const FALLBACK_KEY = 'jasminelle';

export const getCoffeemonImage = (
  name: string,
  variant: CoffeemonVariant = 'default',
): ImageSourcePropType => {
  const baseName = name.split(' (Lvl')[0].toLowerCase().trim();
  const images = coffeemonImages[baseName] ?? coffeemonImages[FALLBACK_KEY];

  if (!coffeemonImages[baseName]) {
    console.warn(
      `[CoffeemonImages] Image not found for "${name}" (${variant}), using ${FALLBACK_KEY} fallback`,
    );
  }

  if (images?.[variant]) {
    return images[variant] as ImageSourcePropType;
  }

  if (variant !== 'default' && images?.default) {
    return images.default;
  }

  return coffeemonImages[FALLBACK_KEY].default;
};

export const hasCoffeemonImage = (name: string): boolean => {
  const baseName = name.split(' (Lvl')[0].toLowerCase().trim();
  return Boolean(coffeemonImages[baseName]);
};

export const getAvailableCoffeemons = (): string[] => {
  return Object.keys(coffeemonImages);
};

export default coffeemonImages;
