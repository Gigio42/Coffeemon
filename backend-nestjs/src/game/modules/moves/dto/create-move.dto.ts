import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { moveType } from '../entities/move.entity';
import { MoveEffectDto } from './move.dto';

export class CreateMoveDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  power: number;

  @IsEnum(moveType)
  type: moveType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoveEffectDto)
  effects?: MoveEffectDto[];
}
