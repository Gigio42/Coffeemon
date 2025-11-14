import { Injectable, OnModuleInit } from '@nestjs/common';
import { CoffeemonType } from '../entities/coffeemon.entity';
import * as typeChartData from '../../../data/type-chart.data.json';

type TypeChart = Record<string, Record<string, number>>;

@Injectable()
export class TypeChartService implements OnModuleInit {
  private chart: TypeChart = {};

  onModuleInit() {
    this.chart = typeChartData;
    console.log('[TypeChartService] Tabela de Vantagens Elementais carregada.');
  }

  public getMultiplier(moveType: CoffeemonType | null, defendingTypes: CoffeemonType[]): number {
    if (!moveType || !defendingTypes || defendingTypes.length === 0) {
      return 1.0;
    }

    const attackRow = this.chart[moveType];
    if (!attackRow) {
      return 1.0;
    }

    let totalMultiplier = 1.0;
    for (const defType of defendingTypes) {
      const multiplier = attackRow[defType];

      if (multiplier) {
        totalMultiplier *= multiplier;
      }
    }

    return totalMultiplier;
  }
}
