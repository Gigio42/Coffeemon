import { Injectable } from '@nestjs/common';
import { BattleState, PlayerBattleState } from '../../types/battle-state.types';
import {
  AttackPayload,
  BattleActionUnion,
  SelectCoffeemonPayload,
  SwitchPayload,
} from '../../types/battle-actions.types';
import { BattleActionType, TurnPhase } from '../../types/enums';
import { BattleEventKey } from '../events/battle-event.registry';
import { StatusEffectCategory } from '../effects/status-effect.interface';
import { StatusEffectsService } from '../effects/status-effects.service';
import { statusEffectRegistry } from '../effects/status-effect.registry';

export interface ValidationResult {
  isValid: boolean;
  errorKey?: BattleEventKey;
  errorPayload?: any;
}

@Injectable()
export class BattleValidatorService {
  constructor(private readonly statusEffectsService: StatusEffectsService) {}

  public validate(
    state: BattleState,
    playerId: number,
    action: BattleActionUnion
  ): ValidationResult {
    const player = state.player1Id === playerId ? state.player1 : state.player2;

    const phaseResult = this.validatePhase(state, player, playerId, action);
    if (phaseResult) return phaseResult;

    if (action.actionType !== BattleActionType.SELECT_COFFEEMON) {
      const actorResult = this.validateActorState(player, playerId, action);
      if (actorResult) return actorResult;
    }

    const payloadResult = this.validatePayload(player, playerId, action);
    if (payloadResult) return payloadResult;

    return { isValid: true };
  }

  private validatePhase(
    state: BattleState,
    player: PlayerBattleState,
    playerId: number,
    action: BattleActionUnion
  ): ValidationResult | null {
    const { turnPhase, pendingActions } = state;

    if (turnPhase === TurnPhase.SELECTION) {
      if (action.actionType !== BattleActionType.SELECT_COFFEEMON) {
        return this.fail('ACTION_ERROR', {
          playerId,
          error: 'You must select your starting Coffeemon.',
        });
      }
      if (player.hasSelectedCoffeemon) {
        return this.fail('ACTION_ERROR', {
          playerId,
          error: 'You have already selected your Coffeemon.',
        });
      }
    } else if (turnPhase === TurnPhase.SUBMISSION) {
      if (action.actionType === BattleActionType.SELECT_COFFEEMON) {
        return this.fail('ACTION_ERROR', {
          playerId,
          error: 'Cannot select Coffeemon outside of selection phase.',
        });
      }
      if (pendingActions[playerId]) {
        return this.fail('ACTION_ERROR', {
          playerId,
          error: 'Action already submitted for this turn.',
        });
      }
    } else {
      return this.fail('ACTION_ERROR', {
        playerId,
        error: 'Not in action submission phase.',
      });
    }

    return null;
  }

  private validateActorState(
    player: PlayerBattleState,
    playerId: number,
    action: BattleActionUnion
  ): ValidationResult | null {
    if (player.activeCoffeemonIndex === null) {
      return this.fail('ACTION_ERROR', {
        playerId,
        error: 'You do not have an active Coffeemon.',
      });
    }

    const activeMon = player.coffeemons[player.activeCoffeemonIndex];

    if (activeMon.isFainted) {
      if (action.actionType !== BattleActionType.SWITCH) {
        return this.fail('KNOCKOUT_BLOCK', {
          playerId,
          coffeemonName: activeMon.name,
        });
      }
    }

    if (action.actionType !== BattleActionType.SWITCH) {
      const isBlocked = this.statusEffectsService.hasEffectInCategory(
        activeMon,
        StatusEffectCategory.BLOCKING
      );

      if (isBlocked) {
        const blockingEffect = activeMon.statusEffects.find((e) =>
          statusEffectRegistry[e.type]?.categories.includes(StatusEffectCategory.BLOCKING)
        );
        return this.fail('STATUS_BLOCK', {
          playerId,
          coffeemonName: activeMon.name,
          effectType: blockingEffect?.type || 'status',
        });
      }
    }

    return null;
  }

  private validatePayload(
    player: PlayerBattleState,
    playerId: number,
    action: BattleActionUnion
  ): ValidationResult | null {
    switch (action.actionType) {
      case BattleActionType.SELECT_COFFEEMON:
        return this.validateSelectCoffeemonPayload(player, action.payload, playerId);
      case BattleActionType.SWITCH:
        return this.validateSwitchPayload(player, action.payload, playerId);
      case BattleActionType.ATTACK:
        return this.validateAttackPayload(player, action.payload, playerId);
    }
    return null;
  }

  private validateSelectCoffeemonPayload(
    player: PlayerBattleState,
    payload: SelectCoffeemonPayload,
    playerId: number
  ): ValidationResult | null {
    const { coffeemonIndex } = payload;
    if (
      coffeemonIndex < 0 ||
      coffeemonIndex >= player.coffeemons.length ||
      player.coffeemons[coffeemonIndex].isFainted
    ) {
      return this.fail('ACTION_ERROR', {
        playerId,
        error: 'Invalid Coffeemon selection.',
      });
    }
    return null;
  }

  private validateSwitchPayload(
    player: PlayerBattleState,
    payload: SwitchPayload,
    playerId: number
  ): ValidationResult | null {
    const { newIndex } = payload;

    if (newIndex < 0 || newIndex >= player.coffeemons.length) {
      return this.fail('SWITCH_FAILED_INVALID_INDEX', { playerId });
    }
    if (newIndex === player.activeCoffeemonIndex) {
      return this.fail('SWITCH_FAILED_SAME_COFFEEMON', { playerId });
    }
    const targetCoffeemon = player.coffeemons[newIndex];
    if (targetCoffeemon.isFainted) {
      return this.fail('SWITCH_FAILED_FAINTED_COFFEEMON', { playerId });
    }
    return null;
  }

  private validateAttackPayload(
    player: PlayerBattleState,
    payload: AttackPayload,
    playerId: number
  ): ValidationResult | null {
    const activeMon = player.coffeemons[player.activeCoffeemonIndex!];
    const { moveId } = payload;

    const move = activeMon.moves.find((m) => m.id === moveId);
    if (!move) {
      return this.fail('ACTION_ERROR', {
        playerId,
        error: 'Invalid Move ID or Coffeemon does not know this move.',
      });
    }

    return null;
  }

  private fail(errorKey: BattleEventKey, errorPayload: any): ValidationResult {
    return { isValid: false, errorKey, errorPayload };
  }
}
