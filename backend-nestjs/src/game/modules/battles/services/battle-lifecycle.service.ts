import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BattleCacheService } from '../../../shared/cache/services/battle-cache.service';
import { RoomCacheService } from '../../../shared/cache/services/room-cache.service';
import {
  BattleCancelledEvent,
  OpponentDisconnectedEvent,
  PlayerDisconnectedCommand,
  PlayerLeftBattleEvent,
  PlayerReconnectedEvent,
  PlayerWantsToLeaveBattleCommand,
  PlayerWantsToRejoinBattleCommand,
} from '../../../shared/events/game.events';

@Injectable()
export class BattleLifecycleService {
  private disconnectionTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly roomCache: RoomCacheService,
    private readonly battleCache: BattleCacheService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent('player.rejoin.command')
  async handlePlayerRejoin(command: PlayerWantsToRejoinBattleCommand): Promise<void> {
    const battleRoomId = `battle:${command.battleId}`;
    await this.roomCache.joinRoom(battleRoomId, command.playerId, command.socketId, 'battle');
    const battleState = await this.battleCache.get(command.battleId);

    if (battleState) {
      if (battleState.player1Id === command.playerId)
        battleState.player1SocketId = command.socketId;
      if (battleState.player2Id === command.playerId)
        battleState.player2SocketId = command.socketId;
      await this.battleCache.set(command.battleId, battleState);

      const timeoutKey = `${command.battleId}:${command.playerId}`;
      if (this.disconnectionTimeouts.has(timeoutKey)) {
        clearTimeout(this.disconnectionTimeouts.get(timeoutKey));
        this.disconnectionTimeouts.delete(timeoutKey);
      }

      this.eventEmitter.emit(
        'player.reconnected',
        new PlayerReconnectedEvent(command.battleId, command.playerId, battleState)
      );
    }
  }

  @OnEvent('player.leave.command')
  async handlePlayerLeave(command: PlayerWantsToLeaveBattleCommand): Promise<void> {
    const battleRoomId = `battle:${command.battleId}`;
    await this.roomCache.leaveRoom(battleRoomId, command.playerId);
    this.eventEmitter.emit(
      'player.left.battle',
      new PlayerLeftBattleEvent(command.battleId, command.playerId, command.socketId)
    );
  }

  @OnEvent('player.disconnected.command')
  async handlePlayerDisconnect(command: PlayerDisconnectedCommand): Promise<void> {
    const roomId = await this.roomCache.findRoomBySocket(command.socketId);
    if (roomId?.startsWith('battle:')) {
      const battleId = roomId.split(':')[1];
      await this.roomCache.markPlayerDisconnected(command.socketId);
      this.eventEmitter.emit(
        'opponent.disconnected',
        new OpponentDisconnectedEvent(battleId, command.playerId)
      );
      this.scheduleDisconnectionTimeout(battleId, command.playerId);
    }
  }

  private scheduleDisconnectionTimeout(battleId: string, playerId: number): void {
    const timeoutKey = `${battleId}:${playerId}`;
    const timeout = setTimeout(() => {
      this.handleDisconnectionTimeout(battleId, playerId);
    }, 30000); // 30 seconds
    this.disconnectionTimeouts.set(timeoutKey, timeout);
  }

  private async handleDisconnectionTimeout(battleId: string, playerId: number): Promise<void> {
    this.disconnectionTimeouts.delete(`${battleId}:${playerId}`);

    const roomData = await this.roomCache.getRoomData(`battle:${battleId}`);
    const member = roomData?.members.find((m) => m.playerId === playerId);

    if (member?.status === 'disconnected') {
      this.eventEmitter.emit('battle.cancelled', new BattleCancelledEvent(battleId, playerId));

      // limpa sala e cache
      if (roomData) {
        for (const m of roomData.members) {
          await this.roomCache.leaveRoom(roomData.roomId, m.playerId);
        }
      }
      await this.battleCache.delete(battleId);
    }
  }
}
