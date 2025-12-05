import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { BattleEvent } from '../types/battle-events.types';
import { BattleState } from '../types/battle-state.types';
import { ClientBattleState, PlayerInfo } from '../types/client-battle-state.dto';

@Injectable()
export class BattleViewService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  public async buildPlayerView(fullState: BattleState, viewingPlayerId: number): Promise<ClientBattleState> {
    const clientEvents = fullState.events.filter(
      (event: BattleEvent) => !event.targetPlayerId || event.targetPlayerId === viewingPlayerId
    );

    const pendingActionStatus = {
      [fullState.player1Id]: fullState.pendingActions[fullState.player1Id] !== null,
      [fullState.player2Id]: fullState.pendingActions[fullState.player2Id] !== null,
    };

    // Buscar informações dos jogadores
    let player1Info: PlayerInfo | undefined;
    let player2Info: PlayerInfo | undefined;

    try {
      const player1 = await this.playerRepository.findOne({
        where: { id: fullState.player1Id },
        relations: ['user'],
      });
      const player2 = await this.playerRepository.findOne({
        where: { id: fullState.player2Id },
        relations: ['user'],
      });

      if (player1?.user) {
        player1Info = {
          id: player1.id,
          username: player1.user.username,
        };
      }

      if (player2?.user) {
        player2Info = {
          id: player2.id,
          username: player2.user.username,
        };
      }
    } catch (error) {
      console.error('[BattleViewService] Error fetching player info:', error);
    }

    const clientState: ClientBattleState = {
      player1Id: fullState.player1Id,
      player2Id: fullState.player2Id,
      player1: fullState.player1,
      player2: fullState.player2,
      player1Info,
      player2Info,
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
