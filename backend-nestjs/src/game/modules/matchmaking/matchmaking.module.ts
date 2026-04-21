import { Module } from '@nestjs/common';
import { GameAuthModule } from '../../shared/auth/game-auth.module';
import { CacheModule } from '../../shared/cache/cache.module';
import { PlayerModule } from '../player/player.module';
import { RedisModule } from '../../../infrastructure/redis/redis.module';
import { LobbyService } from './lobby.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [GameAuthModule, PlayerModule, CacheModule, RedisModule],
  providers: [MatchmakingService, MatchmakingGateway, LobbyService],
  exports: [MatchmakingService, LobbyService],
})
export class MatchmakingModule {}
