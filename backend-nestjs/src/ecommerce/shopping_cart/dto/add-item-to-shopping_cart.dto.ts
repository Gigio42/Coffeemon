import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class AddItemToShoppingCartDto {
  @IsNotEmpty({ message: 'O ID do produto é obrigatório'})
  @IsNumber({}, { message: 'O ID do produto deve ser um número válido'})
  @Min(1, {message: 'O ID do produto deve ser um número maior que 0'})
  productId: number;

  @IsNotEmpty({ message: 'A quantidade do produto é obrigatória'})
  @IsNumber({}, { message: 'A quantidade do produto deve ser um número válido'})
  @Min(1, {message: 'A quantidade do produto deve ser um número maior que 0'})
  quantity: number;
}