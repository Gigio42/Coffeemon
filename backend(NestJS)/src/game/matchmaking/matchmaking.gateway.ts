import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GetUserWs } from 'src/auth/decorators/get-user-ws.decorator';
import { MatchmakingService } from './matchmaking.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsAuthGuard)
export class MatchmakingGateway {
  @WebSocketServer() server: Server;

  constructor(private matchmakingService: MatchmakingService) {}

  @SubscribeMessage('findMatch')
  async findMatch(@ConnectedSocket() c: Socket, @GetUserWs('id') userId: number) {
    try {
      console.log('a');
      const res = await this.matchmakingService.enqueue(userId, c.id);
      if (res.status === 'waiting') {
        c.emit('matchStatus', res);
      } else {
        this.server
          .to(res.battleState.player1SocketId)
          .to(res.battleState.player2SocketId)
          .emit('matchFound', res);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      c.emit('battleError', { message });
    }
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    try {
      const result = await this.matchmakingService.handleDisconnect(socket.id);

      if (result?.opponentSocketId) {
        this.server.to(result.opponentSocketId).emit('opponentDisconnected', {
          message: 'Your opponent has disconnected from the session.',
        });
      }
    } catch {
      this.server.to(socket.id).emit('error', { message: 'Erro ao processar desconexão.' });
    }
  }

  // TODO desafio direto (challenge)
  // @SubscribeMessage('challenge')
  // async challenge(
  //   @ConnectedSocket() c: Socket,
  //   @MessageBody() dto: { userId: number; targetUserId: number }
  // ) {
  //   const res = await this.matchMakingService.challenge(dto.userId, c.id, dto.targetUserId);
  //   c.emit('challengeStatus', res);
  // }

  // TODO aceitar desafio
  // @SubscribeMessage('acceptChallenge')
  // async acceptChallenge(
  //   @ConnectedSocket() c: Socket,
  //   @MessageBody() dto: { userId: number }
  // ) {
  //   const res = await this.matchMakingService.acceptChallenge(dto.userId, c.id);
  //   if (res.status === 'no_challenge') {
  //     c.emit('challengeStatus', res);
  //   } else {
  //     this.server.to(res.player1SocketId).to(res.player2SocketId).emit('matchFound', res);
  //   }
  // }
}
