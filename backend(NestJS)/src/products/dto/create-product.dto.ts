import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  price: number;
}
