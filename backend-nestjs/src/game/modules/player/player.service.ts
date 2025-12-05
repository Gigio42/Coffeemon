import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerCreatedEvent } from 'src/game/shared/events/game.events';
import { EntityManager, Repository } from 'typeorm';
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
    private coffeemonService: CoffeemonService,
    private eventEmitter: EventEmitter2
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
      coins: createPlayerDto.initialCoins || 0,
      inventory: {
        small_potion: 5,
        revive_bean: 2,
        antidote_espresso: 3,
      },
    });

    const savedPlayer = await this.playerRepository.save(player);

    this.eventEmitter.emit('player.created', new PlayerCreatedEvent(savedPlayer.id, userId));

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
      relations: [
        'user',
        'coffeemons',
        'coffeemons.coffeemon',
        'coffeemons.learnedMoves',
        'coffeemons.learnedMoves.move',
      ],
    });

    if (!player) {
      throw new NotFoundException(`Player with user ID ${userId} not found`);
    }

    return player;
  }

  async getPlayerCoffeemons(playerId: number): Promise<PlayerCoffeemons[]> {
    await this.findOne(playerId);

    const coffeemons = await this.playerCoffeemonRepository
      .createQueryBuilder('pc')
      .leftJoinAndSelect('pc.coffeemon', 'coffeemon')
      .leftJoinAndSelect('pc.learnedMoves', 'learnedMoves')
      .leftJoinAndSelect('learnedMoves.move', 'move')
      .where('pc.player.id = :playerId', { playerId })
      .getMany();

    return coffeemons;
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

  async addCoffeemonToPlayer(
    playerId: number,
    coffeemonId: number,
    transactionalEM?: EntityManager
  ): Promise<PlayerCoffeemons> {
    if (!playerId || isNaN(playerId)) {
      throw new BadRequestException(`Invalid playerId: ${playerId}`);
    }
    if (!coffeemonId || isNaN(coffeemonId)) {
      throw new BadRequestException(`Invalid coffeemonId: ${coffeemonId}`);
    }

    const playerCoffeemonRepo = transactionalEM
      ? transactionalEM.getRepository(PlayerCoffeemons)
      : this.playerCoffeemonRepository;

    const playerCoffeemonMoveRepo = transactionalEM
      ? transactionalEM.getRepository(PlayerCoffeemonMove)
      : this.playerCoffeemonMoveRepository;

    const player = await this.findOne(playerId);
    const coffeemonBase = await this.coffeemonService.findOne(coffeemonId);

    const playerCoffeemonInstance = playerCoffeemonRepo.create({
      player: player,
      coffeemon: coffeemonBase,
      level: 1,
      experience: 0,
      isInParty: false,
      evs: { hp: 0, attack: 0, defense: 0, speed: 0 },
      learnedMoves: [],
    });

    const savedPlayerCoffeemon = await playerCoffeemonRepo.save(playerCoffeemonInstance);

    const startingMovesLearnset = await this.learnsetRepository.find({
      where: {
        coffeemon: { id: coffeemonId },
        learnMethod: MoveLearnMethod.START,
        levelLearned: 1,
      },
      relations: ['move'],
      take: 4,
    });

    const initialMovesToAdd = startingMovesLearnset.map((learnsetEntry, index) =>
      playerCoffeemonMoveRepo.create({
        playerCoffeemon: savedPlayerCoffeemon,
        move: learnsetEntry.move,
        slot: index + 1,
      })
    );

    if (initialMovesToAdd.length > 0) {
      await playerCoffeemonMoveRepo.save(initialMovesToAdd);

      return await playerCoffeemonRepo.findOneOrFail({
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

  async updateInventory(
    playerId: number,
    itemId: string,
    quantity: number,
    transactionalEM?: EntityManager
  ): Promise<Player> {
    const repo = transactionalEM ? transactionalEM.getRepository(Player) : this.playerRepository;

    const player = await repo.findOneBy({ id: playerId });
    if (!player) {
      throw new NotFoundException(`Jogador com ID ${playerId} não encontrado.`);
    }

    if (!player.inventory) {
      player.inventory = {};
    }

    const currentQuantity = player.inventory[itemId] || 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity < 0) {
      throw new BadRequestException(`Quantidade insuficiente de ${itemId} para remover.`);
    }

    if (newQuantity === 0) {
      delete player.inventory[itemId];
    } else {
      player.inventory[itemId] = newQuantity;
    }

    return repo.save(player);
  }

  //STUB APENAS PARA TESTES!!! - REMOVER DEPOIS (Gigio)
  async giveAllCoffeemonsToPlayer(playerId: number): Promise<number> {
    const allCoffeemons = await this.coffeemonService.findAll();
    const existingCoffeemons = await this.playerCoffeemonRepository.find({
      where: { player: { id: playerId } },
      select: ['id'],
      relations: ['coffeemon'],
    });
    const existingCoffeemonIds = new Set(existingCoffeemons.map((pc) => pc.coffeemon.id));
    let addedCount = 0;
    for (const coffeemon of allCoffeemons) {
      if (!coffeemon || !coffeemon.id || isNaN(coffeemon.id)) {
        continue;
      }
      if (!existingCoffeemonIds.has(coffeemon.id)) {
        await this.addCoffeemonToPlayer(playerId, coffeemon.id);
        addedCount++;
      }
    }
    return addedCount;
  }

  //STUB APENAS PARA TESTES!!! - ADICIONAR ITENS
  async addItemsToPlayer(playerId: number, items: Record<string, number>): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id: playerId });
    if (!player) {
      throw new NotFoundException(`Player com ID ${playerId} não encontrado.`);
    }

    if (!player.inventory) {
      player.inventory = {};
    }

    // Adicionar cada item ao inventário
    Object.entries(items).forEach(([itemId, quantity]) => {
      const currentQuantity = player.inventory[itemId] || 0;
      player.inventory[itemId] = currentQuantity + quantity;
    });

    return this.playerRepository.save(player);
  }

  /**
   * Consome uma unidade de um item do inventário do jogador
   */
  async consumeItem(playerId: number, itemId: string): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id: playerId });
    if (!player) {
      throw new NotFoundException(`Player com ID ${playerId} não encontrado.`);
    }

    if (!player.inventory || !player.inventory[itemId] || player.inventory[itemId] <= 0) {
      throw new NotFoundException(`Player não possui o item ${itemId}.`);
    }

    // Decrementar a quantidade do item
    player.inventory[itemId]--;

    // Remover item do inventário se a quantidade for 0
    if (player.inventory[itemId] === 0) {
      delete player.inventory[itemId];
    }

    return this.playerRepository.save(player);
  }

  /**
   * Atualiza os moves equipados de um PlayerCoffeemon
   */
  async updateCoffeemonMoves(
    playerId: number,
    playerCoffeemonId: number,
    moveIds: number[]
  ): Promise<PlayerCoffeemons> {
    // Validar que tem entre 1 e 4 moves
    if (moveIds.length < 1 || moveIds.length > 4) {
      throw new BadRequestException('O Coffeemon deve ter entre 1 e 4 moves equipados');
    }

    // Buscar o PlayerCoffeemon
    const playerCoffeemon = await this.playerCoffeemonRepository.findOne({
      where: {
        id: playerCoffeemonId,
        player: { id: playerId },
      },
      relations: ['coffeemon', 'learnedMoves', 'learnedMoves.move'],
    });

    if (!playerCoffeemon) {
      throw new NotFoundException(
        `Player Coffeemon com ID ${playerCoffeemonId} não encontrado para o player ${playerId}`
      );
    }

    // Buscar todos os moves disponíveis no learnset do Coffeemon
    const availableMoves = await this.learnsetRepository.find({
      where: {
        coffeemon: { id: playerCoffeemon.coffeemon.id },
      },
      relations: ['move'],
    });

    const availableMoveIds = new Set(availableMoves.map((lm) => lm.move.id));

    // Validar que todos os moves pertencem ao learnset do Coffeemon
    for (const moveId of moveIds) {
      if (!availableMoveIds.has(moveId)) {
        throw new BadRequestException(
          `Move com ID ${moveId} não está disponível para ${playerCoffeemon.coffeemon.name}`
        );
      }
    }

    // Validar que não há moves duplicados
    const uniqueMoveIds = new Set(moveIds);
    if (uniqueMoveIds.size !== moveIds.length) {
      throw new BadRequestException('Não é permitido equipar o mesmo move mais de uma vez');
    }

    // Remover todos os moves atuais
    await this.playerCoffeemonMoveRepository.delete({
      playerCoffeemon: { id: playerCoffeemonId },
    });

    // Adicionar os novos moves nos slots corretos
    const newMoves = moveIds.map((moveId, index) =>
      this.playerCoffeemonMoveRepository.create({
        playerCoffeemon: { id: playerCoffeemonId },
        move: { id: moveId },
        slot: index + 1,
      })
    );

    await this.playerCoffeemonMoveRepository.save(newMoves);

    // Retornar o PlayerCoffeemon atualizado
    const updated = await this.playerCoffeemonRepository.findOne({
      where: { id: playerCoffeemonId },
      relations: ['coffeemon', 'learnedMoves', 'learnedMoves.move'],
    });

    if (!updated) {
      throw new NotFoundException(`PlayerCoffeemon com ID ${playerCoffeemonId} não encontrado`);
    }

    return updated;
  }

  /**
   * Retorna todos os moves disponíveis para um PlayerCoffeemon
   * Filtra baseado no nível atual do Coffeemon
   */
  async getAvailableMovesForCoffeemon(playerId: number, playerCoffeemonId: number): Promise<any[]> {
    const playerCoffeemon = await this.playerCoffeemonRepository.findOne({
      where: {
        id: playerCoffeemonId,
        player: { id: playerId },
      },
      relations: ['coffeemon'],
    });

    if (!playerCoffeemon) {
      throw new NotFoundException(
        `Player Coffeemon com ID ${playerCoffeemonId} não encontrado para o player ${playerId}`
      );
    }

    // Buscar todos os moves do learnset
    const allMoves = await this.learnsetRepository.find({
      where: {
        coffeemon: { id: playerCoffeemon.coffeemon.id },
      },
      relations: ['move'],
      order: {
        levelLearned: 'ASC',
        move: { name: 'ASC' },
      },
    });

    // Filtrar moves que já foram desbloqueados
    const unlockedMoves = allMoves.filter((lm) => {
      // Moves de START são sempre disponíveis
      if (lm.learnMethod === MoveLearnMethod.START) {
        return true;
      }

      // Moves de LEVEL_UP só são disponíveis se o nível foi atingido
      if (lm.learnMethod === MoveLearnMethod.LEVEL_UP) {
        return (
          lm.levelLearned !== null &&
          lm.levelLearned !== undefined &&
          lm.levelLearned <= playerCoffeemon.level
        );
      }

      // Moves de EVOLUTION, MACHINE, TUTOR, EGG podem ser adicionados conforme a lógica do jogo
      // Por enquanto, vamos permitir apenas START e LEVEL_UP
      return false;
    });

    return unlockedMoves.map((lm) => ({
      id: lm.move.id,
      name: lm.move.name,
      description: lm.move.description,
      power: lm.move.power,
      category: lm.move.category,
      elementalType: lm.move.elementalType,
      learnMethod: lm.learnMethod,
      levelLearned: lm.levelLearned,
    }));
  }
}
