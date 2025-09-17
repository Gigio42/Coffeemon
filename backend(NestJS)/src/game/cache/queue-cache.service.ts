import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { QueuePlayer } from '../matchmaking/types/matchmaking.types';

@Injectable()
export class QueueCacheService {
  private readonly QUEUE_KEY = 'matchmaking:queue';
  private readonly PLAYER_SOCKET_PREFIX = 'player:socket:';

  constructor(private redisService: RedisService) {}

  async addToQueue(userId: number, socketId: string): Promise<void> {
    try {
      const queueData = await this.redisService.get(this.QUEUE_KEY);
      const queue: QueuePlayer[] = queueData ? JSON.parse(queueData) : [];
      const filteredQueue = queue.filter((p) => p.userId !== userId && p.socketId !== socketId);
      filteredQueue.push({ userId, socketId });

      await this.redisService.set(this.QUEUE_KEY, JSON.stringify(filteredQueue));
      await this.redisService.set(`${this.PLAYER_SOCKET_PREFIX}${socketId}`, userId.toString());
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  }

  async removeFromQueue(socketId: string): Promise<void> {
    try {
      const queueData = await this.redisService.get(this.QUEUE_KEY);
      const queue: QueuePlayer[] = queueData ? JSON.parse(queueData) : [];
      const filteredQueue = queue.filter((p) => p.socketId !== socketId);

      await this.redisService.set(this.QUEUE_KEY, JSON.stringify(filteredQueue));
      await this.redisService.del(`${this.PLAYER_SOCKET_PREFIX}${socketId}`);
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  }

  async getQueue(): Promise<QueuePlayer[]> {
    try {
      const queueData = await this.redisService.get(this.QUEUE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Error getting queue:', error);
      return [];
    }
  }

  async findOpponent(userId: number): Promise<QueuePlayer | undefined> {
    const queue = await this.getQueue();
    return queue.find((p) => p.userId !== userId);
  }

  async findBySocketId(socketId: string): Promise<QueuePlayer | undefined> {
    const queue = await this.getQueue();
    return queue.find((p) => p.socketId === socketId);
  }

  async getQueueSize(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  async clearQueue(): Promise<void> {
    await this.redisService.del(this.QUEUE_KEY);
  }
}
