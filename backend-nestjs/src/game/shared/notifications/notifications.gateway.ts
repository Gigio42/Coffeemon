import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BattleViewService } from 'src/game/modules/battles/engine/battle-view.service';
import {
  BattleCancelledEvent,
  BattleCreatedEvent,
  BattleCreationFailedEvent,
  BattleEndedEvent,
  BattleRejoinFailedEvent,
  BattleStateUpdatedEvent,
  CoffeemonLearnedMoveEvent,
  CoffeemonLeveledUpEvent,
  LobbyCancelledEvent,
  LobbyCreatedEvent,
  LobbyErrorEvent,
  LobbyListSentEvent,
  LobbyStartedEvent,
  LobbyUpdatedEvent,
  NewPublicLobbyEvent,
  OpponentDisconnectedEvent,
  PlayerInventoryUpdateEvent,
  PlayerJoinedQueueEvent,
  PlayerLeftBattleEvent,
  PlayerLeftQueueEvent,
  PlayerLeveledUpEvent,
  PlayerReconnectedEvent,
  PublicLobbyRemovedEvent,
} from '../events/game.events';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

const LOBBY_WATCHERS_ROOM = 'lobby:watchers';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly battleViewService: BattleViewService,
    private readonly socketManager: SocketManagerService
  ) {}

  // ─── Queue ───────────────────────────────────────────────────────────────────

  @OnEvent('queue.player.joined')
  async handlePlayerJoinedQueue(event: PlayerJoinedQueueEvent): Promise<void> {
    const format = event.format ?? '3v3';
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      await socket.join(`matchmaking:${format}`);
      socket.emit('matchStatus', { status: 'waiting', format });
    }
  }

  @OnEvent('queue.player.left')
  async handlePlayerLeftQueue(event: PlayerLeftQueueEvent): Promise<void> {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      for (const fmt of ['1v1', '2v2', '3v3']) {
        await socket.leave(`matchmaking:${fmt}`);
      }
      socket.emit('queueLeft', { success: true });
    }
  }

  // ─── Lobby ───────────────────────────────────────────────────────────────────

  @OnEvent('lobby.created')
  async handleLobbyCreated(event: LobbyCreatedEvent): Promise<void> {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      await socket.join(`lobby:${event.lobby.id}`);
      socket.emit('lobbyCreated', { lobby: event.lobby });
    }
  }

  @OnEvent('lobby.updated')
  async handleLobbyUpdated(event: LobbyUpdatedEvent): Promise<void> {
    const { lobby } = event;
    if (lobby.guestSocketId) {
      const guestSocket = this.server.sockets.sockets.get(lobby.guestSocketId);
      if (guestSocket) await guestSocket.join(`lobby:${lobby.id}`);
    }
    this.server.to(`lobby:${lobby.id}`).emit('lobbyUpdated', { lobby });
  }

  @OnEvent('lobby.cancelled')
  async handleLobbyCancelled(event: LobbyCancelledEvent): Promise<void> {
    this.server.to(`lobby:${event.lobby.id}`).emit('lobbyCancelled', { lobbyId: event.lobby.id });
    this.server.in(`lobby:${event.lobby.id}`).socketsLeave(`lobby:${event.lobby.id}`);
  }

  @OnEvent('lobby.new.public')
  handleNewPublicLobby(event: NewPublicLobbyEvent): void {
    const room = this.server.sockets.adapter.rooms.get(LOBBY_WATCHERS_ROOM);
    if (!room) return;
    for (const socketId of room) {
      if (socketId === event.lobby.hostSocketId) continue;
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) socket.emit('newPublicLobby', { lobby: event.lobby });
    }
  }

  @OnEvent('lobby.public.removed')
  handlePublicLobbyRemoved(event: PublicLobbyRemovedEvent): void {
    this.server.to(LOBBY_WATCHERS_ROOM).emit('publicLobbyRemoved', { lobbyId: event.lobbyId });
  }

  @OnEvent('lobby.list.ready')
  async handleLobbyList(event: LobbyListSentEvent): Promise<void> {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) {
      await socket.join(LOBBY_WATCHERS_ROOM);
      socket.emit('lobbyList', { lobbies: event.lobbies });
    }
  }

  @OnEvent('lobby.starting')
  handleLobbyStarting(event: LobbyStartedEvent): void {
    this.server.to(`lobby:${event.lobby.id}`).emit('lobbyStarting', {
      format: event.lobby.format,
    });
  }

  @OnEvent('lobby.error')
  handleLobbyError(event: LobbyErrorEvent): void {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) socket.emit('lobbyError', { message: event.message });
  }

  // ─── Battle ───────────────────────────────────────────────────────────────────

  @OnEvent('battle.created')
  async handleBattleCreated(event: BattleCreatedEvent): Promise<void> {
    const fullState = event.battleState;
    const battleRoom = `battle:${event.battleId}`;
    const { player1SocketId, player2SocketId, player1Id, player2Id } = fullState;

    const p1Socket = this.server.sockets.sockets.get(player1SocketId);
    const p2Socket = this.server.sockets.sockets.get(player2SocketId);

    if (p1Socket) {
      // Leave matchmaking/lobby rooms
      for (const fmt of ['1v1', '2v2', '3v3']) await p1Socket.leave(`matchmaking:${fmt}`);
      await p1Socket.leave(LOBBY_WATCHERS_ROOM);
      await p1Socket.join(battleRoom);
      p1Socket.data = { ...p1Socket.data, playerId: player1Id, battleId: event.battleId };
    }
    if (p2Socket) {
      for (const fmt of ['1v1', '2v2', '3v3']) await p2Socket.leave(`matchmaking:${fmt}`);
      await p2Socket.leave(LOBBY_WATCHERS_ROOM);
      await p2Socket.join(battleRoom);
      p2Socket.data = { ...p2Socket.data, playerId: player2Id, battleId: event.battleId };
    }

    const p1View = await this.battleViewService.buildPlayerView(fullState, player1Id);
    const p2View = await this.battleViewService.buildPlayerView(fullState, player2Id);

    // Send matchFound with battleState included so the frontend has the state
    // immediately on navigation — avoids the race where battleUpdate arrives
    // before the BattleScreen listener is registered.
    if (p1Socket) p1Socket.emit('matchFound', { battleId: event.battleId, battleState: p1View });
    if (p2Socket) p2Socket.emit('matchFound', { battleId: event.battleId, battleState: p2View });
  }

  @OnEvent('battle.state.updated')
  async handleBattleStateUpdate(event: BattleStateUpdatedEvent): Promise<void> {
    const fullState = event.battleState;
    const { player1Id, player2Id, player1SocketId, player2SocketId } = fullState;
    const p1View = await this.battleViewService.buildPlayerView(fullState, player1Id);
    const p2View = await this.battleViewService.buildPlayerView(fullState, player2Id);

    this.server.to(player1SocketId).emit('battleUpdate', { battleState: p1View });

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
      const playerView = await this.battleViewService.buildPlayerView(fullState, event.playerId);
      socket.emit('battleRejoined', { battleId: event.battleId, battleState: playerView });
      socket.to(battleRoom).emit('playerReconnected', {
        playerId: event.playerId,
        message: 'Opponent reconnected to the battle.',
      });
      socket.data = { ...socket.data, playerId: event.playerId, battleId: event.battleId };
    }
  }

  @OnEvent('battle.rejoin.failed')
  handleBattleRejoinFailed(event: BattleRejoinFailedEvent): void {
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) socket.emit('battleRejoinFailed', { battleId: event.battleId });
  }

  @OnEvent('battle.creation.failed')
  handleBattleCreationFailed(event: BattleCreationFailedEvent): void {
    const p1 = this.server.sockets.sockets.get(event.player1SocketId);
    const p2 = event.player2SocketId !== 'bot'
      ? this.server.sockets.sockets.get(event.player2SocketId)
      : null;
    if (p1) p1.emit('battleError', { message: event.message });
    if (p2) p2.emit('battleError', { message: event.message });
  }

  @OnEvent('player.left.battle')
  async handlePlayerLeftBattle(event: PlayerLeftBattleEvent): Promise<void> {
    const battleRoom = `battle:${event.battleId}`;
    const socket = this.server.sockets.sockets.get(event.socketId);
    if (socket) await socket.leave(battleRoom);
    this.server.to(battleRoom).emit('opponentLeft', {
      playerId: event.playerId,
      message: 'Your opponent left the battle.',
    });
  }

  @OnEvent('opponent.disconnected')
  handleOpponentDisconnected(event: OpponentDisconnectedEvent): void {
    this.server.to(`battle:${event.battleId}`).emit('opponentDisconnected', {
      playerId: event.disconnectedPlayerId,
      temporary: true,
      message: 'Opponent disconnected. Waiting for reconnection...',
    });
  }

  @OnEvent('battle.cancelled')
  handleBattleCancelled(event: BattleCancelledEvent): void {
    const battleRoom = `battle:${event.battleId}`;
    const payload = {
      reason: 'disconnection',
      disconnectedPlayerId: event.disconnectedPlayerId,
      message: 'Battle cancelled due to prolonged disconnection.',
    };
    this.server.to(battleRoom).emit('battleCancelled', payload);

    // The disconnected player has a new socket not in the battle room — notify them directly
    const disconnectedSocketId = this.socketManager.getSocketId(event.disconnectedPlayerId);
    if (disconnectedSocketId) {
      this.server.to(disconnectedSocketId).emit('battleCancelled', payload);
    }

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
      this.server.to(socketId).emit('playerLevelUp', { newLevel: event.newLevel });
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
