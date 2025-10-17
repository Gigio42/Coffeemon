/**
 * ========================================
 * TIPOS TYPESCRIPT - ALINHADOS COM BACKEND
 * ========================================
 * 
 * Tipos completos baseados na estrutura do backend NestJS
 * Atualizado após pull da main (Bot removido, NotificationsGateway adicionado)
 */

// ========================================
// ENUMS
// ========================================

export enum Screen {
  LOGIN = 'LOGIN',
  ECOMMERCE = 'ECOMMERCE',
  MATCHMAKING = 'MATCHMAKING',
  BATTLE = 'BATTLE',
}

export enum BattleStatus {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export enum BattleActionType {
  ATTACK = 'attack',
  SWITCH = 'switch',
}

export enum CoffeemonType {
  FRUITY = 'fruity',
  ROASTED = 'roasted',
  SPICY = 'spicy',
  SOUR = 'sour',
  NUTTY = 'nutty',
  FLORAL = 'floral',
  SWEET = 'sweet',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// ========================================
// INTERFACES - AUTENTICAÇÃO
// ========================================

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
}

export interface AuthData {
  token: string;
  userId: number;
  playerId: number;
}

// ========================================
// INTERFACES - JOGO (COFFEEMON)
// ========================================

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
  type: string;
  description: string;
  effects?: StatusEffect[];
}

export interface Coffeemon {
  id: number;
  name: string;
  type: CoffeemonType;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  imageUrl: string;
  moves: Move[];
}

export interface Player {
  id: number;
  coins: number;
  level: number;
  experience: number;
  coffeemons: PlayerCoffeemons[];
}

export interface PlayerCoffeemons {
  id: number;
  hp: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  isInParty: boolean;
  coffeemon: Coffeemon;
}

// ========================================
// INTERFACES - BATALHA
// ========================================

export interface CoffeemonModifiers {
  attackModifier: number;
  defenseModifier: number;
  dodgeChance: number;
  hitChance: number;
  critChance: number;
  blockChance: number;
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
  modifiers: CoffeemonModifiers;
  statusEffects?: StatusEffect[];
  moves: Move[];
}

export interface PlayerBattleState {
  activeCoffeemonIndex: number;
  coffeemons: CoffeemonState[];
}

export interface BattleEvent {
  type: string;
  payload: any;
  message?: string;
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
  events: BattleEvent[];
}

// ========================================
// INTERFACES - AÇÕES DE BATALHA
// ========================================

export interface AttackPayload {
  moveId: number;
}

export interface SwitchPayload {
  newIndex: number;
}

export interface BattleAction {
  battleId: string;
  actionType: BattleActionType;
  payload: AttackPayload | SwitchPayload;
}

// ========================================
// INTERFACES - E-COMMERCE
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

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  unit_price: number;
  total: number;
  product: Product;
}

export interface Order {
  id: number;
  total_amount: number;
  total_quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  updated_at: string;
  orderItem: OrderItem[];
}

// ========================================
// INTERFACES - WEBSOCKET EVENTS
// ========================================

export interface MatchFoundEvent {
  battleId: string;
}

export interface BattleUpdateEvent {
  battleState: BattleState;
}

export interface BattleEndEvent {
  winnerId: number;
  battleState: BattleState;
}

export interface PlayerReconnectedEvent {
  playerId: number;
  message: string;
}

export interface OpponentDisconnectedEvent {
  playerId: number;
  temporary: boolean;
  message: string;
}

export interface BattleCancelledEvent {
  reason: string;
  disconnectedPlayerId: number;
  message: string;
}

export interface MatchStatusEvent {
  status: 'waiting' | 'matched';
}

// ========================================
// TYPES UTILITÁRIOS
// ========================================

export type NavigationCallback = () => void;

export type BattleNavigationCallback = (
  battleId: string,
  battleState: BattleState,
  socket: any
) => void;
