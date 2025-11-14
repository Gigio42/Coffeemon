import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BattleEndedEvent,
  CoffeemonLearnedMoveEvent,
  CoffeemonLeveledUpEvent,
  PlayerInventoryUpdateEvent,
  PlayerLeveledUpEvent,
} from 'src/game/shared/events/game.events';
import { Repository } from 'typeorm';
import {
  CoffeemonLearnsetMove,
  MoveLearnMethod,
} from '../coffeemon/entities/coffeemon-learnset-move.entity';
import { StatsCalculatorService } from '../coffeemon/services/stats-calculator.service';
import { Player, PlayerInventory } from '../player/entities/player.entity';
import { PlayerCoffeemonMove } from '../player/entities/playerCoffeemonMove.entity';
import { PlayerCoffeemons } from '../player/entities/playerCoffeemons.entity';

@Injectable()
export class ProgressionService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(PlayerCoffeemons)
    private playerCoffeemonRepository: Repository<PlayerCoffeemons>,
    @InjectRepository(PlayerCoffeemonMove)
    private playerCoffeemonMoveRepository: Repository<PlayerCoffeemonMove>,
    @InjectRepository(CoffeemonLearnsetMove)
    private learnsetRepository: Repository<CoffeemonLearnsetMove>,
    private readonly statsCalculator: StatsCalculatorService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent('battle.ended')
  async handleBattleEnded(event: BattleEndedEvent): Promise<void> {
    const { battleState, winnerId } = event;
    const { player1Id, player2Id } = battleState;
    const isBotBattle = battleState.isBotBattle || false;

    const COFFEEMON_XP_WIN = isBotBattle ? 800 : 1200;
    const COFFEEMON_XP_LOSS = isBotBattle ? 300 : 500;
    const PLAYER_XP_WIN = isBotBattle ? 80 : 120;
    const PLAYER_XP_LOSS = isBotBattle ? 30 : 50;

    const PLAYER_COIN_WIN = isBotBattle ? 100 : 150;
    const PLAYER_COIN_LOSS = isBotBattle ? 25 : 50;

    const winnerIdFinal = winnerId;
    const loserIdFinal = winnerId === player1Id ? player2Id : player1Id;

    if (winnerIdFinal > 0) {
      const winnerParty = await this.getPlayerParty(winnerIdFinal);
      for (const pc of winnerParty) {
        await this.awardCoffeemonExpAndProcessLevelUp(pc, COFFEEMON_XP_WIN, winnerIdFinal);
      }
      await this.awardPlayerExpAndProcessLevelUp(winnerIdFinal, PLAYER_XP_WIN);
      await this.awardPlayerCoins(winnerIdFinal, PLAYER_COIN_WIN);
    }
    if (loserIdFinal > 0) {
      const loserParty = await this.getPlayerParty(loserIdFinal);
      for (const pc of loserParty) {
        await this.awardCoffeemonExpAndProcessLevelUp(pc, COFFEEMON_XP_LOSS, loserIdFinal);
      }
      await this.awardPlayerExpAndProcessLevelUp(loserIdFinal, PLAYER_XP_LOSS);
      await this.awardPlayerCoins(loserIdFinal, PLAYER_COIN_LOSS);
    }

    if (battleState.player1Id > 0) {
      await this.syncInventory(battleState.player1Id, battleState.player1.inventory);
    }
    if (battleState.player2Id > 0) {
      await this.syncInventory(battleState.player2Id, battleState.player2.inventory);
    }
  }

  private async awardPlayerCoins(playerId: number, amount: number): Promise<void> {
    if (amount <= 0) return;

    try {
      const player = await this.playerRepository.findOneBy({ id: playerId });
      if (!player) {
        console.warn(`[ProgressionService] Player ${playerId} not found, cannot award coins.`);
        return;
      }

      player.coins += amount;
      const updatedPlayer = await this.playerRepository.save(player);

      this.eventEmitter.emit(
        'player.inventory.update',
        new PlayerInventoryUpdateEvent(player.id, updatedPlayer)
      );
    } catch (error) {
      console.error(`[ProgressionService] Falha ao dar moedas para player ${playerId}:`, error);
    }
  }

  private async getPlayerParty(playerId: number): Promise<PlayerCoffeemons[]> {
    return this.playerCoffeemonRepository.find({
      where: {
        player: { id: playerId },
        isInParty: true,
      },
      relations: ['coffeemon', 'learnedMoves', 'learnedMoves.move'],
    });
  }

  private async syncInventory(playerId: number, battleInventory: PlayerInventory) {
    try {
      const player = await this.playerRepository.findOneBy({ id: playerId });
      if (player) {
        player.inventory = battleInventory;
        await this.playerRepository.save(player);
      }
    } catch (error) {
      console.error(
        `[ProgressionService] Falha ao sincronizar inventário para player ${playerId}:`,
        error
      );
    }
  }

  public async awardPlayerExpAndProcessLevelUp(
    playerId: number,
    expGained: number
  ): Promise<Player | null> {
    const player = await this.playerRepository.findOneBy({ id: playerId });
    const MAX_LEVEL = 100;

    if (!player || expGained <= 0 || player.level >= MAX_LEVEL) {
      return player;
    }
    player.experience += expGained;
    let currentLevel = player.level;
    while (currentLevel < MAX_LEVEL) {
      const expToNextLevel = this.statsCalculator.calculateTotalExpForLevel(currentLevel + 1);
      if (player.experience < expToNextLevel) break;
      currentLevel++;
      player.level = currentLevel;
      this.eventEmitter.emit('player.leveled.up', new PlayerLeveledUpEvent(playerId, currentLevel));
    }
    return this.playerRepository.save(player);
  }

  public async awardCoffeemonExpAndProcessLevelUp(
    playerCoffeemon: PlayerCoffeemons,
    expGained: number,
    playerId: number
  ): Promise<PlayerCoffeemons> {
    if (expGained <= 0 || playerCoffeemon.level >= 100) {
      return playerCoffeemon;
    }
    playerCoffeemon.experience += expGained;
    let currentLevel = playerCoffeemon.level;
    while (currentLevel < 100) {
      const expToNextLevel = this.statsCalculator.calculateTotalExpForLevel(currentLevel + 1);
      if (playerCoffeemon.experience < expToNextLevel) break;
      currentLevel++;
      playerCoffeemon.level = currentLevel;
      this.eventEmitter.emit(
        'coffeemon.leveled.up',
        new CoffeemonLeveledUpEvent(playerId, playerCoffeemon.id, currentLevel, expGained)
      );
      await this.learnNewMoves(playerCoffeemon, currentLevel, playerId);
    }
    return this.playerCoffeemonRepository.save(playerCoffeemon);
  }

  private async learnNewMoves(
    playerCoffeemon: PlayerCoffeemons,
    newLevel: number,
    playerId: number
  ): Promise<void> {
    const coffeemonId = playerCoffeemon.coffeemon.id;
    const movesToLearn = await this.learnsetRepository.find({
      where: {
        coffeemon: { id: coffeemonId },
        learnMethod: MoveLearnMethod.LEVEL_UP,
        levelLearned: newLevel,
      },
      relations: ['move'],
    });
    const currentMoveIds = playerCoffeemon.learnedMoves.map((lm) => lm.move.id);
    for (const learnEntry of movesToLearn) {
      const move = learnEntry.move;
      if (!currentMoveIds.includes(move.id)) {
        if (playerCoffeemon.learnedMoves.length >= 4) {
          const oldestMove = playerCoffeemon.learnedMoves.reduce((oldest, current) =>
            oldest.slot < current.slot ? oldest : current
          );
          await this.playerCoffeemonMoveRepository.remove(oldestMove);
          playerCoffeemon.learnedMoves = playerCoffeemon.learnedMoves.filter(
            (lm) => lm.id !== oldestMove.id
          );
        }
        const newPlayerMove = this.playerCoffeemonMoveRepository.create({
          playerCoffeemon: playerCoffeemon,
          move: move,
          slot: playerCoffeemon.learnedMoves.length + 1,
        });
        await this.playerCoffeemonMoveRepository.save(newPlayerMove);
        playerCoffeemon.learnedMoves.push(newPlayerMove);
        this.eventEmitter.emit(
          'coffeemon.learned.move',
          new CoffeemonLearnedMoveEvent(playerId, playerCoffeemon.id, move.name)
        );
      }
    }
  }
}
