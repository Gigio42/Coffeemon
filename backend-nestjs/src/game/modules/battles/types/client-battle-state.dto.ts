import { BattleEvent } from './battle-events.types';
import { CoffeemonState, PlayerBattleState } from './battle-state.types';
import { BattleStatus, TurnPhase } from './enums';

export type ClientCoffeemonState = CoffeemonState;
export type ClientPlayerBattleState = PlayerBattleState;

export interface PlayerInfo {
  id: number;
  username: string;
  avatar?: string;
}

export interface ClientBattleState {
  player1Id: number;
  player2Id: number;
  player1: ClientPlayerBattleState;
  player2: ClientPlayerBattleState;
  player1Info?: PlayerInfo;
  player2Info?: PlayerInfo;
  turn: number;
  battleStatus: BattleStatus;
  winnerId?: number;
  events: BattleEvent[];
  isBotBattle?: boolean;
  turnPhase: TurnPhase;
  pendingActionStatus: {
    [playerId: number]: boolean;
  };
}
