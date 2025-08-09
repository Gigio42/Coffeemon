import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/users.service';
import { CoffeemonService } from '../coffeemon/coffeemon.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { PlayerCoffeemons } from './entities/playerCoffeemons.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(PlayerCoffeemons)
    private playerCoffeemonRepository: Repository<PlayerCoffeemons>,
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
      relations: ['coffeemon'],
    });
  }

  async getPlayerParty(playerId: number): Promise<PlayerCoffeemons[]> {
    await this.findOne(playerId);

    return this.playerCoffeemonRepository.find({
      where: {
        player: { id: playerId },
        isInParty: true,
      },
      relations: ['coffeemon'],
    });
  }

  async addCoffeemonToPlayer(playerId: number, coffeemonId: number): Promise<PlayerCoffeemons> {
    await this.findOne(playerId);

    const coffeemon = await this.coffeemonService.findOne(coffeemonId);

    const playerCoffeemon = this.playerCoffeemonRepository.create({
      player: { id: playerId },
      coffeemon: { id: coffeemonId },
      hp: coffeemon.baseHp,
      attack: coffeemon.baseAttack,
      defense: coffeemon.baseDefense,
      level: 1,
      experience: 0,
      isInParty: false,
    });

    return this.playerCoffeemonRepository.save(playerCoffeemon);
  }

  async addCoffeemonToParty(playerId: number, playerCoffeemonId: number): Promise<PlayerCoffeemons> {
    await this.findOne(playerId);

    const playerCoffeemon = await this.playerCoffeemonRepository.findOne({
      where: {
        id: playerCoffeemonId,
        player: { id: playerId },
      },
    });

    if (!playerCoffeemon) {
      throw new NotFoundException(
        `Coffeemon ID ${playerCoffeemonId} not found for player with ID ${playerId}`
      );
    }

    if (playerCoffeemon.isInParty) {
      throw new BadRequestException(
        `Coffeemon ID ${playerCoffeemonId} is already in the party for player with ID ${playerId}`
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
      throw new BadRequestException(`You can only have ${maxPartySize} Coffeemons in your party`);
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
        `Coffeemon ID ${playerCoffeemonId} not found in party for player with ID ${playerId}`
      );
    }

    playerCoffeemon.isInParty = false;
    return this.playerCoffeemonRepository.save(playerCoffeemon);
  }

  // TODO implementar logica de ganhar xp, moedas e coffeemons
  // async updatePlayerExperience(playerId: number, amount: number): Promise<Player> {
  //   const player = await this.findOne(playerId);

  //   player.experience += amount;

  //   const xpNeededForNextLevel = player.level * 100;

  //   if (player.experience >= xpNeededForNextLevel) {
  //     player.level += 1;
  //     player.experience -= xpNeededForNextLevel;
  //     // TODO Bonuses
  //   }

  //   return this.playerRepository.save(player);
  // }

  // async updatePlayerCoins(playerId: number, amount: number): Promise<Player> {
  //   const player = await this.findOne(playerId);

  //   player.coins += amount;

  //   if (player.coins < 0) {
  //     player.coins = 0;
  //   }

  //   return this.playerRepository.save(player);
  // }
}
