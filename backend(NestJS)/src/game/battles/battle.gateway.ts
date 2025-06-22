import { ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattleService } from './battles.service';
import { FindMatchDto } from './dto/find-match.dto';
import { MatchmakingService } from './matchmaking.service';
import { BattleStatus } from './types/batlle.types';

@WebSocketGateway({ cors: { origin: '*' } })
export class BattleGateway {
  @WebSocketServer() server: Server;
  constructor(
    private matchMakingService: MatchmakingService,
    private battleService: BattleService
  ) {}

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() c: Socket) {
    c.emit('pong', { message: "I'm alive" });
  }

  @SubscribeMessage('findMatch')
  async findMatch(
    @ConnectedSocket() c: Socket,
    @MessageBody(new ValidationPipe({ transform: true })) dto: FindMatchDto
  ) {
    try {
      const res = await this.matchMakingService.enqueue(dto.userId, c.id);
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

  @SubscribeMessage('battleMove')
  async battleMove(
    @ConnectedSocket() c: Socket,
    @MessageBody() { battleId, moveId }: { battleId: string; moveId: number }
  ) {
    try {
      const state = await this.battleService.move(battleId, c.id, moveId);
      this.server.to(state.player1SocketId).to(state.player2SocketId).emit('battleUpdate', state);

      if (state.battleState.battleStatus === BattleStatus.FINISHED) {
        this.server
          .to(state.player1SocketId)
          .to(state.player2SocketId)
          .emit('battleEnd', { winnerId: state.winnerId });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      c.emit('battleError', { message });
    }
  }
}
