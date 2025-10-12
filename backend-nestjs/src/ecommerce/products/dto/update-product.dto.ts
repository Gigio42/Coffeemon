import { IsNumber, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    @IsString({ message:'O nome do produto deve ser uma string válida'})
    name?: string;

    @IsOptional()
    @IsString({ message: 'A descrição do produto deve ser uma string válida'})
    description?: string;

    @IsOptional()
    @IsUrl({}, { message: 'O campo de imagem deve ser uma URL válida.' })
    image?: string;

    @IsOptional()
    @Type(() => Number)
    @IsPositive({ message: 'O preço deve ser um número positivo.' })
    @IsNumber({maxDecimalPlaces: 2}, { message: 'O preço deve ser um número válido.' })
    price?: number;
}
