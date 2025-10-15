import { Injectable } from '@nestjs/common';
import { BattleActionType } from '../../types/enums';
import { BattleActionContext, BattleActionResult, IBattleAction } from './battle-action-interface';

@Injectable()
export class SwitchAction implements IBattleAction<BattleActionType.SWITCH> {
  readonly priority = 10;

  async execute(
    context: BattleActionContext<BattleActionType.SWITCH>
  ): Promise<BattleActionResult> {
    const { battleState, playerId, payload } = context;
    const isPlayer1 = battleState.player1Id === playerId;
    const activePlayer = isPlayer1 ? battleState.player1 : battleState.player2;
    const newIndex = payload.newIndex;

    if (newIndex < 0 || newIndex >= activePlayer.coffeemons.length) {
      return {
        advanceTurn: false,
        notifications: [{ eventKey: 'SWITCH_FAILED_INVALID_INDEX', payload: { playerId } }],
      };
    }

    if (newIndex === activePlayer.activeCoffeemonIndex) {
      return {
        advanceTurn: false,
        notifications: [{ eventKey: 'SWITCH_FAILED_SAME_COFFEEMON', payload: { playerId } }],
      };
    }

    const targetCoffeemon = activePlayer.coffeemons[newIndex];
    if (targetCoffeemon.isFainted) {
      return {
        advanceTurn: false,
        notifications: [{ eventKey: 'SWITCH_FAILED_FAINTED_COFFEEMON', payload: { playerId } }],
      };
    }

    activePlayer.activeCoffeemonIndex = newIndex;
    const newActiveCoffeemon = activePlayer.coffeemons[activePlayer.activeCoffeemonIndex];

    return Promise.resolve({
      advanceTurn: true,
      notifications: [
        {
          eventKey: 'SWITCH_SUCCESS',
          payload: { playerId, newActiveCoffeemonName: newActiveCoffeemon.name },
        },
      ],
    });
  }
}
