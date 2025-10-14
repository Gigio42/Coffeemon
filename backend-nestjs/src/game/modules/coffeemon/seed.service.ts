import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as coffeemonData from '../../data/coffeemon.data.json';
import * as moveData from '../../data/moves.data.json';
import { Move } from '../moves/entities/move.entity';
import { Coffeemon, CoffeemonType } from './entities/coffeemon.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Coffeemon)
    private readonly coffeemonRepository: Repository<Coffeemon>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>
  ) {}

  async onModuleInit() {
    if ((await this.moveRepository.count()) === 0) {
      console.log('Database is empty, seeding Moves...');
      await this.seedMoves();
    }
    if ((await this.coffeemonRepository.count()) === 0) {
      console.log('Seeding Coffeemons...');
      await this.seedCoffeemons();
    }
  }

  private async seedMoves() {
    const movesToCreate = this.moveRepository.create(moveData as any);
    await this.moveRepository.save(movesToCreate);
    console.log('Move seeding complete!');
  }

  private async seedCoffeemons() {
    for (const data of coffeemonData) {
      const moves = await this.moveRepository.find({ where: { id: In(data.moves) } });

      const coffeemonToCreate = {
        id: data.id,
        name: data.name,
        type: data.type as CoffeemonType,
        baseHp: data.baseHp,
        baseAttack: data.baseAttack,
        baseDefense: data.baseDefense,
        moves: moves,
      };

      const newCoffeemon = this.coffeemonRepository.create(coffeemonToCreate);
      await this.coffeemonRepository.save(newCoffeemon);
    }
    console.log('Coffeemon seeding complete!');
  }
}
