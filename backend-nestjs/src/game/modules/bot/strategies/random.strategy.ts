import { Injectable } from '@nestjs/common';
import { BattleActionUnion } from '../../battles/types/battle-actions.types';
import { BattleState } from '../../battles/types/battle-state.types';
import { BattleActionType } from '../../battles/types/enums';
import { IBotStrategy } from './bot-strategy.interface';

@Injectable()
export class RandomStrategy implements IBotStrategy {
  chooseInitialCoffeemon(battleState: BattleState, botPlayerId: number): BattleActionUnion {
    const botPlayer =
      botPlayerId === battleState.player1Id ? battleState.player1 : battleState.player2;
    const availableCoffeemons = botPlayer.coffeemons
      .map((c, i) => ({ ...c, originalIndex: i }))
      .filter((c) => !c.isFainted);

    const randomIndex = Math.floor(Math.random() * availableCoffeemons.length);
    const selectedIndex = availableCoffeemons[randomIndex].originalIndex;

    return {
      battleId: '',
      actionType: BattleActionType.SELECT_COFFEEMON,
      payload: { coffeemonIndex: selectedIndex },
    };
  }

  chooseAction(battleState: BattleState, botPlayerId: number): BattleActionUnion {
    const botPlayer =
      botPlayerId === battleState.player1Id ? battleState.player1 : battleState.player2;
    const activeCoffeemon = botPlayer.coffeemons[botPlayer.activeCoffeemonIndex!];

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
      if (switchActions.length > 0) {
        const randomIndex = Math.floor(Math.random() * switchActions.length);
        return switchActions[randomIndex];
      }
      return possibleActions[0];
    }

    // Ação aleatória
    const randomIndex = Math.floor(Math.random() * possibleActions.length);
    return possibleActions[randomIndex];
  }
}
