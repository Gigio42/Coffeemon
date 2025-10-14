import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/Shared/enums/order_status';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';

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
        user: { id: userId },
      },
    });
  }

  findOne(userId: number, orderId: number) {
    return this.ordersRepository.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
      relations: ['orderItem', 'orderItem.product'],
    });
  }

  async checkout(userId: number) {
    const shoppingCart = await this.ordersRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.SHOPPING_CART,
      },
      relations: ['orderItem'], // Carregar os itens do pedido
    });

    if (!shoppingCart) throw new NotFoundException('Carrinho não encontrado');

    try {
      // Calcular o total do pedido somando todos os itens
      let totalPrice = 0;
      let totalQuantity = 0;
      
      if (shoppingCart.orderItem && shoppingCart.orderItem.length > 0) {
        totalPrice = shoppingCart.orderItem.reduce((sum, item) => {
          console.log(`Item: ${item.id}, Total: ${item.total}, Quantity: ${item.quantity}`);
          return sum + (item.total || 0);
        }, 0);
        
        totalQuantity = shoppingCart.orderItem.reduce((sum, item) => {
          return sum + (item.quantity || 0);
        }, 0);
      }

      // Atualizar o status, total_amount e total_quantity
      await this.ordersRepository.update(shoppingCart.id, { 
        status: OrderStatus.FINISHED,
        total_amount: totalPrice,
        total_quantity: totalQuantity,
      });

      return 'Pedido finalizado';
    } catch (error) {
      return 'Erro ao tentar atualizar o status do pedido. \n Detalhes do erro: ' + error;
    }
  }

  /* ### Funções Auxiliares ### */
}
