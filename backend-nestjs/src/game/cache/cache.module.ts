import { Module } from '@nestjs/common';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { BattleCacheService } from './battle-cache.service';
import { RoomCacheService } from './room-cache.service';

@Module({
  imports: [RedisModule],
  providers: [BattleCacheService, RoomCacheService],
  exports: [BattleCacheService, RoomCacheService],
})
export class CacheModule {}
