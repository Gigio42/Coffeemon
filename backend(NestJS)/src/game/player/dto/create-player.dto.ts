import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({
    description: 'Unique identifier for the player',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  starterCoffeemonId?: number;

  @ApiProperty({
    description: 'Initial amount of coins for the player',
    default: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  initialCoins?: number;
}
