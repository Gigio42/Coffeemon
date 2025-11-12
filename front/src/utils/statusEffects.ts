import { StatusEffect } from '../types';
import { CoffeemonVariant } from '../../assets/coffeemons';

export const SLEEPING_EFFECTS = new Set(['sleep', 'freeze', 'paralysis']);
export const HURT_EFFECTS = new Set(['burn', 'poison']);

export function getVariantForStatusEffects(
  statusEffects: StatusEffect[] | null | undefined,
  baseVariant: CoffeemonVariant = 'default',
): CoffeemonVariant {
  if (!statusEffects || statusEffects.length === 0) {
    return baseVariant;
  }

  const normalizedTypes = statusEffects
    .map((effect) => effect?.type?.toLowerCase())
    .filter((type): type is string => Boolean(type));

  if (normalizedTypes.some((type) => SLEEPING_EFFECTS.has(type))) {
    return 'sleeping';
  }

  if (normalizedTypes.some((type) => HURT_EFFECTS.has(type))) {
    return 'hurt';
  }

  return baseVariant;
}
