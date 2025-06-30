import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleCacheService } from '../cache/battle-cache.service';
import { PlayerCoffeemon } from '../player/entities/playercoffeemon.entity';
import { PlayerService } from '../player/player.service';
import { BattleTurnManager } from './engine/battle-turn-manager';
import { Battle } from './entities/battle.entity';
import {
  BattleActionType,
  BattleEvent,
  BattleState,
  BattleStatus,
  CoffeemonState,
  ExtractPayload,
} from './types/batlle.types';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle) private repo: Repository<Battle>,
    private playerService: PlayerService,
    private battleCache: BattleCacheService,
    private battleTurnManager: BattleTurnManager
  ) {}

  async createBattle(p1: number, p2: number, s1: string, s2: string): Promise<Battle> {
    const battle = this.repo.create({
      player1Id: p1,
      player2Id: p2,
      player1SocketId: s1,
      player2SocketId: s2,
      status: BattleStatus.ACTIVE,
      createdAt: new Date(),
    });
    const savedBattle = await this.repo.save(battle);
    const state = await this.buildInitialState(p1, p2, s1, s2);
    this.battleCache.set(savedBattle.id, state);
    console.log(`Battles: ${JSON.stringify(this.battleCache.getAll(), null, 2)} battles in cache`);
    return savedBattle;
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
      currentPlayerId: p1, //Todo: Decidir de forma mais justa quem começa
      battleStatus: BattleStatus.ACTIVE,
      events: [],
    };
  }

  private mapTeam(team: PlayerCoffeemon[]): {
    activeCoffeemonIndex: number;
    coffeemons: CoffeemonState[];
  } {
    return {
      activeCoffeemonIndex: 0,
      coffeemons: team.map((c) => ({
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
      })),
    };
  }

  async findActiveBattleBySocketId(socketId: string): Promise<Battle | null> {
    return this.repo.findOne({
      where: [
        { player1SocketId: socketId, status: 'ACTIVE' },
        { player2SocketId: socketId, status: 'ACTIVE' },
      ],
    });
  }

  async executeTurn<T extends BattleActionType>(
    battleId: string,
    socketId: string,
    actionType: T,
    payload: ExtractPayload<T>
  ): Promise<{ battleState: BattleState; events: BattleEvent[] }> {
    const battleState = this.battleCache.get(battleId);
    if (!battleState) {
      throw new Error(`Battle with ID ${battleId} not found in cache`);
    }

    const isPlayer1 = battleState.player1SocketId === socketId;
    const isPlayer2 = battleState.player2SocketId === socketId;
    if (!isPlayer1 && !isPlayer2) {
      throw new Error('You are not part of this battle');
    }
    const playerId = isPlayer1 ? battleState.player1Id : battleState.player2Id;

    const updatedState = await this.battleTurnManager.runTurn({
      battleState,
      playerId,
      actionType,
      payload,
    });

    if (updatedState.battleStatus === BattleStatus.FINISHED) {
      if (updatedState.winnerId === undefined) {
        throw new Error("winnerId didn't set in battle state");
      }
      const battle = await this.repo.findOneByOrFail({ id: battleId });
      battle.status = BattleStatus.FINISHED;
      battle.winnerId = updatedState.winnerId;
      battle.endedAt = new Date();
      await this.repo.save(battle);
      this.battleCache.delete(battleId);
    } else {
      this.battleCache.set(battleId, updatedState);
    }

    return { battleState: updatedState, events: updatedState.events };
  }
}
