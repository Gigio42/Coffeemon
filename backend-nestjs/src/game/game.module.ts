import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../ecommerce/users/users.module';
import { BattlesModule } from './battles/battles.module';
import { CoffeemonModule } from './coffeemon/coffeemon.module';
import { GameGateway } from './game.gateway';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { PlayerModule } from './player/player.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CoffeemonModule,
    PlayerModule,
    BattlesModule,
    MatchmakingModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  providers: [GameGateway],
})
export class GameModule {}
