import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCoffeemonToPartyDto {
  @ApiProperty({
    description: 'ID of the Coffeemon to be added to the party',
    example: 1,
  })
  @IsInt({ message: 'The ID of the coffeemon has to be an integer' })
  @Min(1, { message: 'The ID of the coffeemon has to be greater than zero' })
  @Type(() => Number)
  playerCoffeemonId!: number;
}
