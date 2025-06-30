import { Injectable } from '@nestjs/common';
import {
  BattleActionType,
  BattleState,
  BattleStatus,
  CoffeemonState,
  ExtractPayload,
} from '../types/batlle.types';
import { BattleActionFactory } from './actions/battle-action-factory';
import { ActionEventNotification } from './actions/battle-action-interface';
import { StatusEffectCategory } from './effects/status-effect.interface';
import { StatusEffectsService } from './effects/status-effects.service';
import { EventManager } from './events/event-manager';

@Injectable()
export class BattleTurnManager {
  constructor(
    private readonly battleActionFactory: BattleActionFactory,
    private readonly eventManager: EventManager,
    private readonly statusEffectsService: StatusEffectsService
  ) {}

  async runTurn<T extends BattleActionType>({
    battleState,
    playerId,
    actionType,
    payload,
  }: {
    battleState: BattleState;
    playerId: number;
    actionType: T;
    payload: ExtractPayload<T>;
  }): Promise<BattleState> {
    battleState.events = [];

    // Verifica se é a vez do jogador
    if (playerId !== battleState.currentPlayerId) {
      this.addEvent(battleState, {
        eventKey: 'NOT_YOUR_TURN',
        payload: { playerId },
      });
      return battleState;
    }

    const player = this.getPlayer(battleState, playerId);
    const activeCoffeemon = player.coffeemons[player.activeCoffeemonIndex];

    this.updateCoffeemonStateForTurn(activeCoffeemon);

    // Verifica se o Cofeemon foi de base
    if (activeCoffeemon.isFainted) {
      if (actionType !== BattleActionType.SWITCH) {
        this.addEvent(battleState, {
          eventKey: 'KNOCKOUT_BLOCK',
          payload: { playerId, coffeemonName: activeCoffeemon.name },
        });
        return battleState;
      }
    }
    // Verifica se o Cofeemon ativo está bloqueado por algum efeito
    else if (!activeCoffeemon.canAct) {
      this.addEvent(battleState, {
        eventKey: 'STATUS_BLOCK',
        payload: {
          playerId,
          coffeemonName: activeCoffeemon.name,
          effectType: 'blocked', // TODO Mudar para o tipo de efeito real
        },
      });
      this.advanceTurn(battleState);
      return battleState;
    }

    // Realiza ação do jogador
    const actionResult = await this.handleAction(battleState, playerId, actionType, payload);

    if (actionResult.advanceTurn) {
      this.processEndOfTurn(battleState);
      this.advanceTurn(battleState);
    }

    // Verifica se a batalha terminou
    this.checkEndBattleCondition(battleState);

    this.addEvent(battleState, { eventKey: 'TURN_END', payload: { turn: battleState.turn } });
    return battleState;
  }

  private getPlayer(battleState: BattleState, playerId: number) {
    return battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
  }

  private updateCoffeemonStateForTurn(coffeemon: CoffeemonState) {
    coffeemon.isFainted = coffeemon.currentHp <= 0;
    coffeemon.canAct = !coffeemon.isFainted;

    if (this.statusEffectsService.hasEffectInCategory(coffeemon, StatusEffectCategory.BLOCKING)) {
      coffeemon.canAct = false;
    }
  }

  private async handleAction<T extends BattleActionType>(
    battleState: BattleState,
    playerId: number,
    actionType: T,
    payload: ExtractPayload<T>
  ): Promise<{
    advanceTurn: boolean;
    notifications: ActionEventNotification[];
  }> {
    const action = this.battleActionFactory.getAction(actionType);
    const result = await action.execute({ battleState, playerId, payload });
    result.notifications.forEach((notification) => {
      this.addEvent(battleState, notification);
    });
    return result;
  }

  private addEvent(battleState: BattleState, notification: ActionEventNotification) {
    const event = this.eventManager.createEvent(notification);
    battleState.events.push(event);
  }

  private advanceTurn(battleState: BattleState) {
    battleState.turn++;
    battleState.currentPlayerId =
      battleState.currentPlayerId === battleState.player1Id
        ? battleState.player2Id
        : battleState.player1Id;
  }

  private processEndOfTurn(battleState: BattleState) {
    const allCoffeemons = [...battleState.player1.coffeemons, ...battleState.player2.coffeemons];

    for (const coffeemon of allCoffeemons) {
      if (!coffeemon.isFainted) {
        const notifications = this.statusEffectsService.processTurnEffects(coffeemon);
        notifications.forEach((notification) => this.addEvent(battleState, notification));
      }
    }
  }

  private checkEndBattleCondition(battleState: BattleState) {
    const winnerId = this.getWinnerId(battleState);
    if (winnerId) {
      battleState.battleStatus = BattleStatus.FINISHED;
      battleState.winnerId = winnerId;
      this.addEvent(battleState, { eventKey: 'BATTLE_FINISHED', payload: { winnerId } });
    }
  }

  private getWinnerId(battleState: BattleState): number | null {
    const p1AllFainted = battleState.player1.coffeemons.every((c) => c.isFainted);
    const p2AllFainted = battleState.player2.coffeemons.every((c) => c.isFainted);

    if (p1AllFainted) return battleState.player2Id;
    if (p2AllFainted) return battleState.player1Id;
    return null;
  }
}
