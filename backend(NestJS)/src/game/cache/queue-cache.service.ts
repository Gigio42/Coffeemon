import { Injectable } from '@nestjs/common';
import { QueuePlayer } from '../matchmaking/types/matchmaking.types';

@Injectable()
export class QueueCacheService {
  private queue: QueuePlayer[] = [];

  addToQueue(userId: number, socketId: string): void {
    this.queue.push({ userId, socketId });
  }

  removeFromQueue(socketId: string): void {
    this.queue = this.queue.filter((p) => p.socketId !== socketId);
  }

  getQueue(): QueuePlayer[] {
    return this.queue;
  }

  findBySocketId(socketId: string): QueuePlayer | undefined {
    return this.queue.find((p) => p.socketId === socketId);
  }

  findOpponent(userId: number, socketId: string): QueuePlayer | undefined {
    return this.queue.find((p) => p.userId !== userId && p.socketId !== socketId);
  }
}
