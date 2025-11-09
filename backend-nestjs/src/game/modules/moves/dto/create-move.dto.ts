import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MoveEffectDto } from './move.dto';

export class CreateMoveDto {
  @ApiProperty({ example: 'Hydro Pump' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A powerful blast of water.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 110 })
  @IsNumber()
  power: number;

  @ApiProperty({ example: 'attack' })
  @IsString()
  type: string;

  @ApiProperty({ type: [MoveEffectDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoveEffectDto)
  effects?: MoveEffectDto[];
}
