import { Module } from '@nestjs/common';
import { GameAuthModule } from '../../shared/auth/game-auth.module';
import { CacheModule } from '../../shared/cache/cache.module';
import { PlayerModule } from '../player/player.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [GameAuthModule, PlayerModule, CacheModule],
  providers: [MatchmakingService, MatchmakingGateway],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
