import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleCacheService } from '../cache/battle-cache.service';
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
} from './types/batlle.types';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle) private repo: Repository<Battle>,
    private playerService: PlayerService,
    private battleCache: BattleCacheService,
    private battleTurnManager: BattleTurnManager
  ) {}

  async createBattle(
    player1Id: number,
    player2Id: number,
    player1SocketId: string,
    player2SocketId: string
  ): Promise<{
    savedBattle: Battle;
    state: BattleState;
  }> {
    const battle = this.repo.create({
      player1Id,
      player2Id,
      player1SocketId,
      player2SocketId,
      status: BattleStatus.ACTIVE,
      createdAt: new Date(),
    });

    const savedBattle = await this.repo.save(battle);
    const state = await this.buildInitialState(
      player1Id,
      player2Id,
      player1SocketId,
      player2SocketId
    );

    await this.battleCache.set(savedBattle.id, state);

    //printando tds os battles no redis
    const allBattles = await this.battleCache.getAll();
    console.log(`Battles: ${allBattles.length} battles in Redis cache`);

    return { savedBattle, state };
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

  private mapTeam(team: PlayerCoffeemons[]): {
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
    playerId: number,
    actionType: T,
    payload: ExtractPayload<T>
  ): Promise<{ battleState: BattleState }> {
    const battleState = await this.battleCache.get(battleId);
    if (!battleState) {
      throw new Error(`Battle with ID ${battleId} not found in cache`);
    }

    const isPlayer1 = battleState.player1Id === playerId;
    const isPlayer2 = battleState.player2Id === playerId;
    if (!isPlayer1 && !isPlayer2) {
      throw new Error('You are not part of this battle');
    }

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
      await this.battleCache.delete(battleId);
    } else {
      await this.battleCache.set(battleId, updatedState);
    }

    return { battleState: updatedState };
  }

  async updatePlayerSocketId(battleId: string, playerId: number, socketId: string): Promise<void> {
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

  async getBattleState(battleId: string): Promise<BattleState | null> {
    try {
      const battleState = await this.battleCache.get(battleId);

      if (!battleState) {
        console.log(`Estado da batalha ${battleId} não encontrado no cache`);
        return null;
      }

      return battleState;
    } catch (error) {
      console.error(`Erro ao buscar estado da batalha ${battleId}:`, error);
      return null;
    }
  }
}
