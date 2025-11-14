import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BattleViewService } from 'src/game/modules/battles/engine/battle-view.service';
import {
  BattleCancelledEvent,
  BattleCreatedEvent,
  BattleEndedEvent,
  BattleStateUpdatedEvent,
  CoffeemonLearnedMoveEvent,
  CoffeemonLeveledUpEvent,
  OpponentDisconnectedEvent,
  PlayerInventoryUpdateEvent,
  PlayerJoinedQueueEvent,
  PlayerLeftBattleEvent,
  PlayerLeftQueueEvent,
  PlayerLeveledUpEvent,
  PlayerReconnectedEvent,
} from '../events/game.events';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly battleViewService: BattleViewService,
    private readonly socketManager: SocketManagerService
  ) {}

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
    const fullState = event.battleState;
    const battleRoom = `battle:${event.battleId}`;
    const { player1SocketId, player2SocketId, player1Id, player2Id } = fullState;

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

    const p1View = this.battleViewService.buildPlayerView(fullState, player1Id);
    const p2View = this.battleViewService.buildPlayerView(fullState, player2Id);

    if (p1Socket) {
      p1Socket.emit('battleUpdate', { battleState: p1View });
    }
    if (p2Socket) {
      p2Socket.emit('battleUpdate', { battleState: p2View });
    }
  }

  @OnEvent('battle.state.updated')
  handleBattleStateUpdate(event: BattleStateUpdatedEvent): void {
    const fullState = event.battleState;
    const { player1Id, player2Id, player1SocketId, player2SocketId } = fullState;
    const p1View = this.battleViewService.buildPlayerView(fullState, player1Id);
    const p2View = this.battleViewService.buildPlayerView(fullState, player2Id);

    this.server.to(player1SocketId).emit('battleUpdate', { battleState: p1View });

    // n envia o state pro bot (ele n precisa saber de nada)
    if (player2SocketId !== 'bot') {
      this.server.to(player2SocketId).emit('battleUpdate', { battleState: p2View });
    }
  }

  @OnEvent('player.inventory.update')
  handleInventoryUpdate(event: PlayerInventoryUpdateEvent): void {
    const socketId = this.socketManager.getSocketId(event.playerId);

    if (socketId) {
      this.server.to(socketId).emit('inventoryUpdate', {
        inventory: event.updatedPlayer.inventory,
        coins: event.updatedPlayer.coins,
      });
    }
  }

  @OnEvent('player.reconnected')
  async handlePlayerReconnected(event: PlayerReconnectedEvent): Promise<void> {
    const fullState = event.battleState;
    const battleRoom = `battle:${event.battleId}`;
    const socketId =
      event.battleState.player1Id === event.playerId
        ? event.battleState.player1SocketId
        : event.battleState.player2SocketId;

    const socket = this.server.sockets.sockets.get(socketId);

    if (socket) {
      await socket.join(battleRoom);

      const playerView = this.battleViewService.buildPlayerView(fullState, event.playerId);
      socket.emit('battleUpdate', { battleState: playerView });

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

  @OnEvent('player.leveled.up')
  handlePlayerLeveledUp(event: PlayerLeveledUpEvent): void {
    const socketId = this.socketManager.getSocketId(event.playerId);
    if (socketId) {
      this.server.to(socketId).emit('playerLevelUp', {
        newLevel: event.newLevel,
      });
    }
  }

  @OnEvent('coffeemon.leveled.up')
  handleCoffeemonLeveledUp(event: CoffeemonLeveledUpEvent): void {
    const socketId = this.socketManager.getSocketId(event.playerId);
    if (socketId) {
      this.server.to(socketId).emit('coffeemonLevelUp', {
        playerCoffeemonId: event.playerCoffeemonId,
        newLevel: event.newLevel,
        expGained: event.expGained,
      });
    }
  }

  @OnEvent('coffeemon.learned.move')
  handleCoffeemonLearnedMove(event: CoffeemonLearnedMoveEvent): void {
    const socketId = this.socketManager.getSocketId(event.playerId);
    if (socketId) {
      this.server.to(socketId).emit('coffeemonLearnedMove', {
        playerCoffeemonId: event.playerCoffeemonId,
        moveName: event.moveName,
      });
    }
  }
}
