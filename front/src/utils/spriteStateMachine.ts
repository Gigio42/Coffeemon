import { StatusEffect } from '../types';
import { CoffeemonVariant } from '../../assets/coffeemons';
import { getVariantForStatusEffects, HURT_EFFECTS, SLEEPING_EFFECTS } from './statusEffects';

export type SpriteState = 'idle' | 'hurt' | 'sleeping';

export interface SpriteContext {
  statusEffects?: StatusEffect[];
  recentlyDamaged?: boolean;
}

export interface SpriteStateResult {
  state: SpriteState;
  variant: CoffeemonVariant;
}

export function deriveSpriteState(context: SpriteContext, baseVariant: CoffeemonVariant): SpriteStateResult {
  const { statusEffects, recentlyDamaged } = context;
  const hasSleepingEffect = Boolean(
    statusEffects?.some((effect) =>
      effect?.type ? SLEEPING_EFFECTS.has(effect.type.toLowerCase()) : false,
    ),
  );

  if (hasSleepingEffect) {
    const sleepVariant = getVariantForStatusEffects(statusEffects, baseVariant);
    const resolvedVariant = baseVariant === 'back' ? baseVariant : sleepVariant;
    return {
      state: 'sleeping',
      variant: resolvedVariant,
    };
  }

  const hasHurtEffect = Boolean(
    statusEffects?.some((effect) =>
      effect?.type ? HURT_EFFECTS.has(effect.type.toLowerCase()) : false,
    ),
  );

  if (recentlyDamaged || hasHurtEffect) {
    return {
      state: 'hurt',
      variant: baseVariant === 'back' ? baseVariant : 'hurt',
    };
  }

  return {
    state: 'idle',
    variant: baseVariant,
  };
}
