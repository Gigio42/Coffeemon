import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeemonDto } from './dto/create-coffeemon.dto';
import { UpdateCoffeemonDto } from './dto/update-coffeemon.dto';
import { Coffeemon } from './entities/coffeemon.entity';
import { moveType } from './Types/coffeemon.types';

@Injectable()
export class CoffeemonService {
  constructor(
    @InjectRepository(Coffeemon)
    private coffeemonRepository: Repository<Coffeemon>
  ) {}

  async findAll(): Promise<Coffeemon[]> {
    return this.coffeemonRepository.find();
  }

  async findOne(id: number): Promise<Coffeemon> {
    const coffeemon = await this.coffeemonRepository.findOneBy({ id });
    if (!coffeemon) {
      throw new NotFoundException(`Coffeemon #${id} not found`);
    }
    return coffeemon;
  }

  async create(createCoffeemonDto: CreateCoffeemonDto): Promise<Coffeemon> {
    const mappedMoves = createCoffeemonDto.moves.map((move) => ({
      ...move,
      type: move.type as moveType,
    }));
    const coffeemon = this.coffeemonRepository.create({
      ...createCoffeemonDto,
      moves: mappedMoves,
    });
    return this.coffeemonRepository.save(coffeemon);
  }

  async createMany(dtos: CreateCoffeemonDto[]): Promise<Coffeemon[]> {
    const mappedDtos = dtos.map((dto) => ({
      ...dto,
      moves: dto.moves.map((move) => ({
        ...move,
        type: move.type as moveType,
      })),
    }));
    return this.coffeemonRepository.save(mappedDtos);
  }

  async update(id: number, updateCoffeemonDto: UpdateCoffeemonDto): Promise<Coffeemon> {
    const coffeemon = await this.findOne(id);

    Object.assign(coffeemon, updateCoffeemonDto);

    return this.coffeemonRepository.save(coffeemon);
  }

  async remove(id: number): Promise<void> {
    const result = await this.coffeemonRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Coffeemon #${id} not found`);
    }
  }
}
