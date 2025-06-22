import { Injectable } from '@nestjs/common';
import { BattleService } from './battles.service';

@Injectable()
export class MatchmakingService {
  private queue: { userId: number; socketId: string }[] = [];

  constructor(private battleService: BattleService) {}

  async enqueue(userId: number, socketId: string) {
    const opponent = this.queue.find((p) => p.userId !== userId);

    if (!opponent) {
      this.queue.push({ userId, socketId });
      return { status: 'waiting' } as const;
    }

    this.queue = this.queue.filter((p) => p !== opponent);

    return this.battleService.createBattle(userId, opponent.userId, socketId, opponent.socketId);
  }
}
