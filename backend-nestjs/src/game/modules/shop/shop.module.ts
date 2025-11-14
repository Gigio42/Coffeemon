import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { CoffeemonModule } from '../coffeemon/coffeemon.module';
import { ItemsModule } from '../items/items.module';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';
import { GachaPack } from './entities/gacha-pack.entity';
import { ShopController } from './shop.controller';
import { ShopSeedService } from './shop.seed.service';
import { ShopService } from './shop.service';

@Module({
  imports: [
    PlayerModule,
    CoffeemonModule,
    AuthModule,
    ItemsModule,
    TypeOrmModule.forFeature([Player, GachaPack]),
  ],
  controllers: [ShopController],
  providers: [ShopService, ShopSeedService],
  exports: [ShopService],
})
export class ShopModule {}
