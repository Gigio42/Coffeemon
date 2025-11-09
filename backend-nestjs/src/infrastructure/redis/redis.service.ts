import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    if (process.env.REDIS_URL) {
      console.log('[REDIS] Connecting to Redis via REDIS_URL...');
      this.redis = new Redis(process.env.REDIS_URL, {
        // tls: {}
      });
    } else {
      console.log('[REDIS] Connecting to Redis via host/port...');
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0'),
      });
    }

    this.redis.on('connect', () => {
      console.log('[REDIS] Redis connected successfully!');
    });
    this.redis.on('error', (err) => {
      console.error('[REDIS] Error redis connection:', err);
    });
  }

  async onModuleInit() {}

  async onModuleDestroy() {
    await this.redis.quit();
    console.log('[REDIS] Disconnected from Redis.');
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }
    return this.redis.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  getClient(): Redis {
    return this.redis;
  }
}
