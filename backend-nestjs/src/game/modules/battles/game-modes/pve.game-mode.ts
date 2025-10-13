import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BattleActionCommand, ExecuteBotTurnCommand } from '../../../shared/events/game.events';
import { BattleService } from '../battles.service';
import { BattleStatus } from '../types/batlle.types';
import { IGameMode } from './game-mode.interface';

@Injectable()
export class PveGameMode implements IGameMode {
  private battleService: BattleService;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public setBattleService(service: BattleService): void {
    this.battleService = service;
  }

  async handlePlayerAction(command: BattleActionCommand): Promise<void> {
    const updatedState = await this.battleService.executeTurn(
      command.battleId,
      command.playerId,
      command.actionType,
      command.payload as any
    );

    if (!updatedState) return;

    this.battleService.emitStateUpdate(command.battleId, updatedState);

    if (updatedState.battleStatus !== BattleStatus.FINISHED && updatedState.currentPlayerId < 0) {
      this.eventEmitter.emit('bot.turn.command', new ExecuteBotTurnCommand(command.battleId));
    }
  }
}
