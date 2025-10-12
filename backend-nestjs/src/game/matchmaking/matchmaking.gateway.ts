import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
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
import { MatchmakingService } from './matchmaking.service';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsGameAuthGuard, WsPlayerGuard)
export class MatchmakingGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private matchmakingService: MatchmakingService,
    private roomCache: RoomCacheService
  ) {}

  @SubscribeMessage('findMatch')
  async findMatch(@ConnectedSocket() socket: SocketWithUser) {
    try {
      const playerId = socket.data.playerId;
      if (!playerId) {
        socket.emit('battleError', { message: 'Player ID not found on socket.' });
        return;
      }

      const matchmakingRoom = 'matchmaking:default'; //TODO different waiting rooms later

      await socket.join(matchmakingRoom);
      await this.roomCache.joinRoom(matchmakingRoom, playerId, socket.id, 'matchmaking');

      const result = await this.matchmakingService.findMatch(playerId, socket.id);

      if (result.status === 'waiting') {
        socket.to(matchmakingRoom).emit('playerJoinedQueue', { playerId });
        socket.emit('matchStatus', { status: 'waiting' });
        this.broadcastQueueStats();
      } else {
        const battleRoom = `battle:${result.battleId}`;

        await socket.leave(matchmakingRoom);
        await socket.join(battleRoom);
        await this.roomCache.joinRoom(battleRoom, playerId, socket.id, 'battle');

        const opponentSocket = this.server.sockets.sockets.get(result.opponentSocketId!);
        if (opponentSocket) {
          await opponentSocket.leave(matchmakingRoom);
          await opponentSocket.join(battleRoom);
        }

        this.server.to(battleRoom).emit('matchFound', {
          battleId: result.battleId,
        });

        this.broadcastQueueStats();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      socket.emit('battleError', { message });
    }
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(@ConnectedSocket() socket: SocketWithUser) {
    try {
      const playerId = socket.data.playerId;
      if (!playerId) {
        socket.emit('queueError', { message: 'Player ID not found on socket.' });
        return;
      }

      const result = await this.matchmakingService.leaveQueue(playerId);

      if (result.success) {
        await socket.leave('matchmaking:default');
        socket.to('matchmaking:default').emit('playerLeftQueue', { playerId });
        socket.emit('queueLeft', { success: true });
        this.broadcastQueueStats();
      } else {
        socket.emit('queueError', { message: result.reason });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      socket.emit('queueError', { message });
    }
  }

  @SubscribeMessage('getQueueStats')
  async getQueueStats(@ConnectedSocket() socket: SocketWithUser) {
    try {
      const playerId = socket.data.playerId;
      if (!playerId) {
        socket.emit('queueError', { message: 'Player ID not found on socket.' });
        return;
      }

      const stats = await this.matchmakingService.getQueueStats();
      socket.emit('queueStats', stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      socket.emit('queueError', { message });
    }
  }

  async handleDisconnect(socket: SocketWithUser) {
    try {
      const playerId = socket.data.playerId;
      if (!playerId) return;

      console.log(`Player ${playerId} disconnected from matchmaking.`);

      await this.matchmakingService.handleDisconnection(playerId);
      this.broadcastQueueStats();
    } catch (error) {
      console.error('Error processing disconnection:', error);
    }
  }

  private broadcastQueueStats(): void {
    this.matchmakingService
      .getQueueStats()
      .then((stats) => {
        this.server.to('matchmaking:default').emit('queueStats', stats);
      })
      .catch((error) => {
        console.error('Error broadcasting stats:', error);
      });
  }
}
