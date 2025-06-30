import { Module } from '@nestjs/common';
import { BattlesModule } from '../battles/battles.module';
import { CacheModule } from '../cache/cache.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [BattlesModule, CacheModule],
  providers: [MatchmakingService, MatchmakingGateway],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
