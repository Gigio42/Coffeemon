import { Module } from '@nestjs/common';
import { BattlesModule } from '../battles/battles.module';
import { CacheModule } from '../cache/cache.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../ecommerce/users/users.module';

@Module({
  imports: [BattlesModule, CacheModule, AuthModule, UsersModule],
  providers: [MatchmakingService, MatchmakingGateway],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
