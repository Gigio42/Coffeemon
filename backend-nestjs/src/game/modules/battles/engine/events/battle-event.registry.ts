import { BattleEvent } from '../../types/battle-events.types';

type KnockoutBlockPayload = { playerId: number; coffeemonName: string };
type StatusBlockPayload = { playerId: number; coffeemonName: string; effectType: string };
type ActionErrorPayload = { playerId: number; error: string };
type SwitchSuccessPayload = { playerId: number; newActiveCoffeemonName: string };
type SwitchFailedPayload = { playerId: number };
type AttackHitPayload = { attackerName: string; targetName: string; damage: number };
type AttackCritPayload = { attackerName: string };
type AttackBlockedPayload = { targetName: string };
type BattleFinishedPayload = { winnerId: number };
type TurnEndPayload = { turn: number };
type StatusAppliedPayload = { targetName: string; effectType: string };
type StatusDamagePayload = { coffeemonName: string; damage: number; effectType: string };
type StatusRemovedPayload = { coffeemonName: string; effectType: string };

export const BattleEventRegistry = {
  // --- Eventos de Turno ---
  BATTLE_FINISHED: (payload: BattleFinishedPayload): BattleEvent => ({
    type: 'BATTLE_FINISHED',
    payload,
  }),
  TURN_END: (payload: TurnEndPayload): BattleEvent => ({
    type: 'TURN_END',
    payload,
  }),

  // --- Eventos de Bloqueio de Ação ---
  KNOCKOUT_BLOCK: (payload: KnockoutBlockPayload): BattleEvent => ({
    type: 'KNOCKOUT_BLOCK',
    payload,
  }),
  STATUS_BLOCK: (payload: StatusBlockPayload): BattleEvent => ({
    type: 'STATUS_BLOCK',
    payload,
  }),
  ACTION_ERROR: (payload: ActionErrorPayload): BattleEvent => ({
    type: 'ACTION_ERROR',
    payload,
  }),

  // --- Eventos de Troca (Switch) ---
  SWITCH_SUCCESS: (payload: SwitchSuccessPayload): BattleEvent => ({
    type: 'SWITCH_SUCCESS',
    payload,
  }),
  SWITCH_FAILED_SAME_COFFEEMON: (payload: SwitchFailedPayload): BattleEvent => ({
    type: 'SWITCH_FAILED_SAME_COFFEEMON',
    payload,
  }),
  SWITCH_FAILED_FAINTED_COFFEEMON: (payload: SwitchFailedPayload): BattleEvent => ({
    type: 'SWITCH_FAILED_FAINTED_COFFEEMON',
    payload,
  }),
  SWITCH_FAILED_INVALID_INDEX: (payload: SwitchFailedPayload): BattleEvent => ({
    type: 'SWITCH_FAILED_INVALID_INDEX',
    payload,
  }),

  // --- Eventos de Ataque ---
  ATTACK_HIT: (payload: AttackHitPayload): BattleEvent => ({
    type: 'ATTACK_HIT',
    payload,
  }),
  ATTACK_MISS: (payload: { attackerName: string; targetName: string }): BattleEvent => ({
    type: 'ATTACK_MISS',
    payload,
  }),
  ATTACK_CRIT: (payload: AttackCritPayload): BattleEvent => ({
    type: 'ATTACK_CRIT',
    payload,
  }),
  ATTACK_BLOCKED: (payload: AttackBlockedPayload): BattleEvent => ({
    type: 'ATTACK_BLOCKED',
    payload,
  }),
  COFFEEMON_FAINTED: (payload: KnockoutBlockPayload): BattleEvent => ({
    type: 'COFFEEMON_FAINTED',
    payload,
  }),

  // --- Eventos de Efeito de Status ---
  STATUS_APPLIED: (payload: StatusAppliedPayload): BattleEvent => ({
    type: 'STATUS_APPLIED',
    payload,
  }),
  STATUS_DAMAGE: (payload: StatusDamagePayload): BattleEvent => ({
    type: 'STATUS_DAMAGE',
    payload,
  }),
  STATUS_REMOVED: (payload: StatusRemovedPayload): BattleEvent => ({
    type: 'STATUS_REMOVED',
    payload,
  }),
};

export type BattleEventKey = keyof typeof BattleEventRegistry;
