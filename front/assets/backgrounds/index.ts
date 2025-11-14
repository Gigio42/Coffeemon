import type { ImageSourcePropType } from 'react-native';

const backgroundMap = {
  arenacafe: require('./arenacafe.png'),
  city: require('./city.png'),
  field: require('./field.png'),
  jasminelehome: require('./jasminelehome.png'),
  limonetohome: require('./limonetohome.png'),
} satisfies Record<string, ImageSourcePropType>;

export type BackgroundKey = keyof typeof backgroundMap;

export const backgroundKeys = Object.keys(backgroundMap) as BackgroundKey[];

export const DEFAULT_BACKGROUND_KEY: BackgroundKey = (
  ['field', 'arenacafe', 'city', 'jasminelehome', 'limonetohome'].find((key) =>
    backgroundKeys.includes(key as BackgroundKey)
  ) ??
  backgroundKeys[0]
) as BackgroundKey;

export const backgroundSources = backgroundKeys.map((key) => backgroundMap[key]);

export function getBackgroundSource(name?: string): ImageSourcePropType {
  if (!name) {
    return backgroundMap[DEFAULT_BACKGROUND_KEY];
  }

  const normalizedName = name.toLowerCase() as BackgroundKey;
  if (backgroundMap[normalizedName]) {
    return backgroundMap[normalizedName];
  }

  return backgroundMap[DEFAULT_BACKGROUND_KEY];
}

export default backgroundMap;
