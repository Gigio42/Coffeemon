import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { UpstashRedisAdapter } from './upstash-redis.adapter';

@Injectable()
export class RedisService {
  private readonly redis: Redis | UpstashRedisAdapter;
  private readonly logger = new Logger(RedisService.name);
  private readonly isRestClient: boolean;

  constructor() {
    // Prioriza REST API se USE_UPSTASH_REST estiver definida
    if (process.env.USE_UPSTASH_REST === 'true') {
      this.logger.log('Usando Upstash REST API (HTTP)...');
      this.redis = new UpstashRedisAdapter();
      this.isRestClient = true;
      this.logger.log('✅ Upstash REST pronto para uso');
      return;
    }

    this.isRestClient = false;

    // Prioriza REDIS_URL (Upstash TCP) se estiver disponível
    if (process.env.REDIS_URL) {
      this.logger.log('Conectando ao Redis via URL (Upstash/Cloud TCP)...');
      this.redis = new Redis(process.env.REDIS_URL, {
        tls: {
          rejectUnauthorized: false, // Necessário para Upstash com TLS
        },
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      }) as Redis;
    } else {
      // Fallback para configuração tradicional (Docker local)
      this.logger.log('Conectando ao Redis local (Docker)...');
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || 'CofFeR3d1s',
        db: parseInt(process.env.REDIS_DB || '0'),
      }) as Redis;
    }

    // Event listeners para monitorar conexão (apenas para ioredis)
    if (!this.isRestClient) {
      (this.redis as Redis).on('connect', () => {
        this.logger.log('Redis conectado com sucesso');
      });

      (this.redis as Redis).on('error', (error) => {
        this.logger.error('Erro na conexão Redis:', error.message);
      });

      (this.redis as Redis).on('ready', () => {
        this.logger.log('Redis pronto para uso');
      });
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (this.isRestClient) {
      return (this.redis as UpstashRedisAdapter).set(key, value, ttl);
    }
    
    if (ttl) {
      return (this.redis as Redis).set(key, value, 'EX', ttl);
    }
    return (this.redis as Redis).set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  getClient(): Redis | UpstashRedisAdapter {
    return this.redis;
  }
}
