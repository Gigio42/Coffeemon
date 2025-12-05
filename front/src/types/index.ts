export enum Screen {
  LOGIN = 'LOGIN',
  ECOMMERCE = 'ECOMMERCE',
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

export interface StatusEffect {
  type: string;
  chance?: number;
  duration?: number;
  value?: number;
  target?: 'self' | 'enemy' | 'ally';
}

export interface CoffeemonModifiers {
  attackModifier: number;
  defenseModifier: number;
  dodgeChance: number;
  hitChance: number;
  critChance: number;
  blockChance: number;
}

export interface Coffeemon {
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
  isFainted: boolean;
  canAct: boolean;
  moves: Move[];
  statusEffects?: StatusEffect[];
  types?: string[];
  // Stats base
  attack?: number;
  defense?: number;
  speed?: number;
  // Modifiers
  modifiers?: CoffeemonModifiers;
}

export interface PlayerState {
  coffeemons: Coffeemon[];
  activeCoffeemonIndex: number;
  hasSelectedCoffeemon?: boolean;
  inventory?: Record<string, number>;
}

export interface PlayerInfo {
  id: number;
  username: string;
  avatar?: string;
}

export interface BattleState {
  turn: number;
  player1Id: number;
  player2Id: number;
  player1: PlayerState;
  player2: PlayerState;
  player1Info?: PlayerInfo;
  player2Info?: PlayerInfo;
  currentPlayerId: number;
  battleStatus: BattleStatus;
  winnerId: number | null;
  events?: any[];
  turnPhase?: string;
  pendingActions?: { [playerId: number]: any };
}

export type BattlePhase = 'SELECTION' | 'SUBMISSION' | 'RESOLUTION' | 'awaiting_action';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: number;
  total_amount: number;
  total_quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  updated_at: string;
  orderItem: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  unit_price: number;
  total: number;
  product: Product;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Player {
  id: number;
  coins: number;
  level: number;
  experience: number;
  inventory: Record<string, number>;
  user?: {
    username: string;
    avatar?: string;
  };
}
