import { ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FindMatchDto } from './dto/find-match.dto';
import { MatchmakingService } from './matchmaking.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MatchmakingGateway {
  @WebSocketServer() server: Server;

  constructor(private matchmakingService: MatchmakingService) {}

  @SubscribeMessage('findMatch')
  async findMatch(
    @ConnectedSocket() c: Socket,
    @MessageBody(new ValidationPipe({ transform: true })) dto: FindMatchDto
  ) {
    try {
      const res = await this.matchmakingService.enqueue(dto.userId, c.id);
      if (res.status === 'waiting') {
        c.emit('matchStatus', res);
      } else {
        this.server.to(res.player1SocketId).to(res.player2SocketId).emit('matchFound', res);
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
