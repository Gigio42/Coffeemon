import { PartialType } from '@nestjs/swagger';
import { AddItemToShoppingCartDto } from './add-item-to-shopping_cart.dto';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateShoppingCartDto {
    @IsNotEmpty({ message: 'O ID do produto é obrigatório'})
    @IsNumber({}, { message: 'O ID do produto deve ser um número válido'})
    @IsPositive({ message: 'O ID do produto deve ser um número positivo'})
    productId: number;

    @IsNotEmpty({ message: 'A quantidade do produto é obrigatória'})
    @IsNumber({}, { message: 'A quantidade do produto deve ser um número válido'})
    @IsPositive({ message: 'A quantidade do produto deve ser um número positivo'})
    @Min(1)
    quantity: number;
}
