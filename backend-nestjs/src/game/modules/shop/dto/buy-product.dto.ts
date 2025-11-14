import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export enum ProductType {
  GACHA = 'gacha',
  ITEM = 'item',
}

export class BuyProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  productType: ProductType;
}
