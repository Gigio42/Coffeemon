import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleCacheService } from '../../shared/cache/services/battle-cache.service';
import {
  BattleActionCommand,
  BattleCancelledEvent,
  BattleCreatedEvent,
  BattleEndedEvent,
  BattleStateUpdatedEvent,
  MatchPairFoundEvent,
  OpponentDisconnectedEvent,
  PlayerDisconnectedCommand,
  PlayerLeftBattleEvent,
  PlayerReconnectedEvent,
  PlayerWantsToLeaveBattleCommand,
  PlayerWantsToRejoinBattleCommand,
} from '../../shared/events/game.events';
import { PlayerCoffeemons } from '../player/entities/playerCoffeemons.entity';
import { PlayerService } from '../player/player.service';
import { BattleTurnManager } from './engine/battle-turn-manager';
import { Battle } from './entities/battle.entity';
import {
  BattleActionType,
  BattleState,
  BattleStatus,
  CoffeemonState,
  ExtractPayload,
  PlayerBattleState,
} from './types/batlle.types';
import { RoomCacheService } from '../../shared/cache/services/room-cache.service';

@Injectable()
export class BattleService {
  private disconnectionTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    @InjectRepository(Battle) private repo: Repository<Battle>,
    private playerService: PlayerService,
    private battleCache: BattleCacheService,
    private roomCache: RoomCacheService,
    private battleTurnManager: BattleTurnManager,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent('match.pair.found')
  async createBattle(event: MatchPairFoundEvent): Promise<void> {
    const battle = this.repo.create({
      player1Id: event.player1Id,
      player2Id: event.player2Id,
      player1SocketId: event.player1SocketId,
      player2SocketId: event.player2SocketId,
      status: BattleStatus.ACTIVE,
      createdAt: new Date(),
    });
    const savedBattle = await this.repo.save(battle);
    const state = await this.buildInitialState(
      event.player1Id,
      event.player2Id,
      event.player1SocketId,
      event.player2SocketId
    );
    await this.battleCache.set(savedBattle.id, state);

    this.eventEmitter.emit('battle.created', new BattleCreatedEvent(savedBattle.id, state));
  }

  @OnEvent('battle.action.command')
  async handleBattleAction(command: BattleActionCommand): Promise<void> {
    await this.updatePlayerSocketId(command.battleId, command.playerId, command.socketId);
    const updatedState = await this.executeTurn(
      command.battleId,
      command.playerId,
      command.actionType,
      command.payload as ExtractPayload<typeof command.actionType>
    );
    if (updatedState) {
      if (updatedState.battleStatus === BattleStatus.FINISHED) {
        this.eventEmitter.emit(
          'battle.ended',
          new BattleEndedEvent(command.battleId, updatedState.winnerId!, updatedState)
        );
      } else {
        this.eventEmitter.emit(
          'battle.state.updated',
          new BattleStateUpdatedEvent(command.battleId, updatedState)
        );
      }
    }
  }

  @OnEvent('player.rejoin.command')
  async handlePlayerRejoin(command: PlayerWantsToRejoinBattleCommand): Promise<void> {
    const battleRoomId = `battle:${command.battleId}`;
    await this.roomCache.joinRoom(battleRoomId, command.playerId, command.socketId, 'battle');
    await this.updatePlayerSocketId(command.battleId, command.playerId, command.socketId);

    const timeoutKey = `${command.battleId}:${command.playerId}`;
    if (this.disconnectionTimeouts.has(timeoutKey)) {
      clearTimeout(this.disconnectionTimeouts.get(timeoutKey));
      this.disconnectionTimeouts.delete(timeoutKey);
    }

    const battleState = await this.getBattleState(command.battleId);
    if (battleState) {
      this.eventEmitter.emit(
        'player.reconnected',
        new PlayerReconnectedEvent(command.battleId, command.playerId, battleState)
      );
    }
  }

  @OnEvent('player.leave.command')
  async handlePlayerLeave(command: PlayerWantsToLeaveBattleCommand): Promise<void> {
    const battleRoomId = `battle:${command.battleId}`;
    await this.roomCache.leaveRoom(battleRoomId, command.playerId);
    this.eventEmitter.emit(
      'player.left.battle',
      new PlayerLeftBattleEvent(command.battleId, command.playerId, command.socketId)
    );
  }

  @OnEvent('player.disconnected.command')
  async handlePlayerDisconnect(command: PlayerDisconnectedCommand): Promise<void> {
    const roomId = await this.roomCache.findRoomBySocket(command.socketId);
    if (roomId && roomId.startsWith('battle:')) {
      const battleId = roomId.split(':')[1];
      await this.roomCache.markPlayerDisconnected(command.socketId);
      this.eventEmitter.emit(
        'opponent.disconnected',
        new OpponentDisconnectedEvent(battleId, command.playerId)
      );
      this.scheduleDisconnectionTimeout(battleId, command.playerId);
    }
  }

  private scheduleDisconnectionTimeout(battleId: string, playerId: number): void {
    const timeoutKey = `${battleId}:${playerId}`;
    const timeout = setTimeout(() => {
      void this.handleDisconnectionTimeout(battleId, playerId);
    }, 30000); // 30 segundos
    this.disconnectionTimeouts.set(timeoutKey, timeout);
  }

  private async handleDisconnectionTimeout(battleId: string, playerId: number): Promise<void> {
    const timeoutKey = `${battleId}:${playerId}`;
    this.disconnectionTimeouts.delete(timeoutKey);

    const roomData = await this.roomCache.getRoomData(`battle:${battleId}`);
    const member = roomData?.members.find((m) => m.playerId === playerId);

    if (member && member.status === 'disconnected') {
      this.eventEmitter.emit('battle.cancelled', new BattleCancelledEvent(battleId, playerId));

      if (roomData) {
        for (const m of roomData.members) {
          await this.roomCache.leaveRoom(roomData.roomId, m.playerId);
        }
      }
      await this.battleCache.delete(battleId);
    }
  }

  private async executeTurn<T extends BattleActionType>(
    battleId: string,
    playerId: number,
    actionType: T,
    payload: ExtractPayload<T>
  ): Promise<BattleState | null> {
    const battleState = await this.battleCache.get(battleId);
    if (!battleState) throw new Error(`Battle with ID ${battleId} not found in cache`);
    if (battleState.player1Id !== playerId && battleState.player2Id !== playerId)
      throw new Error('You are not part of this battle');
    const updatedState = await this.battleTurnManager.runTurn({
      battleState,
      playerId,
      actionType,
      payload,
    });
    if (updatedState.battleStatus === BattleStatus.FINISHED) {
      await this.finalizeBattleInDb(battleId, updatedState);
    } else {
      await this.battleCache.set(battleId, updatedState);
    }
    return updatedState;
  }

  private async finalizeBattleInDb(battleId: string, state: BattleState): Promise<void> {
    const battle = await this.repo.findOneByOrFail({ id: battleId });
    battle.status = BattleStatus.FINISHED;
    battle.winnerId = state.winnerId!;
    battle.endedAt = new Date();
    await this.repo.save(battle);
    await this.battleCache.delete(battleId);
  }

  async getBattleState(battleId: string): Promise<BattleState | null> {
    const battleState = await this.battleCache.get(battleId);
    return battleState ?? null;
  }

  private async updatePlayerSocketId(
    battleId: string,
    playerId: number,
    socketId: string
  ): Promise<void> {
    const battleState = await this.battleCache.get(battleId);
    if (!battleState) return;
    let updated = false;
    if (battleState.player1Id === playerId && battleState.player1SocketId !== socketId) {
      battleState.player1SocketId = socketId;
      updated = true;
    }
    if (battleState.player2Id === playerId && battleState.player2SocketId !== socketId) {
      battleState.player2SocketId = socketId;
      updated = true;
    }
    if (updated) {
      await this.battleCache.set(battleId, battleState);
    }
  }

  private async buildInitialState(
    p1: number,
    p2: number,
    s1: string,
    s2: string
  ): Promise<BattleState> {
    const [team1, team2] = await Promise.all([
      this.playerService.getPlayerParty(p1),
      this.playerService.getPlayerParty(p2),
    ]);
    return {
      player1Id: p1,
      player2Id: p2,
      player1SocketId: s1,
      player2SocketId: s2,
      player1: this.mapTeam(team1),
      player2: this.mapTeam(team2),
      turn: 1,
      currentPlayerId: p1,
      battleStatus: BattleStatus.ACTIVE,
      events: [],
    };
  }

  private mapTeam(team: PlayerCoffeemons[]): PlayerBattleState {
    return {
      activeCoffeemonIndex: 0,
      coffeemons: team.map(
        (c): CoffeemonState => ({
          id: c.id,
          name: c.coffeemon.name,
          currentHp: c.coffeemon.baseHp,
          isFainted: false,
          canAct: true,
          maxHp: c.coffeemon.baseHp,
          attack: c.coffeemon.baseAttack,
          defense: c.coffeemon.baseDefense,
          modifiers: {
            attackModifier: 1.0,
            defenseModifier: 1.0,
            dodgeChance: 0.0,
            hitChance: 1.0,
            critChance: 0.05,
            blockChance: 0.0,
          },
          moves: [...(c.coffeemon.moves || []), ...(c.customMoves || [])],
        })
      ),
    };
  }
}
