import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
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

  @IsNumber()
  baseSpeed: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  learnableMoveIds: number[];
}
