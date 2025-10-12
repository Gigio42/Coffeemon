import { Injectable } from '@nestjs/common';
import { BattleService } from '../battles/battles.service';
import { RoomCacheService } from '../cache/room-cache.service';
@Injectable()
export class MatchmakingService {
  constructor(
    private battleService: BattleService,
    private roomCache: RoomCacheService
  ) {}

  async findMatch(
    playerId: number,
    socketId: string
  ): Promise<{
    status: 'waiting' | 'matched';
    battleId?: string;
    opponentSocketId?: string;
  }> {
    const matchmakingRoom = 'matchmaking:default';

    const opponent = await this.roomCache.findOpponentInRoom(matchmakingRoom, playerId);
    if (!opponent) {
      return { status: 'waiting' };
    }

    await this.roomCache.makeMatch(matchmakingRoom, playerId, opponent.playerId);

    const battle = await this.battleService.createBattle(
      playerId,
      opponent.playerId,
      socketId,
      opponent.socketId
    );

    return {
      status: 'matched',
      battleId: battle.savedBattle.id,
      opponentSocketId: opponent.socketId,
    };
  }

  async leaveQueue(playerId: number): Promise<{ success: boolean; reason?: string }> {
    const roomId = await this.roomCache.findRoomByPlayer(playerId);

    if (!roomId) {
      return { success: false, reason: 'You are not in any queue.' };
    }
    if (!roomId.startsWith('matchmaking:')) {
      return { success: false, reason: 'Cannot leave queue while in battle.' };
    }

    await this.roomCache.leaveRoom(roomId, playerId);
    return { success: true };
  }

  async getQueueStats(): Promise<{ count: number; avgWaitTime: number }> {
    return this.roomCache.getQueueStats('matchmaking:default');
  }

  async handleDisconnection(playerId: number): Promise<void> {
    const roomId = await this.roomCache.findRoomByPlayer(playerId);

    if (roomId && roomId.startsWith('matchmaking:')) {
      await this.roomCache.leaveRoom(roomId, playerId);
    }
  }
}
