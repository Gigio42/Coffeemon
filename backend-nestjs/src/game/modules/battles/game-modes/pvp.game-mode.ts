import { Injectable } from '@nestjs/common';
import { BattleActionCommand } from '../../../shared/events/game.events';
import { BattleService } from '../services/battles.service';
import { BattleActionUnion } from '../types/battle-actions.types';
import { IGameMode } from './game-mode.interface';
@Injectable()
export class PvpGameMode implements IGameMode {
  private battleService: BattleService;

  public setBattleService(service: BattleService): void {
    this.battleService = service;
  }

  async handlePlayerAction(command: BattleActionCommand): Promise<void> {
    await this.battleService.submitAction(
      command.action.battleId,
      command.playerId,
      command.action
    );
  }
}
