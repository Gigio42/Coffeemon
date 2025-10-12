import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketWithUser } from 'src/auth/types/auth.types';
import { WsGameAuthGuard } from '../auth/guards/ws-game-auth-guard';
import {
  PlayerDisconnectedCommand,
  PlayerWantsToJoinQueueCommand,
  PlayerWantsToLeaveQueueCommand,
} from '../events/game.events';
import { WsPlayerGuard } from '../player/auth/ws-player.guard';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsGameAuthGuard, WsPlayerGuard)
export class MatchmakingGateway implements OnGatewayDisconnect {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @SubscribeMessage('findMatch')
  findMatch(@ConnectedSocket() socket: SocketWithUser): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'queue.join.command',
      new PlayerWantsToJoinQueueCommand(playerId, socket.id)
    );
  }

  @SubscribeMessage('leaveQueue')
  leaveQueue(@ConnectedSocket() socket: SocketWithUser): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'queue.leave.command',
      new PlayerWantsToLeaveQueueCommand(playerId, socket.id)
    );
  }

  handleDisconnect(socket: SocketWithUser): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'player.disconnected.command',
      new PlayerDisconnectedCommand(playerId, socket.id)
    );
  }
}
