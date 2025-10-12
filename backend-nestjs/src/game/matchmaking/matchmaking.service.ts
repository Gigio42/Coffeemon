import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RoomCacheService } from '../cache/room-cache.service';
import {
  MatchPairFoundEvent,
  PlayerDisconnectedCommand,
  PlayerJoinedQueueEvent,
  PlayerLeftQueueEvent,
  PlayerWantsToJoinQueueCommand,
  PlayerWantsToLeaveQueueCommand,
} from '../events/game.events';

@Injectable()
export class MatchmakingService {
  constructor(
    private readonly roomCache: RoomCacheService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent('queue.join.command')
  async handlePlayerJoinQueue(command: PlayerWantsToJoinQueueCommand): Promise<void> {
    const matchmakingRoom = 'matchmaking:default';
    await this.roomCache.joinRoom(
      matchmakingRoom,
      command.playerId,
      command.socketId,
      'matchmaking'
    );
    this.eventEmitter.emit(
      'queue.player.joined',
      new PlayerJoinedQueueEvent(command.playerId, command.socketId)
    );

    const opponent = await this.roomCache.findOpponentInRoom(matchmakingRoom, command.playerId);
    if (!opponent) return;

    await this.roomCache.makeMatch(matchmakingRoom, command.playerId, opponent.playerId);

    this.eventEmitter.emit(
      'match.pair.found',
      new MatchPairFoundEvent(
        command.playerId,
        command.socketId,
        opponent.playerId,
        opponent.socketId
      )
    );
  }

  @OnEvent('queue.leave.command')
  async handlePlayerLeaveQueue(command: PlayerWantsToLeaveQueueCommand): Promise<void> {
    const roomId = await this.roomCache.findRoomByPlayer(command.playerId);
    if (roomId && roomId.startsWith('matchmaking:')) {
      await this.roomCache.leaveRoom(roomId, command.playerId);
      this.eventEmitter.emit(
        'queue.player.left',
        new PlayerLeftQueueEvent(command.playerId, command.socketId)
      );
    }
  }

  @OnEvent('player.disconnected.command')
  async handlePlayerDisconnect(command: PlayerDisconnectedCommand): Promise<void> {
    const roomId = await this.roomCache.findRoomBySocket(command.socketId);
    if (roomId && roomId.startsWith('matchmaking:')) {
      await this.roomCache.leaveRoom(roomId, command.playerId);
      this.eventEmitter.emit(
        'queue.player.left',
        new PlayerLeftQueueEvent(command.playerId, command.socketId)
      );
    }
  }
}
