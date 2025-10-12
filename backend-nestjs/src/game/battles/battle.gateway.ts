import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithUser } from 'src/auth/types/auth.types';
import { WsGameAuthGuard } from '../auth/guards/ws-game-auth-guard';
import { RoomCacheService } from '../cache/room-cache.service';
import { WsPlayerGuard } from '../player/auth/ws-player.guard';
import { BattleService } from './battles.service';
import { BattleActionUnion, BattleStatus } from './types/batlle.types';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
@UseGuards(WsGameAuthGuard, WsPlayerGuard)
export class BattleGateway implements OnGatewayDisconnect {
  //TODO usar OnGatewayConnection
  @WebSocketServer() server: Server;

  constructor(
    private battleService: BattleService,
    private roomCache: RoomCacheService
  ) {}

  @SubscribeMessage('joinBattle')
  async handleJoinBattle(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { battleId: string }
  ) {
    try {
      const playerId = socket.data.playerId;
      if (!playerId) {
        socket.emit('battleError', { message: 'Player ID not found on socket.' });
        return;
      }

      const battleRoom = `battle:${data.battleId}`;

      console.log(`Player ${playerId} (socket: ${socket.id}) joining battle ${data.battleId}`);

      await socket.join(battleRoom);
      await this.roomCache.joinRoom(battleRoom, playerId, socket.id, 'battle');
      await this.battleService.updatePlayerSocketId(data.battleId, playerId, socket.id);

      const battleState = await this.battleService.getBattleState(data.battleId);
      if (battleState) {
        socket.emit('battleUpdate', { battleState });
      }

      socket.to(battleRoom).emit('playerReconnected', {
        playerId,
        message: 'Opponent reconnected to the battle.',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error when joining the battle';
      socket.emit('battleError', { message });
    }
  }

  @SubscribeMessage('battleAction')
  async battleAction(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() { battleId, actionType, payload }: BattleActionUnion
  ) {
    try {
      const playerId = socket.data.playerId;
      const battleRoom = `battle:${battleId}`;

      if (!playerId) {
        socket.emit('battleError', { message: 'Player ID not found on socket.' });
        return;
      }

      await this.battleService.updatePlayerSocketId(battleId, playerId, socket.id);

      const { battleState } = await this.battleService.executeTurn(
        battleId,
        playerId,
        actionType,
        payload
      );

      this.server.to(battleRoom).emit('battleUpdate', { battleState });

      if (battleState.battleStatus === BattleStatus.FINISHED) {
        this.server.to(battleRoom).emit('battleEnd', {
          winnerId: battleState.winnerId,
          battleState,
        });
        setTimeout(() => {
          this.cleanupBattleRoom(battleRoom);
        }, 5000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error in battle action';
      socket.emit('battleError', { message });
    }
  }

  @SubscribeMessage('leaveBattle')
  async handleLeaveBattle(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { battleId: string }
  ) {
    try {
      const playerId = socket.data.playerId;
      if (!playerId) {
        socket.emit('battleError', { message: 'Player ID not found on socket.' });
        return;
      }

      const battleRoom = `battle:${data.battleId}`;

      await socket.leave(battleRoom);
      await this.roomCache.leaveRoom(battleRoom, playerId);

      socket.to(battleRoom).emit('opponentLeft', {
        playerId,
        message: 'Your opponent left the battle.',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error when leaving the battle';
      socket.emit('battleError', { message });
    }
  }

  async handleDisconnect(socket: SocketWithUser) {
    try {
      const roomId = await this.roomCache.findRoomBySocket(socket.id);

      if (roomId && roomId.startsWith('battle:')) {
        const disconnectionInfo = await this.roomCache.markPlayerDisconnected(socket.id);

        if (disconnectionInfo) {
          socket.to(roomId).emit('opponentDisconnected', {
            playerId: disconnectionInfo.playerId,
            temporary: true,
            message: 'Opponent disconnected. Waiting for reconnection...',
          });
          this.scheduleDisconnectionTimeout(roomId, disconnectionInfo.playerId);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error processing battle disconnection:', error.message);
      } else {
        console.error('Unknown error processing battle disconnection:', error);
      }
    }
  }

  private scheduleDisconnectionTimeout(roomId: string, playerId: number): void {
    setTimeout(() => {
      this.handleDisconnectionTimeout(roomId, playerId);
    }, 30000);
  }

  private async handleDisconnectionTimeout(roomId: string, playerId: number): Promise<void> {
    try {
      const roomData = await this.roomCache.getRoomData(roomId);
      if (roomData) {
        const member = roomData.members.find((m) => m.playerId === playerId);
        if (member && member.status === 'disconnected') {
          this.server.to(roomId).emit('battleCancelled', {
            reason: 'disconnection',
            disconnectedPlayerId: playerId,
            message: 'Battle cancelled due to prolonged disconnection.',
          });

          for (const m of roomData.members) {
            await this.roomCache.leaveRoom(roomId, m.playerId);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in disconnection timeout:', error.message);
      } else {
        console.error('Unknown error in disconnection timeout:', error);
      }
    }
  }

  private async cleanupBattleRoom(battleRoom: string): Promise<void> {
    try {
      const roomData = await this.roomCache.getRoomData(battleRoom);
      if (roomData) {
        for (const member of roomData.members) {
          const memberSocket = this.server.sockets.sockets.get(member.socketId);
          if (memberSocket) {
            await memberSocket.leave(battleRoom);
          }
          await this.roomCache.leaveRoom(battleRoom, member.playerId);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error cleaning up battle room:', error.message);
      } else {
        console.error('Unknown error cleaning up battle room:', error);
      }
    }
  }
}
