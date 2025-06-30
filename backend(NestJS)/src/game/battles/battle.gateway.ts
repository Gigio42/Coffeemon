import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattleService } from './battles.service';
import { BattleActionUnion } from './types/batlle.types';
import { BattleStatus } from './types/batlle.types';

@WebSocketGateway({ cors: { origin: '*' } })
export class BattleGateway {
  @WebSocketServer() server: Server;
  constructor(private battleService: BattleService) {}

  @SubscribeMessage('battleAction')
  async battleAction(
    @ConnectedSocket() c: Socket,
    @MessageBody()
    { battleId, actionType, payload }: BattleActionUnion
  ) {
    try {
      console.log(`Battle action received: ${actionType} with payload:`, payload);
      const { battleState, events } = await this.battleService.executeTurn(
        battleId,
        c.id,
        actionType,
        payload
      );
      this.server
        .to(battleState.player1SocketId)
        .to(battleState.player2SocketId)
        .emit('battleUpdate', { battleState, events });

      if (battleState.battleStatus === BattleStatus.FINISHED) {
        this.server
          .to(battleState.player1SocketId)
          .to(battleState.player2SocketId)
          .emit('battleEnd', { winnerId: battleState.winnerId });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      c.emit('battleError', { message });
    }
  }
}
