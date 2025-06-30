import { Injectable } from '@nestjs/common';
import { BattleState } from '../battles/types/batlle.types';

@Injectable()
export class BattleCacheService {
  private cache = new Map<string, BattleState>();

  get(battleId: string): BattleState | undefined {
    return this.cache.get(battleId);
  }

  getAll(): { battleId: string; state: BattleState }[] {
    return Array.from(this.cache.entries()).map(([battleId, state]) => ({
      battleId,
      state,
    }));
  }

  set(battleId: string, state: BattleState): void {
    this.cache.set(battleId, state);
  }

  delete(battleId: string): void {
    this.cache.delete(battleId);
  }
}
