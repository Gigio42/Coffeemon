import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, ShoppingCartModule],
  exports: [UsersModule, ProductsModule, OrdersModule, ShoppingCartModule],
})
export class EcommerceModule {}
