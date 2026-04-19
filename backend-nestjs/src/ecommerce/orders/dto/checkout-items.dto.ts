export class CheckoutItemDto {
  productId: number;
  quantity: number;
}

export class CheckoutItemsDto {
  items: CheckoutItemDto[];
}
