import { Module } from '@nestjs/common';
import { RedisModule } from '../../../infrastructure/redis/redis.module';
import { BattleCacheService } from './services/battle-cache.service';
import { RoomCacheService } from './services/room-cache.service';

@Module({
  imports: [RedisModule],
  providers: [BattleCacheService, RoomCacheService],
  exports: [BattleCacheService, RoomCacheService],
})
export class CacheModule {}
