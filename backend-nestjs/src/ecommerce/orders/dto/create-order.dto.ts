import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Products in the order',
    example: [
      {
        userId: 1,
        products: [{ productId: 1, quantity: 2 }],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];

  @ApiProperty({
    description: 'User ID who placed the order',
    example: 1,
  })
  @IsNumber({}, { message: 'Usuário é obrigatório' })
  userId: number;
}

export class CreateOrderItemDto {
  @IsNumber({}, { message: 'Quantidade é obrigatória' })
  quantity: number;

  @IsNumber({}, { message: 'Produto é obrigatório' })
  productId: number;
}
