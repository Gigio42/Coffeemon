import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PlayerCreatedEvent, PlayerInventoryUpdateEvent } from '../../shared/events/game.events';
import { CoffeemonService } from '../coffeemon/coffeemon.service';
import { Coffeemon, CoffeemonType } from '../coffeemon/entities/coffeemon.entity';
import { Item } from '../items/item.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerCoffeemons } from '../player/entities/playerCoffeemons.entity';
import { PlayerService } from '../player/player.service';
import { ProductType } from './dto/buy-product.dto';
import { GachaPack } from './entities/gacha-pack.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(GachaPack)
    private readonly gachaPackRepository: Repository<GachaPack>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
    private readonly playerService: PlayerService,
    private readonly coffeemonService: CoffeemonService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async findAllPacks(): Promise<GachaPack[]> {
    return this.gachaPackRepository.find();
  }

  @OnEvent('player.created')
  async handlePlayerCreation(event: PlayerCreatedEvent) {
    const { playerId } = event;

    try {
      const player = await this.entityManager.findOne(Player, {
        where: { id: playerId },
      });

      if (player) {
        player.coins += 300;
        await this.entityManager.save(Player, player);
        console.log(`[ShopService] 300 moedas adicionadas ao jogador ${playerId}`);
      }
    } catch (error) {
      console.error(`[ShopService] Falha ao dar moedas iniciais para o player ${playerId}`, error);
    }
  }

  async awardPack(playerId: number, pack: GachaPack): Promise<PlayerCoffeemons> {
    const selectedType = this.determineRandomType(pack.notes);
    const coffeemonToAward = await this.getRandomCoffeemonOfType(selectedType);
    return this.playerService.addCoffeemonToPlayer(playerId, coffeemonToAward.id);
  }

  async buyProduct(
    userId: number,
    productId: string,
    productType: ProductType
  ): Promise<Player | PlayerCoffeemons> {
    let product: GachaPack | Item;

    if (productType === ProductType.GACHA) {
      const gachaProduct = await this.gachaPackRepository.findOneBy({ id: productId });
      if (!gachaProduct) {
        throw new NotFoundException(`Pacote Gacha '${productId}' não encontrado.`);
      }
      product = gachaProduct;
    } else if (productType === ProductType.ITEM) {
      const itemProduct = await this.itemRepository.findOneBy({ id: productId });
      if (!itemProduct) {
        throw new NotFoundException(`Item '${productId}' não encontrado.`);
      }
      product = itemProduct;
    } else {
      throw new BadRequestException('Tipo de produto inválido.');
    }

    const cost = product.cost;

    const result = await this.entityManager.transaction(async (transactionalEM) => {
      const playerRepo = transactionalEM.getRepository(Player);
      const player = await playerRepo.findOne({ where: { user: { id: userId } } });

      if (!player) throw new NotFoundException('Jogador não encontrado.');
      if (player.coins < cost) throw new BadRequestException('Moedas insuficientes.');

      player.coins -= cost;

      if (productType === ProductType.GACHA) {
        await playerRepo.save(player);
        const newCoffeemon = await this.grantGachaReward(
          player.id,
          product as GachaPack,
          transactionalEM
        );

        this.eventEmitter.emit(
          'player.inventory.update',
          new PlayerInventoryUpdateEvent(player.id, player)
        );
        return newCoffeemon;
      } else if (productType === ProductType.ITEM) {
        if (!player.inventory) {
          player.inventory = {};
        }
        const currentQuantity = player.inventory[product.id] || 0;
        player.inventory[product.id] = currentQuantity + 1;

        const updatedPlayer = await playerRepo.save(player);

        this.eventEmitter.emit(
          'player.inventory.update',
          new PlayerInventoryUpdateEvent(player.id, updatedPlayer)
        );
        return updatedPlayer;
      } else {
        throw new BadRequestException('Tipo de produto inválido.');
      }
    });

    return result;
  }

  private async grantGachaReward(
    playerId: number,
    pack: GachaPack,
    transactionalEM: EntityManager
  ): Promise<PlayerCoffeemons> {
    const selectedType = this.determineRandomType(pack.notes);
    const coffeemonToAward = await this.getRandomCoffeemonOfType(selectedType);

    return this.playerService.addCoffeemonToPlayer(playerId, coffeemonToAward.id, transactionalEM);
  }

  private determineRandomType(notes: CoffeemonType[]): CoffeemonType {
    if (!notes || notes.length === 0) {
      throw new Error('Pacote de Gacha não tem notas (tipos) definidos.');
    }
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  }

  private async getRandomCoffeemonOfType(type: CoffeemonType): Promise<Coffeemon> {
    const availableCoffeemons = await this.coffeemonService.findByType(type);
    if (availableCoffeemons.length === 0) {
      throw new NotFoundException(`Nenhum Coffeemon encontrado para o tipo '${type}'.`);
    }
    const randomIndex = Math.floor(Math.random() * availableCoffeemons.length);
    return availableCoffeemons[randomIndex];
  }
}
