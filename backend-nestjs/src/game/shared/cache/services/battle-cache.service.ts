import { Injectable } from '@nestjs/common';
import { BattleState } from 'src/game/modules/battles/types/battle-state.types';
import { RedisService } from '../../../../infrastructure/redis/redis.service';

@Injectable()
export class BattleCacheService {
  private readonly BATTLE_PREFIX = 'battle:';
  private readonly BATTLES_LIST_KEY = 'battles:active';

  constructor(private redisService: RedisService) {}

  async get(battleId: string): Promise<BattleState | undefined> {
    try {
      const data = await this.redisService.get(`${this.BATTLE_PREFIX}${battleId}`);
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error('Error getting battle from Redis:', error);
      return undefined;
    }
  }

  async set(battleId: string, state: BattleState): Promise<void> {
    try {
      await this.redisService.set(`${this.BATTLE_PREFIX}${battleId}`, JSON.stringify(state));

      const battleIdsData = await this.redisService.get(this.BATTLES_LIST_KEY);
      const battleIds = battleIdsData ? JSON.parse(battleIdsData) : [];

      if (!battleIds.includes(battleId)) {
        battleIds.push(battleId);
        await this.redisService.set(this.BATTLES_LIST_KEY, JSON.stringify(battleIds));
      }
    } catch (error) {
      console.error('Error setting battle in Redis:', error);
    }
  }

  async delete(battleId: string): Promise<void> {
    try {
      await this.redisService.del(`${this.BATTLE_PREFIX}${battleId}`);

      const battleIdsData = await this.redisService.get(this.BATTLES_LIST_KEY);
      if (battleIdsData) {
        const battleIds = JSON.parse(battleIdsData);
        const updatedIds = battleIds.filter((id) => id !== battleId);
        await this.redisService.set(this.BATTLES_LIST_KEY, JSON.stringify(updatedIds));
      }
    } catch (error) {
      console.error('Error deleting battle from Redis:', error);
    }
  }

  async getAll(): Promise<{ battleId: string; state: BattleState }[]> {
    try {
      const battleIdsData = await this.redisService.get(this.BATTLES_LIST_KEY);
      const battleIds = battleIdsData ? JSON.parse(battleIdsData) : [];
      const battles: { battleId: string; state: BattleState }[] = [];

      for (const battleId of battleIds) {
        const state = await this.get(battleId);
        if (state) {
          battles.push({ battleId, state });
        }
      }

      return battles;
    } catch (error) {
      console.error('Error getting all battles from Redis:', error);
      return [];
    }
  }
}
