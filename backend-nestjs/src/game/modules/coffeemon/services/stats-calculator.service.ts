import { Injectable } from '@nestjs/common';
import { Coffeemon } from '../entities/coffeemon.entity';
import { CoffeemonStats } from '../Types/coffeemon-stats.types';

export const STAT_SCALING_FACTOR = 0.04; // 4% de aumento linear por nível
export const EXP_BASE_CONSTANT = 10; // C na fórmula de XP
export const EXP_EXPONENT = 3; // E na fórmula de XP (Exponencial)

@Injectable()
export class StatsCalculatorService {
  public calculateStat(baseStat: number, level: number, ev: number = 0): number {
    if (level <= 1) {
      return baseStat;
    }

    const scalingFactor = 1 + STAT_SCALING_FACTOR * (level - 1);
    // TODO a lógica seria: (baseStat + ev / FATOR_EV) * scalingFactor
    const calculatedStat = baseStat * scalingFactor;

    return Math.floor(calculatedStat);
  }

  calculateAllStats(
    baseCoffeemon: Coffeemon,
    level: number,
    evs?: { hp: number; attack: number; defense: number; speed: number } | null
  ): CoffeemonStats {
    const safeEvs = evs ?? { hp: 0, attack: 0, defense: 0, speed: 0 };

    const hp = this.calculateStat(baseCoffeemon.baseHp, level, safeEvs.hp);
    const attack = this.calculateStat(baseCoffeemon.baseAttack, level, safeEvs.attack);
    const defense = this.calculateStat(baseCoffeemon.baseDefense, level, safeEvs.defense);
    const speed = this.calculateStat(baseCoffeemon.baseSpeed, level, safeEvs.speed);
    return { hp, attack, defense, speed };
  }

  /**
   * Calcula a quantidade de XP TOTAL necessária pra atingier um determinado nível (L).
   * XP_TOTAL = C * Level^E (Exponencial)
   */
  public calculateTotalExpForLevel(level: number): number {
    if (level <= 1) return 0;
    if (level > 100) return Infinity;

    return EXP_BASE_CONSTANT * Math.pow(level, EXP_EXPONENT);
  }
}
