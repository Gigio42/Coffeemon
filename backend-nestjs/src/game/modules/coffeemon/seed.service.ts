import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as coffeemonData from '../../data/coffeemon.data.json';
import * as learnsetData from '../../data/learnset.data.json';
import * as moveData from '../../data/moves.data.json';
import { Move, MoveCategory } from '../moves/entities/move.entity';
import { CoffeemonLearnsetMove, MoveLearnMethod } from './entities/coffeemon-learnset-move.entity';
import { Coffeemon, CoffeemonType } from './entities/coffeemon.entity';

interface IMoveData {
  id: number;
  name: string;
  power: number;
  category: MoveCategory;
  elementalType?: CoffeemonType | null;
  description: string;
  effects?: {
    type: string;
    chance: number;
    duration?: number;
    target: 'self' | 'enemy';
    value?: number;
  }[];
}

interface ICoffeemonData {
  id: number;
  name: string;
  types: string[];
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  description?: string;
  flavorProfile?: string;
  weight?: number;
  height?: number;
}

interface ILearnsetData {
  coffeemonId: number;
  moveId: number;
  learnMethod: string;
  levelLearned?: number;
}

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Coffeemon)
    private readonly coffeemonRepository: Repository<Coffeemon>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    @InjectRepository(CoffeemonLearnsetMove)
    private readonly learnsetRepository: Repository<CoffeemonLearnsetMove>
  ) {}

  async onModuleInit() {
    if ((await this.moveRepository.count()) === 0) {
      console.log('[SeedService] Seeding Moves...');
      await this.seedMoves();
    } else {
      console.log('[SeedService] Moves already seeded.');
    }

    console.log('Seeding/Updating Coffeemons...');
    await this.seedCoffeemons();

    if ((await this.learnsetRepository.count()) === 0) {
      console.log('[SeedService] Seeding Coffeemon Learnset...');
      await this.seedLearnset();
    } else {
      console.log('[SeedService] Coffeemon Learnset already seeded.');
    }
  }

  private async seedMoves() {
    const typedMoveData = moveData as unknown as IMoveData[];
    const movesToCreate: Move[] = typedMoveData.map((moveDto) => {
      return this.moveRepository.create({
        id: moveDto.id,
        name: moveDto.name,
        power: moveDto.power,
        category: moveDto.category,
        elementalType: moveDto.elementalType,
        description: moveDto.description,
        effects: moveDto.effects,
      });
    });
    await this.moveRepository.save(movesToCreate);
    console.log('[SeedService] Move seeding complete!');
  }

  private async seedCoffeemons() {
    const typedCoffeemonData = coffeemonData as unknown as ICoffeemonData[];
    for (const data of typedCoffeemonData) {
      const coffeemonToCreate = {
        id: data.id,
        name: data.name,
        types: data.types as CoffeemonType[],
        baseHp: data.baseHp,
        baseAttack: data.baseAttack,
        baseDefense: data.baseDefense,
        baseSpeed: data.baseSpeed,
        description: data.description,
        flavorProfile: data.flavorProfile,
        weight: data.weight,
        height: data.height,
      };

      const newCoffeemon = this.coffeemonRepository.create(coffeemonToCreate);
      await this.coffeemonRepository.save(newCoffeemon);
    }
    console.log('[SeedService] Coffeemon seeding complete!');
  }

  private async seedLearnset() {
    const typedLearnsetData = learnsetData as ILearnsetData[];
    const learnsetEntries: Partial<CoffeemonLearnsetMove>[] = [];

    const allCoffeemons = await this.coffeemonRepository.find({ select: ['id'] });
    const allMoves = await this.moveRepository.find({ select: ['id'] });
    const coffeemonMap = new Map(allCoffeemons.map((c) => [c.id, c]));
    const moveMap = new Map(allMoves.map((m) => [m.id, m]));

    for (const data of typedLearnsetData) {
      if (!coffeemonMap.has(data.coffeemonId)) {
        console.warn(
          `SeedLearnset: Coffeemon ID ${data.coffeemonId} not found, skipping learnset entry for Move ID ${data.moveId}.`
        );
        continue;
      }
      if (!moveMap.has(data.moveId)) {
        console.warn(
          `SeedLearnset: Move ID ${data.moveId} not found, skipping learnset entry for Coffeemon ID ${data.coffeemonId}.`
        );
        continue;
      }

      learnsetEntries.push({
        coffeemonId: data.coffeemonId,
        moveId: data.moveId,
        learnMethod: data.learnMethod as MoveLearnMethod,
        levelLearned: data.levelLearned,
      });
    }

    const newLearnsetEntries = this.learnsetRepository.create(learnsetEntries);
    await this.learnsetRepository.save(newLearnsetEntries);
    console.log('[SeedService] Coffeemon Learnset seeding complete!');
  }
}
