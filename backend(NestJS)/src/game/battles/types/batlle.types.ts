export enum BattleStatus {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export interface Move {
  id: number;
  name: string;
  power: number;
  type: string;
  description: string;
}

export interface CoffeemonState {
  id: number;
  name: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  moves: Move[];
}
