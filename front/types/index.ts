export enum Screen {
  LOGIN = 'LOGIN',
  MATCHMAKING = 'MATCHMAKING',
  BATTLE = 'BATTLE'
}

export enum BattleStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export interface Move {
  id: number;
  name: string;
  power: number;
}

export interface Coffeemon {
  name: string;
  currentHp: number;
  maxHp: number;
  isFainted: boolean;
  canAct: boolean;
  moves: Move[];
}

export interface PlayerState {
  coffeemons: Coffeemon[];
  activeCoffeemonIndex: number;
}

export interface BattleState {
  turn: number;
  player1Id: number;
  player2Id: number;
  player1: PlayerState;
  player2: PlayerState;
  currentPlayerId: number;
  battleStatus: BattleStatus;
  winnerId: number | null;
  events?: any[];
}
