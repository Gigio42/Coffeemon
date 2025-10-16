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
  hasSelectedCoffeemon?: boolean;  // Novo campo para fase de seleção
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
  turnPhase?: string;  // Novo campo: 'SELECTION' | 'SUBMISSION' | 'RESOLUTION'
  pendingActions?: { [playerId: number]: any };  // Novo campo: ações pendentes
}

// ========================================
// TIPOS DO E-COMMERCE
// ========================================

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
