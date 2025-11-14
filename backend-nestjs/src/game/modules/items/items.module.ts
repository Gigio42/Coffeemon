import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { Item } from './item.entity';
import { ItemsController } from './items.controller';
import { ItemsSeedService } from './items.seed.service';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), AuthModule],
  providers: [ItemsService, ItemsSeedService],
  controllers: [ItemsController],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}
