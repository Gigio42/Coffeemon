import { IsNumber, IsArray, ValidateNested, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'O ID do produto é obrigatório'})
  @IsNumber({}, { message: 'O ID do produto deve ser um número válido'})
  @Min(1, {message: 'O ID do produto deve ser um número maior que 0'})
  productId: number;

  @IsNotEmpty({ message: 'A quantidade do produto é obrigatória'})
  @IsNumber({}, { message: 'A quantidade do produto deve ser um número válido'})
  @Min(1, {message: 'A quantidade do produto deve ser um número maior que 0'})
  quantity: number;
}

export class CreateOrderItemDto {
  @IsNumber({}, { message: 'Quantidade é obrigatória' })
  quantity: number;

  @IsNumber({}, { message: 'Produto é obrigatório' })
  productId: number;
}
