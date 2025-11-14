import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketWithUser } from '../auth/types/auth.types';
import { WsPlayerGuard } from './modules/player/auth/ws-player.guard';
import { WsGameAuthGuard } from './shared/auth/guards/ws-game-auth-guard';
import { SocketManagerService } from './shared/socket-manager/socket-manager.service'; // 1. IMPORTAR

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketManager: SocketManagerService) {}

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('registerSession')
  handleRegisterSession(@ConnectedSocket() socket: SocketWithUser) {
    const playerId = socket.data.playerId;

    if (playerId) {
      this.socketManager.register(playerId, socket);
      socket.emit('sessionRegistered', { status: 'ok', playerId });
    } else {
      socket.emit('sessionRegistered', { status: 'error', message: 'Player not found.' });
    }
  }

  handleConnection(socket: SocketWithUser) {
    console.log(`[GameGateway] Socket ${socket.id} conectou.`);
  }

  handleDisconnect(socket: SocketWithUser) {
    this.socketManager.unregister(socket);
  }
}
