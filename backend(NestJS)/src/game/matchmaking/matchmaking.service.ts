import { Injectable } from '@nestjs/common';
import { BattleService } from '../battles/battles.service';
import { DisconnectResult, EnqueueResult } from './types/matchmaking.types';
import { QueueCacheService } from '../cache/queue-cache.service';

@Injectable()
export class MatchmakingService {
  constructor(
    private battleService: BattleService,
    private queueCache: QueueCacheService
  ) {}

  // Matchmaking aleatório
  async enqueue(userId: number, socketId: string): Promise<EnqueueResult> {
    const opponent = this.queueCache.findOpponent(userId);
    if (!opponent) {
      this.queueCache.addToQueue(userId, socketId);
      return { status: 'waiting' };
    }
    this.queueCache.removeFromQueue(socketId);
    this.queueCache.removeFromQueue(opponent.socketId);
    const battle = await this.battleService.createBattle(
      userId,
      opponent.userId,
      socketId,
      opponent.socketId
    );

    return {
      status: 'matched',
      battleId: battle.savedBattle.id,
      battleState: battle.state,
    };
  }

  async handleDisconnect(socketId: string): Promise<DisconnectResult> {
    const player = this.queueCache.findBySocketId(socketId);
    if (!player) {
      this.queueCache.removeFromQueue(socketId);
    }
    const battle = await this.battleService.findActiveBattleBySocketId?.(socketId);
    if (battle) {
      // TODO: Cancelar batalha
      const opponentSocketId =
        battle.player1SocketId === socketId ? battle.player2SocketId : battle.player1SocketId;
      return { opponentSocketId };
    }
    return undefined;
  }

  // TODO Desafio direto
  // challenge(userId: number, socketId: string, targetUserId: number) {
  //   this.challenges.set(targetUserId, { fromUserId: userId, fromSocketId: socketId });
  //   return { status: 'challenge_sent', targetUserId };
  // }

  // TODO Aceitar desafio
  // async acceptChallenge(userId: number, socketId: string) {
  //   const challenge = this.challenges.get(userId);
  //   if (!challenge) {
  //     return { status: 'no_challenge' };
  //   }
  //   this.challenges.delete(userId);
  //   return this.battleService.createBattle(
  //     userId,
  //     challenge.fromUserId,
  //     socketId,
  //     challenge.fromSocketId
  //   );
  // }
}
