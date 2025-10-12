import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCoffeemonDto } from './create-coffeemon.dto';

export class CreateManyCoffeemonDto {
  @ApiProperty({ type: [CreateCoffeemonDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateCoffeemonDto)
  coffeemons: CreateCoffeemonDto[];
}
