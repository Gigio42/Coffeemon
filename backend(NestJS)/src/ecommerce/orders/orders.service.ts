import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { OrderStatus } from 'src/Shared/enums/order_status';
import { NotFoundError } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>
  ) {}
  findAll(userId: number) {
    return this.ordersRepository.find({
      where: {
        user: { id: userId}
      },
    });
  }

  findOne(userId: number, orderId: number) {
    return this.ordersRepository.findOne({
      where: { 
        id: orderId,
        user: { id: userId}
      },
      relations: ['orderItem', 'orderItem.product']
    });
  }

  async checkout(userId: number) {
    const shoppingCart = await this.ordersRepository.findOne({
      where: {
        user: { id: userId},
        status: OrderStatus.SHOPPING_CART
      }
    });

    if (!shoppingCart) throw new NotFoundException("Carrinho não encontrado");

    // await this.ordersRepository.update(shoppingCart.id, { status: OrderStatus.})
  }

  /* ### Funções Auxiliares ### */

  
}
