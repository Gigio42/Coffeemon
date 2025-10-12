import { Module } from '@nestjs/common';
import { BattleCacheService } from './battle-cache.service';
import { QueueCacheService } from './queue-cache.service';

@Module({
  providers: [BattleCacheService, QueueCacheService],
  exports: [BattleCacheService, QueueCacheService],
})
export class CacheModule {}
