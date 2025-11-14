import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { MovesModule } from '../moves/moves.module';
import { CoffeemonController } from './coffeemon.controller';
import { CoffeemonService } from './coffeemon.service';
import { CoffeemonLearnsetMove } from './entities/coffeemon-learnset-move.entity';
import { Coffeemon } from './entities/coffeemon.entity';
import { SeedService } from './seed.service';
import { StatsCalculatorService } from './services/stats-calculator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coffeemon, CoffeemonLearnsetMove]), AuthModule, MovesModule],
  controllers: [CoffeemonController],
  providers: [CoffeemonService, SeedService, StatsCalculatorService],
  exports: [CoffeemonService, TypeOrmModule, StatsCalculatorService],
})
export class CoffeemonModule {}
