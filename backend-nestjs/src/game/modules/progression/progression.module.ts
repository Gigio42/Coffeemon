import { Module } from '@nestjs/common';
import { CoffeemonModule } from '../coffeemon/coffeemon.module';
import { PlayerModule } from '../player/player.module';
import { ProgressionService } from './progression.service';

@Module({
  imports: [PlayerModule, CoffeemonModule],
  providers: [ProgressionService],
})
export class ProgressionModule {}
