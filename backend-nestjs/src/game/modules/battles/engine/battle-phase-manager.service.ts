import { Injectable } from '@nestjs/common';
import { BattleActionUnion } from '../types/battle-actions.types';
import { BattleState } from '../types/battle-state.types';
import { BattleActionType, BattleStatus, TurnPhase } from '../types/enums';
import { ActionExecutorService } from './actions/action-executor.service';
import { BattleActionFactory } from './actions/battle-action-factory';
import { StatusEffectsService } from './effects/status-effects.service';
import { EventManager } from './events/event-manager';
import { BattleValidatorService } from './validation/battle-validator.service';

interface ActionInQueue {
  playerId: number;
  action: BattleActionUnion;
  priority: number;
  speed: number;
}

@Injectable()
export class BattlePhaseManager {
  constructor(
    private readonly actionExecutor: ActionExecutorService,
    private readonly statusEffectsService: StatusEffectsService,
    private readonly eventManager: EventManager,
    private readonly actionFactory: BattleActionFactory,
    private readonly actionValidator: BattleValidatorService
  ) {}

  public async submitAction(
    battleState: BattleState,
    playerId: number,
    action: BattleActionUnion
  ): Promise<BattleState> {
    battleState.events = [];

    const validationResult = await this.actionValidator.validate(battleState, playerId, action);

    if (!validationResult.isValid) {
      const payload = validationResult.errorPayload || {};
      payload.playerId = playerId;

      battleState.events.push(
        this.eventManager.createEvent({
          eventKey: validationResult.errorKey || 'ACTION_ERROR',
          payload: payload,
        })
      );
      return battleState;
    }

    // SELECTION
    if (battleState.turnPhase === TurnPhase.SELECTION) {
      return this.handleSelectionPhase(battleState, playerId, action);
    }

    // RESOLUTION
    battleState.pendingActions[playerId] = action;
    const allActionsSubmitted = Object.values(battleState.pendingActions).every(
      (act) => act !== null
    );

    if (allActionsSubmitted) {
      console.log('[BattlePhaseManager] All actions submitted, resolving turn.');
      return this.resolveTurn(battleState);
    }

    return battleState;
  }

  private async handleSelectionPhase(
    battleState: BattleState,
    playerId: number,
    action: BattleActionUnion
  ): Promise<BattleState> {
    const updatedState = await this.actionExecutor.execute(
      battleState,
      playerId,
      action.actionType,
      action.payload
    );

    if (updatedState.player1.hasSelectedCoffeemon && updatedState.player2.hasSelectedCoffeemon) {
      updatedState.turnPhase = TurnPhase.SUBMISSION;
      updatedState.events.push(
        this.eventManager.createEvent({
          eventKey: 'TURN_END',
          payload: { turn: updatedState.turn },
        })
      );
    }

    return updatedState;
  }

  private async resolveTurn(battleState: BattleState): Promise<BattleState> {
    battleState.turnPhase = TurnPhase.RESOLUTION;
    const actionQueue = this.determineActionOrder(battleState);

    let currentState = battleState;
    for (const item of actionQueue) {
      if (currentState.battleStatus === BattleStatus.FINISHED) break;

      const actorPlayer =
        item.playerId === currentState.player1Id ? currentState.player1 : currentState.player2;
      if (actorPlayer.activeCoffeemonIndex === null) {
        continue;
      }
      const activeMon = actorPlayer.coffeemons[actorPlayer.activeCoffeemonIndex];
      if (activeMon.isFainted && item.action.actionType !== BattleActionType.SWITCH) {
        continue;
      }

      currentState = await this.actionExecutor.execute(
        currentState,
        item.playerId,
        item.action.actionType,
        item.action.payload
      );
    }

    return this.processEndOfTurn(currentState);
  }

  private determineActionOrder(state: BattleState): ActionInQueue[] {
    const { player1Id, player2Id, player1, player2, pendingActions } = state;
    const p1Action = pendingActions[player1Id]!;
    const p2Action = pendingActions[player2Id]!;

    const p1Coffeemon = player1.coffeemons[player1.activeCoffeemonIndex!];
    const p2Coffeemon = player2.coffeemons[player2.activeCoffeemonIndex!];

    const queue: ActionInQueue[] = [
      {
        playerId: player1Id,
        action: p1Action,
        priority: this.actionFactory.getAction(p1Action.actionType).priority,
        speed: p1Coffeemon.speed,
      },
      {
        playerId: player2Id,
        action: p2Action,
        priority: this.actionFactory.getAction(p2Action.actionType).priority,
        speed: p2Coffeemon.speed,
      },
    ];

    return queue.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      if (a.speed !== b.speed) return b.speed - a.speed;
      return Math.random() - 0.5;
    });
  }

  private processEndOfTurn(state: BattleState): BattleState {
    if (state.battleStatus === BattleStatus.FINISHED) {
      return state;
    }

    state.turnPhase = TurnPhase.END_OF_TURN;
    const allCoffeemons = [...state.player1.coffeemons, ...state.player2.coffeemons];

    for (const coffeemon of allCoffeemons) {
      if (!coffeemon.isFainted) {
        const notifications = this.statusEffectsService.processTurnEffects(coffeemon);
        notifications.forEach((n) => state.events.push(this.eventManager.createEvent(n)));
      }
    }

    for (const coffeemon of allCoffeemons) {
      if (coffeemon.currentHp < 0) {
        coffeemon.currentHp = 0;
      }

      if (!coffeemon.isFainted && coffeemon.currentHp <= 0) {
        coffeemon.isFainted = true;
        coffeemon.canAct = false;
        state.events.push(
          this.eventManager.createEvent({
            eventKey: 'COFFEEMON_FAINTED',
            payload: {
              playerId: null,
              coffeemonName: coffeemon.name,
            },
          })
        );
      }
    }

    this.checkEndBattleCondition(state);

    if (state.battleStatus === BattleStatus.ACTIVE) {
      state.turnPhase = TurnPhase.SUBMISSION;
      state.pendingActions = {
        [state.player1Id]: null,
        [state.player2Id]: null,
      };
      state.turn++;
      state.events.push(
        this.eventManager.createEvent({
          eventKey: 'TURN_END',
          payload: { turn: state.turn },
        })
      );
    }

    return state;
  }

  private checkEndBattleCondition(state: BattleState) {
    const p1AllFainted = state.player1.coffeemons.every((c) => c.isFainted);
    const p2AllFainted = state.player2.coffeemons.every((c) => c.isFainted);

    if (p1AllFainted || p2AllFainted) {
      const winnerId = p1AllFainted ? state.player2Id : state.player1Id;
      state.battleStatus = BattleStatus.FINISHED;
      state.winnerId = winnerId;
      state.events.push(
        this.eventManager.createEvent({
          eventKey: 'BATTLE_FINISHED',
          payload: { winnerId },
        })
      );
    }
  }
}
