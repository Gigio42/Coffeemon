import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from 'src/game/modules/items/item.entity';
import { ItemsService } from 'src/game/modules/items/items.service';
import { CoffeemonState } from '../../types/battle-state.types';
import { BattleActionType } from '../../types/enums';
import { StatusEffectsService } from '../effects/status-effects.service';
import {
  ActionEventNotification,
  BattleActionContext,
  BattleActionResult,
  IBattleAction,
} from './battle-action-interface';

const applyItemEffect = (
  item: Item,
  target: CoffeemonState,
  statusService: StatusEffectsService
): { message: string; notifications: ActionEventNotification[] } => {
  const effect = item.effects[0];
  let message = '';
  const notifications: ActionEventNotification[] = [];

  //FIXME: Desacoplar e mover lógica para serviços dedicados como o de status effects
  if (effect.type === 'heal') {
    const healAmount = effect.value as number;
    const newHp = Math.min(target.maxHp, target.currentHp + healAmount);
    const actualHeal = newHp - target.currentHp;
    target.currentHp = newHp;
    message = `Curou ${actualHeal} de HP!`;
    notifications.push({
      eventKey: 'STATUS_HEAL',
      payload: { coffeemonName: target.name, amount: actualHeal, effectType: 'item' },
    });
  } else if (effect.type === 'revive') {
    if (!target.isFainted) {
      message = 'O Coffeemon não está desmaiado.';
    } else {
      target.isFainted = false;
      target.currentHp = target.maxHp * (effect.value as number);
      message = `Reviveu com ${target.currentHp} de HP!`;
      notifications.push({
        eventKey: 'STATUS_HEAL',
        payload: {
          coffeemonName: target.name,
          amount: target.currentHp,
          effectType: 'revive',
        },
      });
    }
  } else if (effect.type === 'cure_status') {
    const statusToCure = effect.value as string;
    const { removed, notifications: cureNotifications } = statusService.removeEffect(
      target,
      statusToCure
    );
    if (removed) {
      message = `Curou o status ${statusToCure}!`;
      notifications.push(...cureNotifications);
    } else {
      message = `Não havia status ${statusToCure} para curar.`;
    }
  } else {
    message = 'Item usado.';
  }

  return { message, notifications };
};

@Injectable()
export class UseItemAction implements IBattleAction<BattleActionType.USE_ITEM> {
  readonly priority = 9;

  constructor(
    private readonly itemsService: ItemsService,
    private readonly statusEffectsService: StatusEffectsService // 7. Injetar
  ) {}

  async execute(
    context: BattleActionContext<BattleActionType.USE_ITEM>
  ): Promise<BattleActionResult> {
    const { battleState, playerId, payload } = context;
    const { itemId, targetCoffeemonIndex } = payload;

    const player = battleState.player1Id === playerId ? battleState.player1 : battleState.player2;

    if (!player.inventory[itemId] || player.inventory[itemId] <= 0) {
      return {
        advanceTurn: false,
        notifications: [
          {
            eventKey: 'ACTION_ERROR',
            payload: { playerId, error: `Item ${itemId} não encontrado.` },
          },
        ],
      };
    }

    const itemDefinition = await this.itemsService.findOne(itemId);
    if (!itemDefinition) {
      throw new NotFoundException(`Definição do item ${itemId} não encontrada.`);
    }

    player.inventory[itemId]--;

    const targetIndex = targetCoffeemonIndex ?? player.activeCoffeemonIndex;
    if (targetIndex === null) {
      return {
        advanceTurn: false,
        notifications: [
          { eventKey: 'ACTION_ERROR', payload: { playerId, error: 'Alvo inválido.' } },
        ],
      };
    }
    const targetMon = player.coffeemons[targetIndex];

    const { notifications } = applyItemEffect(itemDefinition, targetMon, this.statusEffectsService);

    return {
      advanceTurn: true,
      notifications: notifications,
    };
  }
}
