import { Injectable } from '@nestjs/common';
import { BattleEvent } from '../types/battle-events.types';
import { BattleState } from '../types/battle-state.types';
import { ClientBattleState } from '../types/client-battle-state.dto';

@Injectable()
export class BattleViewService {
  public buildPlayerView(fullState: BattleState, viewingPlayerId: number): ClientBattleState {
    const clientEvents = fullState.events.filter(
      (event: BattleEvent) => !event.targetPlayerId || event.targetPlayerId === viewingPlayerId
    );

    const pendingActionStatus = {
      [fullState.player1Id]: fullState.pendingActions[fullState.player1Id] !== null,
      [fullState.player2Id]: fullState.pendingActions[fullState.player2Id] !== null,
    };

    const clientState: ClientBattleState = {
      player1Id: fullState.player1Id,
      player2Id: fullState.player2Id,
      player1: fullState.player1,
      player2: fullState.player2,
      turn: fullState.turn,
      battleStatus: fullState.battleStatus,
      winnerId: fullState.winnerId,
      events: clientEvents,
      isBotBattle: fullState.isBotBattle,
      turnPhase: fullState.turnPhase,
      pendingActionStatus: pendingActionStatus,
    };

    return clientState;
  }
}
