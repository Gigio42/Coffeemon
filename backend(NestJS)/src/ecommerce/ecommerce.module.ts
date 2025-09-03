import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule],
  exports: [UsersModule, ProductsModule, OrdersModule],
})
export class EcommerceModule {}
