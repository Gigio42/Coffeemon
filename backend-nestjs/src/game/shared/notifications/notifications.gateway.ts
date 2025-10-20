import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  BattleCancelledEvent,
  BattleCreatedEvent,
  BattleEndedEvent,
  BattleStateUpdatedEvent,
  OpponentDisconnectedEvent,
  PlayerJoinedQueueEvent,
  PlayerLeftBattleEvent,
  PlayerLeftQueueEvent,
  PlayerReconnectedEvent,
} from '../events/game.events';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @OnEvent('queue.player.joined')
  async handlePlayerJoinedQueue(event: PlayerJoinedQueueEvent): Promise<void> {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      await socket.join('matchmaking:default');
      socket.emit('matchStatus', { status: 'waiting' });
      this.server.to('matchmaking:default').emit('playerJoinedQueue', { playerId: event.playerId });
    }
  }

  @OnEvent('queue.player.left')
  async handlePlayerLeftQueue(event: PlayerLeftQueueEvent): Promise<void> {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      await socket.leave('matchmaking:default');
      socket.emit('queueLeft', { success: true });
    }
    this.server.to('matchmaking:default').emit('playerLeftQueue', { playerId: event.playerId });
  }

  @OnEvent('battle.created')
  async handleBattleCreated(event: BattleCreatedEvent): Promise<void> {
    const battleRoom = `battle:${event.battleId}`;
    const { player1SocketId, player2SocketId, player1Id, player2Id } = event.battleState;

    const p1Socket = this.server.sockets.sockets.get(player1SocketId);
    const p2Socket = this.server.sockets.sockets.get(player2SocketId);

    if (p1Socket) {
      await p1Socket.leave('matchmaking:default');
      await p1Socket.join(battleRoom);
      p1Socket.data = { ...p1Socket.data, playerId: player1Id, battleId: event.battleId };
    }
    if (p2Socket) {
      await p2Socket.leave('matchmaking:default');
      await p2Socket.join(battleRoom);
      p2Socket.data = { ...p2Socket.data, playerId: player2Id, battleId: event.battleId };
    }

    this.server.to(battleRoom).emit('matchFound', { battleId: event.battleId });
    this.server.to(battleRoom).emit('battleUpdate', { battleState: event.battleState });
  }

  @OnEvent('battle.state.updated')
  handleBattleStateUpdate(event: BattleStateUpdatedEvent): void {
    const battleRoom = `battle:${event.battleId}`;
    this.server.to(battleRoom).emit('battleUpdate', { battleState: event.battleState });
  }

  @OnEvent('player.reconnected')
  async handlePlayerReconnected(event: PlayerReconnectedEvent): Promise<void> {
    const battleRoom = `battle:${event.battleId}`;
    const socketId =
      event.battleState.player1Id === event.playerId
        ? event.battleState.player1SocketId
        : event.battleState.player2SocketId;

    const socket = this.server.sockets.sockets.get(socketId);

    if (socket) {
      await socket.join(battleRoom);

      socket.emit('battleUpdate', { battleState: event.battleState });

      socket.to(battleRoom).emit('playerReconnected', {
        playerId: event.playerId,
        message: 'Opponent reconnected to the battle.',
      });

      socket.data = { ...socket.data, playerId: event.playerId, battleId: event.battleId };
    } else {
      console.warn(
        `[NotificationsGateway] Socket ${socketId} for reconnected player ${event.playerId} not found.`
      );
    }
  }

  @OnEvent('player.left.battle')
  async handlePlayerLeftBattle(event: PlayerLeftBattleEvent): Promise<void> {
    const battleRoom = `battle:${event.battleId}`;
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      await socket.leave(battleRoom);
    }
    this.server.to(battleRoom).emit('opponentLeft', {
      playerId: event.playerId,
      message: 'Your opponent left the battle.',
    });
  }

  @OnEvent('opponent.disconnected')
  handleOpponentDisconnected(event: OpponentDisconnectedEvent): void {
    const battleRoom = `battle:${event.battleId}`;
    this.server.to(battleRoom).emit('opponentDisconnected', {
      playerId: event.disconnectedPlayerId,
      temporary: true,
      message: 'Opponent disconnected. Waiting for reconnection...',
    });
  }

  @OnEvent('battle.cancelled')
  handleBattleCancelled(event: BattleCancelledEvent): void {
    const battleRoom = `battle:${event.battleId}`;
    this.server.to(battleRoom).emit('battleCancelled', {
      reason: 'disconnection',
      disconnectedPlayerId: event.disconnectedPlayerId,
      message: 'Battle cancelled due to prolonged disconnection.',
    });
    this.server.in(battleRoom).disconnectSockets(true);
  }

  @OnEvent('battle.ended')
  handleBattleEnded(event: BattleEndedEvent): void {
    const battleRoom = `battle:${event.battleId}`;
    this.server
      .to(battleRoom)
      .emit('battleEnd', { winnerId: event.winnerId, battleState: event.battleState });
    setTimeout(() => {
      this.server.in(battleRoom).disconnectSockets(true);
    }, 5000);
  }
}
