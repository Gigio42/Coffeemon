import { isLowercase, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @Transform(({value}) => value.toLowerCase())
  @ApiProperty({
    description: 'Name of the product',
    example: 'cappuccino',
  })
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  @IsString({message: 'O nome do produto deve ser uma string válida'})
  name: string;

  @IsNotEmpty({ message: 'A descrição do produto é obrigatória'})
  @IsString({ message: 'A descrição do produto deve ser uma string válida'})
  description: string;

  @IsOptional()
  @IsString({ message: 'O campo de imagem deve ser uma string (URL ou caminho local).' })
  image?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 7.25,
  })
  @IsNotEmpty({ message: 'O preço do produto é obrigatória'})  
  @Type(() => Number)
  @IsPositive({ message: 'O preço deve ser um número positivo.' })
  @IsNumber({maxDecimalPlaces: 2}, { message: 'O preço deve ser um número válido.' })
  price?: number;
}
