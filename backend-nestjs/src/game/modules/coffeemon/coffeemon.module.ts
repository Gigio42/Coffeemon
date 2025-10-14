import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { MovesModule } from '../moves/moves.module';
import { CoffeemonController } from './coffeemon.controller';
import { CoffeemonService } from './coffeemon.service';
import { Coffeemon } from './entities/coffeemon.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coffeemon]), AuthModule, MovesModule],
  controllers: [CoffeemonController],
  providers: [CoffeemonService, SeedService],
  exports: [CoffeemonService],
})
export class CoffeemonModule {}
