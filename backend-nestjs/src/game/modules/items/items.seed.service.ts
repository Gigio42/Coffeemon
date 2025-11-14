import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import * as itemData from '../../data/items.data.json';

@Injectable()
export class ItemsSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  async onModuleInit() {
    const count = await this.itemRepository.count();
    if (count === 0) {
      console.log('[ItemsSeedService] Populando Itens...');
      await this.itemRepository.save(itemData);
      console.log('[ItemsSeedService] Itens populados com sucesso.');
    }
  }
}
