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
      
      // Log dos socket IDs antes de enviar
      console.log(`[BattleGateway] Sending battleUpdate to:`, {
        player1SocketId: battleState.player1SocketId,
        player2SocketId: battleState.player2SocketId,
        battleStatus: battleState.battleStatus
      });
      
      this.server
        .to([battleState.player1SocketId, battleState.player2SocketId])
        .emit('battleUpdate', { battleState });

      if (battleState.battleStatus === BattleStatus.FINISHED) {
        console.log(`[BattleGateway] Battle FINISHED! Sending battleEnd to both players:`, {
          winnerId: battleState.winnerId,
          player1SocketId: battleState.player1SocketId,
          player2SocketId: battleState.player2SocketId
        });
        
        // Envia para ambos os sockets individualmente para garantir entrega
        this.server.to(battleState.player1SocketId).emit('battleEnd', { winnerId: battleState.winnerId });
        this.server.to(battleState.player2SocketId).emit('battleEnd', { winnerId: battleState.winnerId });
        
        // E também envia para o array (redundância intencional)
        this.server
          .to([battleState.player1SocketId, battleState.player2SocketId])
          .emit('battleEnd', { winnerId: battleState.winnerId });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error(`[BattleGateway] Error in battleAction:`, message);
      socket.emit('battleError', { message });
    }
  }
}
