import { IStatusEffect, StatusEffectCategory } from './status-effect.interface';

// --- Efeitos de Modificação de Status (Buffs/Debuffs) ---

export const attackUp: IStatusEffect = {
  type: 'attackUp',
  name: 'Attack Up',
  description: 'Increases attack.',
  categories: [StatusEffectCategory.MODIFIER],
  onApply: (target, effect) => {
    target.modifiers.attackModifier *= effect.value ?? 1.5;
    return { notifications: [] };
  },
  onRemove: (target, effect) => {
    target.modifiers.attackModifier /= effect.value ?? 1.5;
    return { notifications: [] };
  },
};

export const defenseUp: IStatusEffect = {
  type: 'defenseUp',
  name: 'Defense Up',
  description: 'Increases defense.',
  categories: [StatusEffectCategory.MODIFIER],
  onApply: (target, effect) => {
    target.modifiers.defenseModifier *= effect.value ?? 1.5;
    return { notifications: [] };
  },
  onRemove: (target, effect) => {
    target.modifiers.defenseModifier /= effect.value ?? 1.5;
    return { notifications: [] };
  },
};

export const defenseDown: IStatusEffect = {
  type: 'defenseDown',
  name: 'Defense Down',
  description: 'Decreases defense.',
  categories: [StatusEffectCategory.MODIFIER],
  onApply: (target, effect) => {
    target.modifiers.defenseModifier *= effect.value ?? 0.8;
    return { notifications: [] };
  },
  onRemove: (target, effect) => {
    target.modifiers.defenseModifier /= effect.value ?? 0.8;
    return { notifications: [] };
  },
};

// --- Efeitos de Dano ---

export const burn: IStatusEffect = {
  type: 'burn',
  name: 'Burn',
  description: 'Deals damage at the end of the turn.',
  categories: [StatusEffectCategory.OVER_TIME],
  onTurnEnd: (owner, effect) => {
    const damage = effect.value;
    owner.currentHp -= damage ?? 0;
    return {
      notifications: [
        {
          eventKey: 'STATUS_DAMAGE',
          payload: { coffeemonName: owner.name, damage: damage, effectType: 'burn' },
        },
      ],
    };
  },
};

export const poison: IStatusEffect = {
  type: 'poison',
  name: 'Poison',
  description: 'Deals moderate damage at the end of each turn.',
  categories: [StatusEffectCategory.OVER_TIME],
  onTurnEnd: (owner, effect) => {
    const damage = effect.value;
    owner.currentHp -= damage ?? 10;
    return {
      notifications: [
        {
          eventKey: 'STATUS_DAMAGE',
          payload: { coffeemonName: owner.name, damage: damage, effectType: 'poison' },
        },
      ],
    };
  },
};

// --- Efeitos de Bloqueio ---

export const sleep: IStatusEffect = {
  type: 'sleep',
  name: 'Sleep',
  description: 'Prevents all actions for a few turns.',
  categories: [StatusEffectCategory.BLOCKING],
};

export const freeze: IStatusEffect = {
  type: 'freeze',
  name: 'Freeze',
  description: 'Prevents action.',
  categories: [StatusEffectCategory.BLOCKING],
};

// --- Efeitos Instantâneos ---

export const fixedHeal: IStatusEffect = {
  type: 'fixedHeal',
  name: 'Fixed Healing',
  description: 'Restores HP instantly by a fixed amount.',
  categories: [],
  onApply: (target, effect) => {
    const healAmount = effect.value ?? 15;
    const newHp = Math.min(target.maxHp, target.currentHp + healAmount);
    const actualHeal = newHp - target.currentHp;
    target.currentHp = newHp;
    
    if (actualHeal > 0) {
      return {
        notifications: [
          {
            eventKey: 'STATUS_HEAL',
            payload: { coffeemonName: target.name, amount: actualHeal, effectType: 'fixedHeal' },
          },
        ],
      };
    }
    return { notifications: [] };
  },
};

export const lifesteal: IStatusEffect = {
  type: 'lifesteal',
  name: 'Lifesteal',
  description: 'Restores HP based on damage dealt.',
  categories: [], 
};

export const statusEffectRegistry: Record<string, IStatusEffect> = {
  burn,
  poison,
  sleep,
  freeze,
  attackUp,
  defenseUp,
  defenseDown,
  fixedHeal,
  lifesteal,
};
