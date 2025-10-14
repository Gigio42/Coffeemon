import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMoveDto } from './dto/create-move.dto';
import { Move } from './entities/move.entity';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>
  ) {}

  findAll(): Promise<Move[]> {
    return this.moveRepository.find();
  }

  async findOne(id: number): Promise<Move> {
    const move = await this.moveRepository.findOneBy({ id });
    if (!move) {
      throw new NotFoundException(`Move with ID ${id} not found.`);
    }
    return move;
  }

  create(createMoveDto: CreateMoveDto): Promise<Move> {
    const move = this.moveRepository.create(createMoveDto);
    return this.moveRepository.save(move);
  }
}
