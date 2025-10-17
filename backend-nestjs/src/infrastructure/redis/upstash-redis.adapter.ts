import { Redis } from '@upstash/redis';
import { Logger } from '@nestjs/common';

/**
 * Adapter para Upstash Redis usando REST API
 * Compatível com a interface do ioredis usada no RedisService
 */
export class UpstashRedisAdapter {
  private readonly redis: Redis;
  private readonly logger = new Logger(UpstashRedisAdapter.name);

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL || 'https://crack-wolf-17001.upstash.io';
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || 
                  'AUJpAAIncDIzMWRhYTU5YzAxY2Y0NjllODg4ZjAwNjY0NGFhZWQ3OHAyMTcwMDE';

    this.logger.log('Conectando ao Upstash via REST API...');
    
    this.redis = new Redis({
      url,
      token,
    });

    this.logger.log('Upstash REST client inicializado');
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.error(`GET ${key} falhou:`, error.message);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
      return 'OK';
    } catch (error) {
      this.logger.error(`SET ${key} falhou:`, error.message);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (error) {
      this.logger.error(`DEL ${key} falhou:`, error.message);
      return 0;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      this.logger.error(`KEYS ${pattern} falhou:`, error.message);
      return [];
    }
  }

  // Método para compatibilidade com código que usa getClient()
  getClient(): any {
    return this.redis;
  }

  // Métodos adicionais usados pelo cache
  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      return await this.redis.hset(key, { [field]: value });
    } catch (error) {
      this.logger.error(`HSET ${key} ${field} falhou:`, error.message);
      return 0;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.redis.hget(key, field);
    } catch (error) {
      this.logger.error(`HGET ${key} ${field} falhou:`, error.message);
      return null;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.redis.hgetall(key) || {};
    } catch (error) {
      this.logger.error(`HGETALL ${key} falhou:`, error.message);
      return {};
    }
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    try {
      return await this.redis.hdel(key, ...fields);
    } catch (error) {
      this.logger.error(`HDEL ${key} falhou:`, error.message);
      return 0;
    }
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      if (members.length === 0) return 0;
      // @ts-ignore - Upstash aceita array de members
      return await this.redis.sadd(key, ...members);
    } catch (error) {
      this.logger.error(`SADD ${key} falhou:`, error.message);
      return 0;
    }
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    try {
      if (members.length === 0) return 0;
      // @ts-ignore - Upstash aceita array de members
      return await this.redis.srem(key, ...members);
    } catch (error) {
      this.logger.error(`SREM ${key} falhou:`, error.message);
      return 0;
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      return await this.redis.smembers(key);
    } catch (error) {
      this.logger.error(`SMEMBERS ${key} falhou:`, error.message);
      return [];
    }
  }

  async sismember(key: string, member: string): Promise<boolean> {
    try {
      const result = await this.redis.sismember(key, member);
      return result === 1;
    } catch (error) {
      this.logger.error(`SISMEMBER ${key} ${member} falhou:`, error.message);
      return false;
    }
  }

  // Mock de event emitter para compatibilidade
  on(event: string, callback: (...args: any[]) => void): void {
    // REST API não precisa de eventos, mas mantemos interface
    if (event === 'ready') {
      setTimeout(() => callback(), 100);
    }
  }

  async ping(): Promise<'PONG'> {
    try {
      await this.redis.ping();
      return 'PONG';
    } catch (error) {
      this.logger.error('PING falhou:', error.message);
      throw error;
    }
  }
}
