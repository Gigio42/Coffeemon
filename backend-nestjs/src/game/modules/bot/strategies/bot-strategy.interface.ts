import { BattleActionUnion, BattleState } from '../../battles/types/batlle.types';

export interface IBotStrategy {
  chooseAction(battleState: BattleState, botPlayerId: number): BattleActionUnion;
}
