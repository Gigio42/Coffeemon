import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions } from 'socket.io';
import { RedisService } from 'src/infrastructure/redis/redis.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(private readonly app: INestApplication) {
    super(app);
  }

  connect(): void {
    const redisService = this.app.get(RedisService);
    const pubClient = redisService.getClient();
    const subClient = pubClient.duplicate();

    subClient.on('error', (err) => {
      console.error('[RedisIoAdapter] Sub client error:', err);
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
    console.log('[RedisIoAdapter] Redis Socket.IO adapter conectado.');
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
