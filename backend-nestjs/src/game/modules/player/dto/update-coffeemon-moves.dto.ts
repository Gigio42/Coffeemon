import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class UpdateCoffeemonMovesDto {
  @ApiProperty({
    description: 'Array com os IDs dos moves que o Coffeemon terá equipados (1 a 4)',
    example: [1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'O Coffeemon deve ter pelo menos 1 move equipado' })
  @ArrayMaxSize(4, { message: 'O Coffeemon pode ter no máximo 4 moves equipados' })
  @IsNumber({}, { each: true })
  moveIds: number[];
}
