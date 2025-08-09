import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { BattlesModule } from './battles/battles.module';
import { CoffeemonModule } from './coffeemon/coffeemon.module';
import { GameGateway } from './game.gateway';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    CoffeemonModule,
    PlayerModule,
    BattlesModule,
    MatchmakingModule,
    AuthModule,
    UsersModule,
  ],
  providers: [GameGateway],
  exports: [CoffeemonModule, PlayerModule, BattlesModule, MatchmakingModule],
})
export class GameModule {}
