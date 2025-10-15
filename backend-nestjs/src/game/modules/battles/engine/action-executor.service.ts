import { Injectable } from '@nestjs/common';
import { ExtractPayload } from '../types/battle-actions.types';
import { BattleState, CoffeemonState } from '../types/battle-state.types';
import { BattleActionType } from '../types/enums';
import { BattleActionFactory } from './actions/battle-action-factory';
import { ActionEventNotification } from './actions/battle-action-interface';
import { StatusEffectCategory } from './effects/status-effect.interface';
import { StatusEffectsService } from './effects/status-effects.service';
import { EventManager } from './events/event-manager';

@Injectable()
export class ActionExecutorService {
  constructor(
    private readonly battleActionFactory: BattleActionFactory,
    private readonly eventManager: EventManager,
    private readonly statusEffectsService: StatusEffectsService
  ) {}

  public async execute(
    battleState: BattleState,
    playerId: number,
    actionType: BattleActionType,
    payload: ExtractPayload<any>
  ): Promise<BattleState> {
    const player = battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
    const activeCoffeemon = player.coffeemons[player.activeCoffeemonIndex];

    if (activeCoffeemon.isFainted) {
      if (actionType !== BattleActionType.SWITCH) {
        this.addEvent(battleState, {
          eventKey: 'KNOCKOUT_BLOCK',
          payload: { playerId, coffeemonName: activeCoffeemon.name },
        });
        return battleState;
      }
    } else if (!this.canAct(activeCoffeemon)) {
      this.addEvent(battleState, {
        eventKey: 'STATUS_BLOCK',
        payload: {
          playerId,
          coffeemonName: activeCoffeemon.name,
          effectType: 'a status condition',
        },
      });
      return battleState;
    }

    const action = this.battleActionFactory.getAction(actionType);
    const result = await action.execute({ battleState, playerId, payload });

    result.notifications.forEach((notification) => {
      this.addEvent(battleState, notification);
    });

    return battleState;
  }

  private addEvent(battleState: BattleState, notification: ActionEventNotification) {
    const event = this.eventManager.createEvent(notification);
    battleState.events.push(event);
  }

  private canAct(coffeemon: CoffeemonState): boolean {
    return (
      coffeemon.canAct &&
      !this.statusEffectsService.hasEffectInCategory(coffeemon, StatusEffectCategory.BLOCKING)
    );
  }
}
