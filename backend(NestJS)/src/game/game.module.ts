import { Module } from '@nestjs/common';
import { BattlesModule } from './battles/battles.module';
import { CoffeemonModule } from './coffeemon/coffeemon.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [CoffeemonModule, PlayerModule, BattlesModule],
  exports: [CoffeemonModule, PlayerModule, BattlesModule],
})
export class GameModule {}
