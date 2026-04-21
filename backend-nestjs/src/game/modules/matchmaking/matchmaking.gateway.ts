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
import { BattleFormat } from './types/lobby.types';
import {
  PlayerDisconnectedCommand,
  PlayerWantsToBattleBotCommand,
  PlayerWantsToCreateLobbyCommand,
  PlayerWantsToGetLobbiesCommand,
  PlayerWantsToJoinLobbyCommand,
  PlayerWantsToJoinQueueCommand,
  PlayerWantsToLeaveLobbyCommand,
  PlayerWantsToLeaveQueueCommand,
  PlayerWantsToRejoinBattleCommand,
  PlayerWantsToStartLobbyCommand,
  PlayerWantsToUnwatchLobbiesCommand,
  PlayerWantsToWatchLobbiesCommand,
} from '../../shared/events/game.events';
import { WsPlayerGuard } from '../player/auth/ws-player.guard';

const VALID_FORMATS: BattleFormat[] = ['1v1', '2v2', '3v3'];
const isValidFormat = (f: unknown): f is BattleFormat => VALID_FORMATS.includes(f as BattleFormat);

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsGameAuthGuard, WsPlayerGuard)
export class MatchmakingGateway implements OnGatewayDisconnect {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  // ─── Queue ──────────────────────────────────────────────────────────────────

  @SubscribeMessage('findMatch')
  findMatch(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data?: { format?: BattleFormat }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    const format = isValidFormat(data?.format) ? data!.format! : '3v3';
    this.eventEmitter.emit('queue.join.command', new PlayerWantsToJoinQueueCommand(playerId, socket.id, format));
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

  @SubscribeMessage('findBotMatch')
  findBotMatch(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { botProfileId: string; format?: BattleFormat }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    const format = isValidFormat(data?.format) ? data.format! : '3v3';
    this.eventEmitter.emit(
      'bot.match.join.command',
      new PlayerWantsToBattleBotCommand(playerId, socket.id, data.botProfileId || 'jessie', format)
    );
  }

  // ─── Lobbies ─────────────────────────────────────────────────────────────────

  @SubscribeMessage('createLobby')
  createLobby(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { format: BattleFormat; type: 'public' | 'private' }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    const format = isValidFormat(data?.format) ? data.format! : '3v3';
    const lobbyType = data?.type === 'private' ? 'private' : 'public';
    this.eventEmitter.emit(
      'lobby.create.command',
      new PlayerWantsToCreateLobbyCommand(playerId, socket.id, format, lobbyType)
    );
  }

  @SubscribeMessage('joinLobby')
  joinLobby(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { lobbyId: string }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'lobby.join.command',
      new PlayerWantsToJoinLobbyCommand(playerId, socket.id, data.lobbyId)
    );
  }

  @SubscribeMessage('leaveLobby')
  leaveLobby(@ConnectedSocket() socket: SocketWithUser): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'lobby.leave.command',
      new PlayerWantsToLeaveLobbyCommand(playerId, socket.id)
    );
  }

  @SubscribeMessage('startLobby')
  startLobby(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { lobbyId: string }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'lobby.start.command',
      new PlayerWantsToStartLobbyCommand(playerId, socket.id, data.lobbyId)
    );
  }

  @SubscribeMessage('getLobbies')
  getLobbies(@ConnectedSocket() socket: SocketWithUser): void {
    this.eventEmitter.emit('lobby.list.command', new PlayerWantsToGetLobbiesCommand(socket.id));
  }

  @SubscribeMessage('watchLobbies')
  watchLobbies(@ConnectedSocket() socket: SocketWithUser): void {
    this.eventEmitter.emit('lobby.watch.command', new PlayerWantsToWatchLobbiesCommand(socket.id));
  }

  @SubscribeMessage('unwatchLobbies')
  unwatchLobbies(@ConnectedSocket() socket: SocketWithUser): void {
    this.eventEmitter.emit(
      'lobby.unwatch.command',
      new PlayerWantsToUnwatchLobbiesCommand(socket.id)
    );
  }

  // ─── Battle ──────────────────────────────────────────────────────────────────

  @SubscribeMessage('rejoinBattle')
  rejoinBattle(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { battleId: string }
  ): void {
    const playerId = socket.data.playerId;
    if (!playerId || !data?.battleId) return;
    this.eventEmitter.emit(
      'player.rejoin.command',
      new PlayerWantsToRejoinBattleCommand(playerId, socket.id, data.battleId)
    );
  }

  // ─── Disconnect ──────────────────────────────────────────────────────────────

  handleDisconnect(socket: SocketWithUser): void {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    this.eventEmitter.emit(
      'player.disconnected.command',
      new PlayerDisconnectedCommand(playerId, socket.id)
    );
  }
}
