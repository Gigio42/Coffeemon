import { Injectable } from '@nestjs/common';
import { ExtractPayload } from '../../types/battle-actions.types';
import { BattleState } from '../../types/battle-state.types';
import { BattleActionType } from '../../types/enums';
import { StatusEffectsService } from '../effects/status-effects.service';
import { EventManager } from '../events/event-manager';
import { BattleActionFactory } from './battle-action-factory';
import { ActionEventNotification } from './battle-action-interface';

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
    try {
      const action = this.battleActionFactory.getAction(actionType);
      const result = await action.execute({ battleState, playerId, payload });

      result.notifications.forEach((notification) => {
        this.addEvent(battleState, notification);
      });

      return battleState;
    } catch (error) {
      console.error(
        `[ActionExecutor] Error executing ${actionType} for player ${playerId}:`,
        error
      );
      this.addEvent(battleState, {
        eventKey: 'ACTION_ERROR',
        payload: {
          playerId,
          error: `Failed to execute action: ${error.message || 'Unknown error'}`,
        },
      });
      return battleState;
    }
  }

  private addEvent(battleState: BattleState, notification: ActionEventNotification) {
    const event = this.eventManager.createEvent(notification);
    battleState.events.push(event);
  }
}
