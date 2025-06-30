import { Module } from '@nestjs/common';
import { BattlesModule } from './battles/battles.module';
import { CoffeemonModule } from './coffeemon/coffeemon.module';
import { PlayerModule } from './player/player.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [CoffeemonModule, PlayerModule, BattlesModule, MatchmakingModule],
  providers: [GameGateway],
  exports: [CoffeemonModule, PlayerModule, BattlesModule, MatchmakingModule],
})
export class GameModule {}
