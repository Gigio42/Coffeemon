import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../ecommerce/users/users.module';
import { I18nModule } from '../i18n/i18n.module';
import { GameGateway } from './game.gateway';
import { BattlesModule } from './modules/battles/battles.module';
import { CoffeemonModule } from './modules/coffeemon/coffeemon.module';
import { MatchmakingModule } from './modules/matchmaking/matchmaking.module';
import { PlayerModule } from './modules/player/player.module';
import { ProgressionModule } from './modules/progression/progression.module';
import { CacheModule } from './shared/cache/cache.module';
import { NotificationsModule } from './shared/notifications/notifications.module';

@Module({
  imports: [
    I18nModule,
    EventEmitterModule.forRoot(),
    CoffeemonModule,
    PlayerModule,
    BattlesModule,
    ProgressionModule,
    MatchmakingModule,
    NotificationsModule,
    CacheModule,
    AuthModule,
    UsersModule,
  ],
  providers: [GameGateway],
})
export class GameModule {}
