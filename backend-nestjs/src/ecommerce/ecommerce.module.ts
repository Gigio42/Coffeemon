import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, ShoppingCartModule, AuditModule, AdminModule],
  exports: [UsersModule, ProductsModule, OrdersModule, ShoppingCartModule, AuditModule],
})
export class EcommerceModule {}
