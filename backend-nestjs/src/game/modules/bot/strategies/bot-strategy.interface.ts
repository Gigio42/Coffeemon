import { BattleActionUnion } from '../../battles/types/battle-actions.types';
import { BattleState } from '../../battles/types/battle-state.types';

export interface IBotStrategy {
  chooseAction(battleState: BattleState, botPlayerId: number): BattleActionUnion;
  chooseInitialCoffeemon(battleState: BattleState, botPlayerId: number): BattleActionUnion;
}
