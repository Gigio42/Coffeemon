import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketWithUser } from '../auth/types/auth.types';
import { PlayerOfflineEvent, PlayerOnlineEvent } from './shared/events/game.events';
import { WsPlayerGuard } from './modules/player/auth/ws-player.guard';
import { WsGameAuthGuard } from './shared/auth/guards/ws-game-auth-guard';
import { SocketManagerService } from './shared/socket-manager/socket-manager.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketManager: SocketManagerService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('registerSession')
  handleRegisterSession(@ConnectedSocket() socket: SocketWithUser) {
    const playerId = socket.data.playerId;

    if (playerId) {
      this.socketManager.register(playerId, socket);
      socket.emit('sessionRegistered', { status: 'ok', playerId });
      this.eventEmitter.emit('player.online', new PlayerOnlineEvent(playerId));
    } else {
      socket.emit('sessionRegistered', { status: 'error', message: 'Player not found.' });
    }
  }

  handleConnection(socket: SocketWithUser) {
    console.log(`[GameGateway] Socket ${socket.id} conectou.`);
  }

  handleDisconnect(socket: SocketWithUser) {
    const playerId = this.socketManager.getPlayerId(socket.id);
    this.socketManager.unregister(socket);
    if (playerId) {
      this.eventEmitter.emit('player.offline', new PlayerOfflineEvent(playerId));
    }
  }
}
