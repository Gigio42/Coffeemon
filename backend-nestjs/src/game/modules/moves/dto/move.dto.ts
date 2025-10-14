import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class MoveEffectDto {
  @IsString()
  type: string;

  @IsNumber()
  chance: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsString()
  target: 'self' | 'enemy' | 'ally';
}

export class MoveDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  power: number;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  @Type(() => MoveEffectDto)
  effects?: MoveEffectDto[];
}
