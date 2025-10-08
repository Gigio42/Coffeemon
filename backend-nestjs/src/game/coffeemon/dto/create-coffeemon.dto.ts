import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CoffeemonType } from '../entities/coffeemon.entity';

export class MoveEffectDto {
  @ApiProperty({ description: 'Effect type', example: 'burn' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Chance to apply the effect (0~1)', example: 0.3 })
  @IsNumber()
  chance: number;

  @ApiProperty({ description: 'Duration in turns', required: false, example: 3 })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'Effect value', required: false, example: 10 })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({ description: 'Effect target', example: 'enemy', enum: ['self', 'enemy'] })
  @IsString()
  target: 'self' | 'enemy' | 'ally';
}

export class MoveDto {
  @ApiProperty({
    description: 'Unique identifier for the move',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: 'Name of the move',
    example: 'Espresso Shot',
  })
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Attack power of the move',
    example: 45,
  })
  @IsNumber()
  @Type(() => Number)
  power: number;

  @ApiProperty({
    description: 'Type of the move',
    example: 'attack',
  })
  @IsString()
  @Type(() => String)
  type: string;

  @ApiProperty({
    description: 'Detailed description of the move effect',
    example: 'A powerful concentrated coffee shot that deals medium damage',
  })
  @IsString()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Secondary effects of the move',
    type: [MoveEffectDto],
    required: false,
    example: [
      { type: 'burn', chance: 0.3, duration: 3, target: 'enemy' },
      { type: 'buff-attack', chance: 0.5, value: 2, target: 'self' },
    ],
  })
  @IsArray()
  @IsOptional()
  @Type(() => MoveEffectDto)
  effects?: MoveEffectDto[];
}

export class CreateCoffeemonDto {
  @ApiProperty({
    description: 'Name of the Coffeemon',
    example: 'Espressaur',
  })
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'Type of the Coffeemon',
    enum: CoffeemonType,
    example: CoffeemonType.FLORAL,
  })
  @IsEnum(CoffeemonType)
  type: CoffeemonType;

  @ApiProperty({
    description: 'Base health points of the Coffeemon',
    example: 100,
  })
  @IsNumber()
  @Type(() => Number)
  baseHp: number;

  @ApiProperty({
    description: 'Base attack stat of the Coffeemon',
    example: 50,
  })
  @IsNumber()
  @Type(() => Number)
  baseAttack: number;

  @ApiProperty({
    description: 'Base defense stat of the Coffeemon',
    example: 40,
  })
  @IsNumber()
  @Type(() => Number)
  baseDefense: number;

  @ApiProperty({
    description: 'URL to the Coffeemon image',
    example: 'https://coffeemon.com/images/espressaur.png',
  })
  @IsString()
  @Type(() => String)
  imageUrl: string;

  @ApiProperty({
    description: 'List of moves that the Coffeemon can learn',
    type: [MoveDto],
    example: [
      {
        id: 1,
        name: 'Espresso Shot',
        power: 45,
        type: 'espresso',
        description: 'A powerful concentrated coffee shot that deals medium damage',
      },
      {
        id: 2,
        name: 'Bean Shield',
        power: 0,
        type: 'defense',
        description: 'Protects itself with coffee beans, increasing defense',
      },
    ],
  })
  @IsArray()
  moves: MoveDto[];
}
