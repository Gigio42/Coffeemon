import { Injectable } from '@nestjs/common';
import { BattleActionUnion } from '../../battles/types/battle-actions.types';
import { BattleState } from '../../battles/types/battle-state.types';
import { IBotStrategy } from '../strategies/bot-strategy.interface';
import { RandomStrategy } from '../strategies/random.strategy';

@Injectable()
export class BotService {
  private strategies: Map<string, IBotStrategy> = new Map();

  constructor(randomStrategy: RandomStrategy) {
    this.strategies.set('random', randomStrategy);
    //TODO implementar mais estrategias dps
  }

  getBotAction(battleState: BattleState, botPlayerId: number, strategy: string): BattleActionUnion {
    const selectedStrategy = this.strategies.get(strategy);
    if (!selectedStrategy) {
      throw new Error(`Estratégia de bot '${strategy}' não encontrada.`);
    }

    return selectedStrategy.chooseAction(battleState, botPlayerId);
  }
}
