import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../../ecommerce/users/users.service';
import { CoffeemonService } from '../coffeemon/coffeemon.service';
import {
  CoffeemonLearnsetMove,
  MoveLearnMethod,
} from '../coffeemon/entities/coffeemon-learnset-move.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { PlayerCoffeemonMove } from './entities/playerCoffeemonMove.entity';
import { PlayerCoffeemons } from './entities/playerCoffeemons.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(PlayerCoffeemons)
    private playerCoffeemonRepository: Repository<PlayerCoffeemons>,
    @InjectRepository(PlayerCoffeemonMove)
    private playerCoffeemonMoveRepository: Repository<PlayerCoffeemonMove>,
    @InjectRepository(CoffeemonLearnsetMove)
    private learnsetRepository: Repository<CoffeemonLearnsetMove>,
    private usersService: UsersService,
    private coffeemonService: CoffeemonService
  ) {}

  async create(userId: number, createPlayerDto: CreatePlayerDto): Promise<Player> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existingPlayer = await this.playerRepository.findOne({
      where: { user: { id: userId } },
    });
    if (existingPlayer) {
      throw new BadRequestException(`User with ID ${userId} already is a player`);
    }

    const player = this.playerRepository.create({
      user: { id: userId },
      level: 1,
      experience: 0,
      coins: createPlayerDto.initialCoins || 100,
    });

    const savedPlayer = await this.playerRepository.save(player);

    return savedPlayer;
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['user', 'coffeemons', 'coffeemons.coffeemon'],
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  async findByUserId(userId: number): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['coffeemons', 'coffeemons.coffeemon'],
    });

    if (!player) {
      throw new NotFoundException(`Player with user ID ${userId} not found`);
    }

    return player;
  }

  async getPlayerCoffeemons(playerId: number): Promise<PlayerCoffeemons[]> {
    await this.findOne(playerId);

    return this.playerCoffeemonRepository.find({
      where: { player: { id: playerId } },
      relations: ['coffeemon', 'learnedMoves', 'learnedMoves.move'],
    });
  }

  async getPlayerParty(playerId: number): Promise<PlayerCoffeemons[]> {
    return this.playerCoffeemonRepository.find({
      where: {
        player: { id: playerId },
        isInParty: true,
      },
      relations: ['coffeemon', 'learnedMoves', 'learnedMoves.move'],
    });
  }

  async addCoffeemonToPlayer(playerId: number, coffeemonId: number): Promise<PlayerCoffeemons> {
    const player = await this.findOne(playerId);
    const coffeemonBase = await this.coffeemonService.findOne(coffeemonId);

    const playerCoffeemonInstance = this.playerCoffeemonRepository.create({
      player: player,
      coffeemon: coffeemonBase,
      hp: coffeemonBase.baseHp,
      attack: coffeemonBase.baseAttack,
      defense: coffeemonBase.baseDefense,
      level: 1,
      experience: 0,
      isInParty: false,
      learnedMoves: [],
    });

    const savedPlayerCoffeemon = await this.playerCoffeemonRepository.save(playerCoffeemonInstance);

    const startingMovesLearnset = await this.learnsetRepository.find({
      where: {
        coffeemonId: coffeemonId,
        learnMethod: MoveLearnMethod.START,
        levelLearned: 1,
      },
      relations: ['move'],
      take: 4,
    });

    const initialMovesToAdd = startingMovesLearnset.map((learnsetEntry, index) =>
      this.playerCoffeemonMoveRepository.create({
        playerCoffeemon: savedPlayerCoffeemon,
        move: learnsetEntry.move,
        slot: index + 1,
      })
    );

    if (initialMovesToAdd.length > 0) {
      await this.playerCoffeemonMoveRepository.save(initialMovesToAdd);
      return await this.playerCoffeemonRepository.findOneOrFail({
        where: { id: savedPlayerCoffeemon.id },
        relations: ['coffeemon', 'learnedMoves', 'learnedMoves.move'],
      });
    }

    return savedPlayerCoffeemon;
  }

  async addCoffeemonToParty(
    playerId: number,
    playerCoffeemonId: number
  ): Promise<PlayerCoffeemons> {
    const playerCoffeemon = await this.playerCoffeemonRepository.findOne({
      where: {
        id: playerCoffeemonId,
        player: { id: playerId },
      },
    });

    if (!playerCoffeemon) {
      throw new NotFoundException(
        `Player Coffeemon with ID ${playerCoffeemonId} not found for player with ID ${playerId}`
      );
    }

    if (playerCoffeemon.isInParty) {
      throw new BadRequestException(
        `Player Coffeemon with ID ${playerCoffeemonId} is already in the party.`
      );
    }

    const partyCount = await this.playerCoffeemonRepository.count({
      where: {
        player: { id: playerId },
        isInParty: true,
      },
    });

    const maxPartySize = 3;
    if (partyCount >= maxPartySize) {
      throw new BadRequestException(`Party is full (maximum size: ${maxPartySize}).`);
    }

    playerCoffeemon.isInParty = true;
    return this.playerCoffeemonRepository.save(playerCoffeemon);
  }

  async removeCoffeemonFromParty(
    playerId: number,
    playerCoffeemonId: number
  ): Promise<PlayerCoffeemons> {
    await this.findOne(playerId);

    const playerCoffeemon = await this.playerCoffeemonRepository.findOne({
      where: {
        id: playerCoffeemonId,
        player: { id: playerId },
        isInParty: true,
      },
    });

    if (!playerCoffeemon) {
      throw new NotFoundException(
        `Player Coffeemon with ID ${playerCoffeemonId} not found in the party for player with ID ${playerId}`
      );
    }

    playerCoffeemon.isInParty = false;
    return this.playerCoffeemonRepository.save(playerCoffeemon);
  }
}
