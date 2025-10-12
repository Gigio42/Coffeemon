import { moveType } from 'src/game/modules/coffeemon/Types/coffeemon.types';

// Enums
export enum BattleActionType {
  ATTACK = 'attack',
  SWITCH = 'switch',
}

export enum BattleStatus {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export enum BlockingStatusEffect {
  SLEEP = 'sleep',
  FROZEN = 'frozen',
}

// Interfaces de entidades
export interface StatusEffect {
  type: string;
  chance: number;
  duration?: number;
  value?: number;
  target: 'self' | 'enemy' | 'ally';
}

export interface Move {
  id: number;
  name: string;
  power: number;
  type: moveType;
  description: string;
  effects?: StatusEffect[];
}

export interface CoffeemonState {
  id: number;
  name: string;
  currentHp: number;
  maxHp: number;
  isFainted: boolean;
  canAct: boolean;
  attack: number;
  defense: number;
  modifiers: {
    attackModifier: number;
    defenseModifier: number;
    dodgeChance: number;
    hitChance: number;
    critChance: number;
    blockChance: number;
  };
  statusEffects?: StatusEffect[];
  moves: Move[];
}

export interface PlayerBattleState {
  activeCoffeemonIndex: number;
  coffeemons: CoffeemonState[];
}

export interface BattleState {
  player1Id: number;
  player2Id: number;
  player1SocketId: string;
  player2SocketId: string;
  player1: PlayerBattleState;
  player2: PlayerBattleState;
  turn: number;
  currentPlayerId: number;
  battleStatus: BattleStatus;
  winnerId?: number;
  events: BattleEvent[]; // <-- Guarda eventos da batalha (p/mandar pro front em seq)
}

export interface BattleEvent {
  type: string;
  payload: any;
  message?: string;
}

// Payloads de ações
export interface AttackPayload {
  moveId: number;
}
export interface SwitchPayload {
  newIndex: number;
}
export interface ItemPayload {
  itemId: number;
  targetIndex?: number;
}

// Mapeamento de payloads por ação
type PayloadMap = {
  [BattleActionType.ATTACK]: AttackPayload;
  [BattleActionType.SWITCH]: SwitchPayload;
};

// Tipos utilitários para ações
export type BattleActionUnion = {
  [K in keyof PayloadMap]: {
    battleId: string;
    actionType: K;
    payload: PayloadMap[K];
  };
}[keyof PayloadMap];

export type ExtractPayload<T extends BattleActionType> = Extract<
  BattleActionUnion,
  { actionType: T }
>['payload'];
