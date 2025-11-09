import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BattleActionCommand, ExecuteBotTurnCommand } from '../../../shared/events/game.events';
import { BattleService } from '../services/battles.service';
import { BattleActionUnion } from '../types/battle-actions.types';
import { IGameMode } from './game-mode.interface';
@Injectable()
export class PveGameMode implements IGameMode {
  private battleService: BattleService;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  public setBattleService(service: BattleService): void {
    this.battleService = service;
  }

  async handlePlayerAction(command: BattleActionCommand): Promise<void> {
    await this.battleService.submitAction(command.battleId, command.playerId, {
      battleId: command.battleId,
      actionType: command.actionType,
      payload: command.payload,
    } as BattleActionUnion);

    this.eventEmitter.emit('execute.bot.turn', new ExecuteBotTurnCommand(command.battleId));
  }
}
