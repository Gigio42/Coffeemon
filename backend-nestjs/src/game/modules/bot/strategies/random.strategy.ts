import { Injectable } from '@nestjs/common';
import { BattleActionType, BattleActionUnion, BattleState } from '../../battles/types/batlle.types';
import { IBotStrategy } from './bot-strategy.interface';

@Injectable()
export class RandomStrategy implements IBotStrategy {
  chooseAction(battleState: BattleState, botPlayerId: number): BattleActionUnion {
    const botPlayer =
      botPlayerId === battleState.player1Id ? battleState.player1 : battleState.player2;
    const activeCoffeemon = botPlayer.coffeemons[botPlayer.activeCoffeemonIndex];

    const possibleActions: BattleActionUnion[] = [];

    if (activeCoffeemon.canAct) {
      activeCoffeemon.moves.forEach((move) => {
        possibleActions.push({
          battleId: '',
          actionType: BattleActionType.ATTACK,
          payload: { moveId: move.id },
        });
      });
    }

    botPlayer.coffeemons.forEach((coffeemon, index) => {
      if (index !== botPlayer.activeCoffeemonIndex && !coffeemon.isFainted) {
        possibleActions.push({
          battleId: '',
          actionType: BattleActionType.SWITCH,
          payload: { newIndex: index },
        });
      }
    });

    if (activeCoffeemon.isFainted) {
      const switchActions = possibleActions.filter((a) => a.actionType === BattleActionType.SWITCH);
      const randomIndex = Math.floor(Math.random() * switchActions.length);
      return switchActions[randomIndex];
    }

    // Action aleatória
    const randomIndex = Math.floor(Math.random() * possibleActions.length);
    return possibleActions[randomIndex];
  }
}
