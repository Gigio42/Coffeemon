import { Injectable } from '@nestjs/common';
import { BattleActionType } from '../../types/enums';
import { BattleActionContext, BattleActionResult, IBattleAction } from './battle-action-interface';

@Injectable()
export class SelectCoffeemonAction implements IBattleAction<BattleActionType.SELECT_COFFEEMON> {
  readonly priority = 100;

  async execute(
    context: BattleActionContext<BattleActionType.SELECT_COFFEEMON>
  ): Promise<BattleActionResult> {
    const { battleState, playerId, payload } = context;
    const player = battleState.player1Id === playerId ? battleState.player1 : battleState.player2;

    const { coffeemonIndex } = payload;
    player.activeCoffeemonIndex = coffeemonIndex;
    player.hasSelectedCoffeemon = true;

    return {
      advanceTurn: true,
      notifications: [
        {
          eventKey: 'SWITCH_SUCCESS',
          payload: {
            playerId,
            newActiveCoffeemonName: player.coffeemons[coffeemonIndex].name,
          },
        },
      ],
    };
  }
}
