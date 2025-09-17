import { Module } from '@nestjs/common';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { BattleCacheService } from './battle-cache.service';
import { QueueCacheService } from './queue-cache.service';

@Module({
  imports: [RedisModule],
  providers: [BattleCacheService, QueueCacheService],
  exports: [BattleCacheService, QueueCacheService],
})
export class CacheModule {}
