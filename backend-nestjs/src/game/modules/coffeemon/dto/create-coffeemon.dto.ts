import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { MoveDto } from '../../moves/dto/move.dto';
import { CoffeemonType } from '../entities/coffeemon.entity';

export class CreateCoffeemonDto {
  @IsString()
  name: string;

  @IsEnum(CoffeemonType)
  type: CoffeemonType;

  @IsNumber()
  baseHp: number;

  @IsNumber()
  baseAttack: number;

  @IsNumber()
  baseDefense: number;

  @IsString()
  imageUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoveDto)
  moves: MoveDto[];
}
