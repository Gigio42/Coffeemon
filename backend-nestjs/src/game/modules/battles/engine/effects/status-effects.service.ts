import { Injectable } from '@nestjs/common';
import { CoffeemonState, StatusEffect } from '../../types/battle-state.types';
import { ActionEventNotification } from '../actions/battle-action-interface';
import { StatusEffectCategory } from './status-effect.interface';
import { statusEffectRegistry } from './status-effect.registry';

@Injectable()
export class StatusEffectsService {
  applyEffect(effectToApply: StatusEffect, target: CoffeemonState): ActionEventNotification[] {
    const effectLogic = statusEffectRegistry[effectToApply.type];
    if (!effectLogic) {
      console.error(`Tentativa de aplicar efeito não registrado: ${effectToApply.type}`);
      return [];
    }

    if (!target.statusEffects) {
      target.statusEffects = [];
    }

    const existingEffect = target.statusEffects.find((e) => e.type === effectToApply.type);
    if (existingEffect) {
      existingEffect.duration = effectToApply.duration;
      return [];
    }

    target.statusEffects.push(effectToApply);

    const notifications: ActionEventNotification[] = [];

    notifications.push({
      eventKey: 'STATUS_APPLIED',
      payload: { targetName: target.name, effectType: effectLogic.name },
    });

    if (effectLogic.onApply) {
      const result = effectLogic.onApply(target, effectToApply);
      notifications.push(...result.notifications);
    }

    return notifications;
  }

  processTurnEffects(coffeemon: CoffeemonState): ActionEventNotification[] {
    if (!coffeemon.statusEffects || coffeemon.statusEffects.length === 0) {
      return [];
    }

    const notifications: ActionEventNotification[] = [];
    const remainingEffects: StatusEffect[] = [];

    for (const activeEffect of coffeemon.statusEffects) {
      if (typeof activeEffect.duration === 'number') {
        activeEffect.duration--;
      }

      const effectLogic = statusEffectRegistry[activeEffect.type];
      if (!effectLogic) continue;

      if (typeof activeEffect.duration === 'number' && activeEffect.duration <= 0) {
        if (effectLogic.onRemove) {
          const result = effectLogic.onRemove(coffeemon, activeEffect);
          notifications.push(...result.notifications);
        }

        notifications.push({
          eventKey: 'STATUS_REMOVED',
          payload: { coffeemonName: coffeemon.name, effectType: effectLogic.name },
        });
      } else {
        remainingEffects.push(activeEffect);

        if (effectLogic.onTurnEnd) {
          const result = effectLogic.onTurnEnd(coffeemon, activeEffect);
          notifications.push(...result.notifications);
        }
      }
    }

    coffeemon.statusEffects = remainingEffects;
    return notifications;
  }

  hasEffectInCategory(target: CoffeemonState, category: StatusEffectCategory): boolean {
    if (!target.statusEffects) return false;

    return target.statusEffects.some((activeEffect) => {
      const effectLogic = statusEffectRegistry[activeEffect.type];
      return effectLogic && effectLogic.categories.includes(category);
    });
  }
}
