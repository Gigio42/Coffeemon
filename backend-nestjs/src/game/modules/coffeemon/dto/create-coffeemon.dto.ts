import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CoffeemonType } from '../entities/coffeemon.entity';

export class CreateCoffeemonDto {
  @IsString()
  name: string;

  @IsEnum(CoffeemonType)
  type: CoffeemonType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  flavorProfile?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

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
