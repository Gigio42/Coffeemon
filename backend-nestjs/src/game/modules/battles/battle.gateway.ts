import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketWithUser } from 'src/auth/types/auth.types';
import { WsGameAuthGuard } from '../../shared/auth/guards/ws-game-auth-guard';
import { WsPlayerGuard } from '../player/auth/ws-player.guard';
import {
  BattleActionCommand,
  PlayerDisconnectedCommand,
  PlayerWantsToLeaveBattleCommand,
  PlayerWantsToRejoinBattleCommand,
} from '../../shared/events/game.events';
import { BattleActionUnion } from './types/batlle.types';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsGameAuthGuard, WsPlayerGuard)
export class BattleGateway implements OnGatewayDisconnect {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @SubscribeMessage('joinBattle')
  handleJoinBattle(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { battleId: string }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'player.rejoin.command',
      new PlayerWantsToRejoinBattleCommand(playerId, socket.id, data.battleId)
    );
  }

  @SubscribeMessage('battleAction')
  handleBattleAction(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() { battleId, actionType, payload }: BattleActionUnion
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'battle.action.command',
      new BattleActionCommand(battleId, playerId, socket.id, actionType, payload)
    );
  }

  @SubscribeMessage('leaveBattle')
  handleLeaveBattle(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { battleId: string }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'player.leave.command',
      new PlayerWantsToLeaveBattleCommand(playerId, socket.id, data.battleId)
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
