import { CoffeemonType } from '../../coffeemon/entities/coffeemon.entity';
import { Move } from '../../moves/entities/move.entity';
import { PlayerInventory } from '../../player/entities/player.entity';
import { BattleActionUnion } from './battle-actions.types';
import { BattleEvent } from './battle-events.types';
import { BattleStatus, TurnPhase } from './enums';

export interface StatusEffect {
  type: string;
  chance: number;
  duration?: number;
  value?: number;
  target: 'self' | 'enemy' | 'ally';
}

export interface CoffeemonState {
  id: number;
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
  isFainted: boolean;
  canAct: boolean;
  types: CoffeemonType[];
  attack: number;
  defense: number;
  speed: number;
  modifiers: {
    attackModifier: number;
    defenseModifier: number;
    dodgeChance: number;
    hitChance: number;
    critChance: number;
    blockChance: number;
  };
  statusEffects: StatusEffect[];
  moves: Move[];
}

export interface PlayerBattleState {
  activeCoffeemonIndex: number | null;
  coffeemons: CoffeemonState[];
  hasSelectedCoffeemon: boolean;
  inventory: PlayerInventory;
  hasUsedItem: boolean;
}

export interface BattleState {
  player1Id: number;
  player2Id: number;
  player1SocketId: string;
  player2SocketId: string;
  player1: PlayerBattleState;
  player2: PlayerBattleState;
  turn: number;
  battleStatus: BattleStatus;
  winnerId?: number;
  events: BattleEvent[];
  isBotBattle?: boolean;
  botStrategy?: string;
  turnPhase: TurnPhase;
  pendingActions: {
    [playerId: number]: BattleActionUnion | null;
  };
}
