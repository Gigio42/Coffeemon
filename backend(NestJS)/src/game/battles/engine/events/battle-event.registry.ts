import { BattleEvent } from '../../types/batlle.types';

type KnockoutBlockPayload = { playerId: number; coffeemonName: string };
type StatusBlockPayload = { playerId: number; coffeemonName: string; effectType: string };
type ActionErrorPayload = { playerId: number; error: string };
type SwitchSuccessPayload = { playerId: number; newActiveCoffeemonName: string };
type SwitchFailedPayload = { playerId: number };
type AttackHitPayload = {
  playerId: number;
  attackerName: string;
  targetName: string;
  damage: number;
};
type AttackCritPayload = { attackerName: string };
type AttackBlockedPayload = { targetName: string };
type TurnAdvancedPayload = { currentPlayerId: number; turn: number };
type BattleFinishedPayload = { winnerId: number };
type TurnEndPayload = { turn: number };
type StatusAppliedPayload = { targetName: string; effectType: string };
type StatusDamagePayload = { coffeemonName: string; damage: number; effectType: string };
type StatusRemovedPayload = { coffeemonName: string; effectType: string };

export const BattleEventRegistry = {
  // --- Turn Events ---
  NOT_YOUR_TURN: (payload: { playerId: number }): BattleEvent => ({
    type: 'not-your-turn',
    payload,
    message: `It's not your turn, player ${payload.playerId}.`,
  }),
  TURN_ADVANCED: (payload: TurnAdvancedPayload): BattleEvent => ({
    type: 'turn-advanced',
    payload,
    message: `Turn ${payload.turn}. It's player ${payload.currentPlayerId}'s turn.`,
  }),
  BATTLE_FINISHED: (payload: BattleFinishedPayload): BattleEvent => ({
    type: 'battle-finished',
    payload,
    message: `The battle is over! The winner is player ${payload.winnerId}!`,
  }),
  TURN_END: (payload: TurnEndPayload): BattleEvent => ({
    type: 'turn-end',
    payload,
    message: `End of turn ${payload.turn}.`,
  }),

  // --- Action Block Events ---
  KNOCKOUT_BLOCK: (payload: KnockoutBlockPayload): BattleEvent => ({
    type: 'knockout-block',
    payload,
    message: `${payload.coffeemonName} is knocked out! You need to switch.`,
  }),
  STATUS_BLOCK: (payload: StatusBlockPayload): BattleEvent => ({
    type: 'status-block',
    payload,
    message: `${payload.coffeemonName} is under the effect of ${payload.effectType} and can't act!`,
  }),
  ACTION_ERROR: (payload: ActionErrorPayload): BattleEvent => ({
    type: 'action-error',
    payload,
    message: `An error occurred: ${payload.error}`,
  }),

  // --- Switch Events ---
  SWITCH_SUCCESS: (payload: SwitchSuccessPayload): BattleEvent => ({
    type: 'SwitchSuccess',
    payload,
    message: `${payload.newActiveCoffeemonName} enters the field!`,
  }),
  SWITCH_FAILED_SAME_COFFEEMON: (payload: SwitchFailedPayload): BattleEvent => ({
    type: 'SwitchFailed',
    payload,
    message: 'This Coffeemon is already on the field.',
  }),
  SWITCH_FAILED_FAINTED_COFFEEMON: (payload: SwitchFailedPayload): BattleEvent => ({
    type: 'SwitchFailed',
    payload,
    message: 'Cannot switch to a knocked out Coffeemon.',
  }),
  SWITCH_FAILED_INVALID_INDEX: (payload: SwitchFailedPayload): BattleEvent => ({
    type: 'SwitchFailed',
    payload,
    message: 'Invalid switch action.',
  }),

  // --- Attack Events ---
  ATTACK_HIT: (payload: AttackHitPayload): BattleEvent => ({
    type: 'AttackHit',
    payload,
    message: `${payload.attackerName} attacks ${payload.targetName} and deals ${payload.damage} damage!`,
  }),
  ATTACK_MISS: (payload: { attackerName: string; targetName: string }): BattleEvent => ({
    type: 'AttackMiss',
    payload,
    message: `${payload.attackerName} attacked ${payload.targetName}, but missed!`,
  }),
  ATTACK_CRIT: (payload: AttackCritPayload): BattleEvent => ({
    type: 'AttackCrit',
    payload,
    message: `A critical hit! ${payload.attackerName}'s attack is super effective!`,
  }),
  ATTACK_BLOCKED: (payload: AttackBlockedPayload): BattleEvent => ({
    type: 'AttackBlocked',
    payload,
    message: `${payload.targetName} blocked part of the damage!`,
  }),
  COFFEEMON_FAINTED: (payload: KnockoutBlockPayload): BattleEvent => ({
    type: 'CoffeemonFainted',
    payload,
    message: `${payload.coffeemonName} has fainted!`,
  }),

  // --- Status Effect Events ---
  STATUS_APPLIED: (payload: StatusAppliedPayload): BattleEvent => ({
    type: 'status-applied',
    payload,
    message: `${payload.targetName} is now affected by ${payload.effectType}!`,
  }),
  STATUS_DAMAGE: (payload: StatusDamagePayload): BattleEvent => ({
    type: 'status-damage',
    payload,
    message: `${payload.coffeemonName} takes ${payload.damage} damage from ${payload.effectType}!`,
  }),
  STATUS_REMOVED: (payload: StatusRemovedPayload): BattleEvent => ({
    type: 'status-removed',
    payload,
    message: `${payload.coffeemonName} is no longer affected by ${payload.effectType}.`,
  }),
};

export type BattleEventKey = keyof typeof BattleEventRegistry;
