import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class CheckoutItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
