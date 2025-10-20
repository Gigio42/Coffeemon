import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeemonDto } from './dto/create-coffeemon.dto';
import { UpdateCoffeemonDto } from './dto/update-coffeemon.dto';
import { Coffeemon } from './entities/coffeemon.entity';

@Injectable()
export class CoffeemonService {
  constructor(
    @InjectRepository(Coffeemon)
    private coffeemonRepository: Repository<Coffeemon>
  ) {}

  async findAll(): Promise<Coffeemon[]> {
    return this.coffeemonRepository.find({ relations: ['learnset', 'learnset.move'] });
  }

  async findOne(id: number): Promise<Coffeemon> {
    const coffeemon = await this.coffeemonRepository.findOne({
      where: { id },
      relations: ['learnset', 'learnset.move'],
    });
    if (!coffeemon) {
      throw new NotFoundException(`Coffeemon #${id} not found`);
    }
    return coffeemon;
  }

  async create(createCoffeemonDto: CreateCoffeemonDto): Promise<Coffeemon> {
    const coffeemon = this.coffeemonRepository.create(createCoffeemonDto);
    return this.coffeemonRepository.save(coffeemon);
  }

  async createMany(dtos: CreateCoffeemonDto[]): Promise<Coffeemon[]> {
    const coffeemonsToCreate = dtos.map((dto) => this.coffeemonRepository.create(dto));
    return this.coffeemonRepository.save(coffeemonsToCreate);
  }

  async update(id: number, updateCoffeemonDto: UpdateCoffeemonDto): Promise<Coffeemon> {
    const coffeemon = await this.coffeemonRepository.preload({
      id: id,
      ...updateCoffeemonDto,
    });
    if (!coffeemon) {
      throw new NotFoundException(`Coffeemon #${id} not found`);
    }
    return this.coffeemonRepository.save(coffeemon);
  }

  async remove(id: number): Promise<void> {
    const result = await this.coffeemonRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Coffeemon #${id} not found`);
    }
  }
}
