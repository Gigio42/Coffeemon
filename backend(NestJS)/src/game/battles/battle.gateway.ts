import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { SocketWithUser } from 'src/auth/types/auth.types';
import { WsPlayerGuard } from '../player/guards/ws-player.guard';
import { BattleService } from './battles.service';
import { BattleActionUnion, BattleStatus } from './types/batlle.types';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
@UseGuards(WsAuthGuard, WsPlayerGuard)
export class BattleGateway {
  @WebSocketServer() server: Server;
  constructor(private battleService: BattleService) {}

  @SubscribeMessage('joinBattle')
  handleJoinBattle(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { battleId: string }
  ) {
    const playerId = socket.data.playerId;
    if (playerId) {
      console.log(`Player ${playerId} (socket: ${socket.id}) joining battle ${data.battleId}`);
      this.battleService.updatePlayerSocketId(data.battleId, playerId, socket.id);
    }
  }

  @SubscribeMessage('battleAction')
  async battleAction(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody()
    { battleId, actionType, payload }: BattleActionUnion
  ) {
    const playerId = socket.data.playerId;

    if (!playerId) {
      socket.emit('battleError', { message: 'Player ID not found on socket.' });
      return;
    }
    this.battleService.updatePlayerSocketId(battleId, playerId, socket.id);

    try {
      const { battleState } = await this.battleService.executeTurn(
        battleId,
        playerId,
        actionType,
        payload
      );
      this.server
        .to([battleState.player1SocketId, battleState.player2SocketId])
        .emit('battleUpdate', { battleState });

      if (battleState.battleStatus === BattleStatus.FINISHED) {
        this.server
          .to([battleState.player1SocketId, battleState.player2SocketId])
          .emit('battleEnd', { winnerId: battleState.winnerId });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      socket.emit('battleError', { message });
    }
  }
}
