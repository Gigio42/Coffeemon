import { Injectable, NotFoundException } from '@nestjs/common';
import { CoffeemonState, PlayerBattleState } from '../../battles/types/battle-state.types';
import { CoffeemonService } from '../../coffeemon/coffeemon.service';
import { Coffeemon } from '../../coffeemon/entities/coffeemon.entity';
import { BotProfile, BotProfiles } from '../config/bot-profiles';

@Injectable()
export class BotPlayerService {
  constructor(private readonly coffeemonService: CoffeemonService) {}

  async createBotPlayerStateFromProfile(
    profileId: string
  ): Promise<{ state: PlayerBattleState; profile: BotProfile }> {
    const profile = BotProfiles[profileId];
    if (!profile) {
      throw new NotFoundException(`Perfil de bot com ID '${profileId}' não encontrado.`);
    }

    const botParty: CoffeemonState[] = [];
    for (const config of profile.party) {
      const baseCoffeemon = await this.coffeemonService.findOne(config.coffeemonId);
      const coffeemonState = this.mapToCoffeemonState(baseCoffeemon, config.level);
      botParty.push(coffeemonState);
    }

    return {
      state: {
        activeCoffeemonIndex: null,
        coffeemons: botParty,
        hasSelectedCoffeemon: false,
      },
      profile,
    };
  }

  //TODO refatorar a forma de calcular stats baseado no level pro bot
  private mapToCoffeemonState(baseCoffeemon: Coffeemon, level: number): CoffeemonState {
    const statMultiplier = 1 + (level - 1) * 0.1;
    const maxHp = Math.floor(baseCoffeemon.baseHp * statMultiplier);

    return {
      id: baseCoffeemon.id,
      name: `${baseCoffeemon.name} (Lvl ${level})`,
      currentHp: maxHp,
      isFainted: false,
      canAct: true,
      maxHp: maxHp,
      attack: Math.floor(baseCoffeemon.baseAttack * statMultiplier),
      defense: Math.floor(baseCoffeemon.baseDefense * statMultiplier),
      speed: Math.floor(baseCoffeemon.baseSpeed * statMultiplier),
      modifiers: {
        attackModifier: 1.0,
        defenseModifier: 1.0,
        dodgeChance: 0.0,
        hitChance: 1.0,
        critChance: 0.05,
        blockChance: 0.0,
      },
      moves: [...(baseCoffeemon.moves || [])],
      statusEffects: [],
    };
  }
}
