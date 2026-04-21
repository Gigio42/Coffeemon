import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { RoomCacheService } from '../../shared/cache/services/room-cache.service';
import { PlayerService } from '../player/player.service';
import { BATTLE_FORMAT_SIZES, BattleFormat, GameLobby } from './types/lobby.types';
import {
  LobbyCancelledEvent,
  LobbyCreatedEvent,
  LobbyErrorEvent,
  LobbyListSentEvent,
  LobbyStartedEvent,
  LobbyUpdatedEvent,
  MatchPairFoundEvent,
  NewPublicLobbyEvent,
  PlayerDisconnectedCommand,
  PlayerWantsToCreateLobbyCommand,
  PlayerWantsToGetLobbiesCommand,
  PlayerWantsToJoinLobbyCommand,
  PlayerWantsToLeaveLobbyCommand,
  PlayerWantsToStartLobbyCommand,
  PlayerWantsToUnwatchLobbiesCommand,
  PlayerWantsToWatchLobbiesCommand,
  PublicLobbyRemovedEvent,
} from '../../shared/events/game.events';

const LOBBY_TTL = 3600; // 1h
const PUBLIC_LOBBIES_KEY = 'lobbies:public';
const LOBBY_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class LobbyService {
  constructor(
    private readonly redis: RedisService,
    private readonly roomCache: RoomCacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly playerService: PlayerService
  ) {}

  // ─── Command handlers ───────────────────────────────────────────────────────

  @OnEvent('lobby.create.command')
  async handleCreateLobby(command: PlayerWantsToCreateLobbyCommand): Promise<void> {
    try {
      const [existingLobbyId, queueRoomId] = await Promise.all([
        this.redis.get(`player:${command.playerId}:lobby`),
        this.roomCache.findRoomByPlayer(command.playerId),
      ]);

      if (existingLobbyId) {
        await this.cancelLobby(existingLobbyId, command.playerId);
      }
      if (queueRoomId?.startsWith('matchmaking:')) {
        await this.roomCache.leaveRoom(queueRoomId, command.playerId);
      }

      const player = await this.playerService.findOne(command.playerId);
      const lobbyId = this.generateLobbyId();

      const lobby: GameLobby = {
        id: lobbyId,
        hostId: command.playerId,
        hostUsername: player.user.username,
        hostSocketId: command.socketId,
        format: command.format,
        type: command.lobbyType,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };

      await Promise.all([
        this.redis.set(`lobby:${lobbyId}`, JSON.stringify(lobby), LOBBY_TTL),
        this.redis.set(`player:${command.playerId}:lobby`, lobbyId, LOBBY_TTL),
      ]);

      if (command.lobbyType === 'public') {
        await this.redis.getClient().sadd(PUBLIC_LOBBIES_KEY, lobbyId);
        this.eventEmitter.emit('lobby.new.public', new NewPublicLobbyEvent(lobby));
      }

      this.eventEmitter.emit('lobby.created', new LobbyCreatedEvent(command.socketId, lobby));
    } catch {
      this.eventEmitter.emit(
        'lobby.error',
        new LobbyErrorEvent(command.socketId, 'Falha ao criar sala.')
      );
    }
  }

  @OnEvent('lobby.join.command')
  async handleJoinLobby(command: PlayerWantsToJoinLobbyCommand): Promise<void> {
    try {
      const raw = await this.redis.get(`lobby:${command.lobbyId}`);
      if (!raw) {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(command.socketId, 'Sala não encontrada.')
        );
        return;
      }

      const lobby: GameLobby = JSON.parse(raw);

      if (lobby.status !== 'waiting') {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(command.socketId, 'Sala não está disponível.')
        );
        return;
      }

      if (lobby.hostId === command.playerId) {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(command.socketId, 'Você já é o host desta sala.')
        );
        return;
      }

      const formatSize = BATTLE_FORMAT_SIZES[lobby.format];
      const [guest, guestParty, existingLobbyId] = await Promise.all([
        this.playerService.findOne(command.playerId),
        this.playerService.getPlayerParty(command.playerId),
        this.redis.get(`player:${command.playerId}:lobby`),
      ]);

      if (guestParty.length < formatSize) {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(
            command.socketId,
            `Você precisa de ${formatSize} Coffeemon(s) na equipe para entrar nesta sala (${lobby.format}).`
          )
        );
        return;
      }

      if (existingLobbyId && existingLobbyId !== command.lobbyId) {
        await this.cancelLobby(existingLobbyId, command.playerId);
      }

      lobby.guestId = command.playerId;
      lobby.guestUsername = guest.user.username;
      lobby.guestSocketId = command.socketId;
      lobby.status = 'ready';

      await Promise.all([
        this.redis.set(`lobby:${command.lobbyId}`, JSON.stringify(lobby), LOBBY_TTL),
        this.redis.set(`player:${command.playerId}:lobby`, command.lobbyId, LOBBY_TTL),
      ]);

      if (lobby.type === 'public') {
        await this.redis.getClient().srem(PUBLIC_LOBBIES_KEY, command.lobbyId);
        this.eventEmitter.emit('lobby.public.removed', new PublicLobbyRemovedEvent(command.lobbyId));
      }

      this.eventEmitter.emit('lobby.updated', new LobbyUpdatedEvent(lobby));
    } catch {
      this.eventEmitter.emit(
        'lobby.error',
        new LobbyErrorEvent(command.socketId, 'Falha ao entrar na sala.')
      );
    }
  }

  @OnEvent('lobby.leave.command')
  async handleLeaveLobby(command: PlayerWantsToLeaveLobbyCommand): Promise<void> {
    const lobbyId = await this.redis.get(`player:${command.playerId}:lobby`);
    if (!lobbyId) return;
    await this.cancelLobby(lobbyId, command.playerId);
  }

  @OnEvent('lobby.start.command')
  async handleStartLobby(command: PlayerWantsToStartLobbyCommand): Promise<void> {
    try {
      const raw = await this.redis.get(`lobby:${command.lobbyId}`);
      if (!raw) {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(command.socketId, 'Sala não encontrada.')
        );
        return;
      }

      const lobby: GameLobby = JSON.parse(raw);

      if (lobby.hostId !== command.playerId) {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(command.socketId, 'Apenas o host pode iniciar a partida.')
        );
        return;
      }

      if (lobby.status !== 'ready' || !lobby.guestId || !lobby.guestSocketId) {
        this.eventEmitter.emit(
          'lobby.error',
          new LobbyErrorEvent(command.socketId, 'A sala precisa de 2 jogadores para iniciar.')
        );
        return;
      }

      this.eventEmitter.emit('lobby.starting', new LobbyStartedEvent(lobby));

      this.eventEmitter.emit(
        'match.pair.found',
        new MatchPairFoundEvent(
          lobby.hostId,
          lobby.hostSocketId,
          lobby.guestId,
          lobby.guestSocketId,
          lobby.format
        )
      );

      await Promise.all([
        this.redis.del(`lobby:${command.lobbyId}`),
        this.redis.del(`player:${lobby.hostId}:lobby`),
        this.redis.del(`player:${lobby.guestId}:lobby`),
      ]);
    } catch {
      this.eventEmitter.emit(
        'lobby.error',
        new LobbyErrorEvent(command.socketId, 'Falha ao iniciar a partida.')
      );
    }
  }

  @OnEvent('lobby.list.command')
  async handleGetLobbies(command: PlayerWantsToGetLobbiesCommand): Promise<void> {
    const lobbies = await this.getPublicLobbies();
    this.eventEmitter.emit('lobby.list.ready', new LobbyListSentEvent(command.socketId, lobbies));
  }

  @OnEvent('lobby.watch.command')
  async handleWatchLobbies(command: PlayerWantsToWatchLobbiesCommand): Promise<void> {
    const lobbies = await this.getPublicLobbies();
    this.eventEmitter.emit('lobby.list.ready', new LobbyListSentEvent(command.socketId, lobbies));
  }

  @OnEvent('lobby.unwatch.command')
  handleUnwatchLobbies(_command: PlayerWantsToUnwatchLobbiesCommand): void {
    // Socket room leave handled in NotificationsGateway
  }

  @OnEvent('player.disconnected.command')
  async handlePlayerDisconnect(command: PlayerDisconnectedCommand): Promise<void> {
    const lobbyId = await this.redis.get(`player:${command.playerId}:lobby`);
    if (lobbyId) {
      await this.cancelLobby(lobbyId, command.playerId);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async cancelLobby(lobbyId: string, actingPlayerId: number): Promise<void> {
    const raw = await this.redis.get(`lobby:${lobbyId}`);
    if (!raw) return;

    const lobby: GameLobby = JSON.parse(raw);
    const keysToDelete = [`lobby:${lobbyId}`, `player:${actingPlayerId}:lobby`];

    if (lobby.guestId && lobby.guestId !== actingPlayerId) {
      keysToDelete.push(`player:${lobby.guestId}:lobby`);
    }
    if (lobby.hostId !== actingPlayerId) {
      keysToDelete.push(`player:${lobby.hostId}:lobby`);
    }

    await Promise.all(keysToDelete.map((k) => this.redis.del(k)));

    if (lobby.type === 'public') {
      await this.redis.getClient().srem(PUBLIC_LOBBIES_KEY, lobbyId);
      this.eventEmitter.emit('lobby.public.removed', new PublicLobbyRemovedEvent(lobbyId));
    }

    this.eventEmitter.emit('lobby.cancelled', new LobbyCancelledEvent({ id: lobbyId }));
  }

  private async getPublicLobbies(): Promise<GameLobby[]> {
    const lobbyIds = await this.redis.getClient().smembers(PUBLIC_LOBBIES_KEY);
    if (!lobbyIds.length) return [];

    const keys = lobbyIds.map((id) => `lobby:${id}`);
    const raws = await this.redis.getClient().mget(keys);

    const lobbies: GameLobby[] = [];
    const staleIds: string[] = [];

    for (let i = 0; i < raws.length; i++) {
      const raw = raws[i];
      if (raw) {
        const lobby: GameLobby = JSON.parse(raw);
        if (lobby.status === 'waiting') {
          lobbies.push(lobby);
        } else {
          staleIds.push(lobbyIds[i]);
        }
      } else {
        staleIds.push(lobbyIds[i]);
      }
    }

    if (staleIds.length) {
      await this.redis.getClient().srem(PUBLIC_LOBBIES_KEY, ...staleIds);
    }

    return lobbies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private generateLobbyId(): string {
    return Array.from({ length: 6 }, () =>
      LOBBY_ID_CHARS[Math.floor(Math.random() * LOBBY_ID_CHARS.length)]
    ).join('');
  }
}
