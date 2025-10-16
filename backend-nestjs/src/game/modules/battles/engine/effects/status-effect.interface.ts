import { CoffeemonState, StatusEffect } from '../../types/battle-state.types';
import { ActionEventNotification } from '../actions/battle-action-interface';

export enum StatusEffectCategory {
  BLOCKING = 'blocking',
  OVER_TIME = 'over_time',
  MODIFIER = 'modifier',
}

export interface IStatusEffect {
  type: string;
  name: string;
  description: string;
  categories: StatusEffectCategory[];

  onApply?(
    target: CoffeemonState,
    effect: StatusEffect
  ): { notifications: ActionEventNotification[] };
  onRemove?(
    target: CoffeemonState,
    effect: StatusEffect
  ): { notifications: ActionEventNotification[] };
  onTurnEnd?(
    target: CoffeemonState,
    effect: StatusEffect
  ): { notifications: ActionEventNotification[] };
}
