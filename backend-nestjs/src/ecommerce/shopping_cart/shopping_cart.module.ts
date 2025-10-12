import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { ShoppingCartController } from './shopping_cart.controller';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderItem } from '../orders/entities/order_item.entity';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Order, OrderItem]), AuthModule
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
