import { Module } from '@nestjs/common';
import { GameAuthModule } from '../auth/game-auth.module';
import { BattlesModule } from '../battles/battles.module';
import { CacheModule } from '../cache/cache.module';
import { PlayerModule } from '../player/player.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [GameAuthModule, PlayerModule, BattlesModule, CacheModule],
  providers: [MatchmakingService, MatchmakingGateway],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
