import { Injectable } from '@nestjs/common';
import { BattleActionCommand } from '../../../shared/events/game.events';
import { BattleService } from '../battles.service';
import { ExtractPayload } from '../types/batlle.types';
import { IGameMode } from './game-mode.interface';

@Injectable()
export class PvpGameMode implements IGameMode {
  private battleService: BattleService;

  constructor() {}

  public setBattleService(service: BattleService): void {
    this.battleService = service;
  }

  async handlePlayerAction(command: BattleActionCommand): Promise<void> {
    const updatedState = await this.battleService.executeTurn(
      command.battleId,
      command.playerId,
      command.actionType,
      command.payload as ExtractPayload<typeof command.actionType>
    );

    if (updatedState) {
      this.battleService.emitStateUpdate(command.battleId, updatedState);
    }
  }
}
