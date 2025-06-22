import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CoffeemonType } from '../entities/coffeemon.entity';
import { Type } from 'class-transformer';

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
    example: 'espresso',
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

  @ApiProperty({
    description: 'Indicates if this Coffeemon is a starter option for new players',
    required: false,
    default: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isStarter?: boolean;
}
