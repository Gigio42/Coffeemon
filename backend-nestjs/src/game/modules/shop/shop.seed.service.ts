import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as packData from '../../data/gacha-packs.data.json';
import { GachaPack } from './entities/gacha-pack.entity';

@Injectable()
export class ShopSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(GachaPack)
    private readonly gachaPackRepository: Repository<GachaPack>
  ) {}

  async onModuleInit() {
    const count = await this.gachaPackRepository.count();
    if (count === 0) {
      await this.seedPacks();
    }
  }

  private async seedPacks() {
    try {
      await this.gachaPackRepository.save(packData as any);
      console.log('[ShopSeedService] GachaPacks populados com sucesso.');
    } catch (error) {
      console.error('[ShopSeedService] Erro ao popular GachaPacks:', error);
    }
  }
}
