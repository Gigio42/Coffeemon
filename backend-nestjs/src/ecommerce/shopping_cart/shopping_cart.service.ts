import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/Shared/enums/order_status';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order_item.entity';
import { ProductsService } from '../products/products.service';
import { AddItemToShoppingCartDto } from './dto/add-item-to-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(Order)
    private readonly shoppingCartRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly productsServices: ProductsService
  ) {}
  async addItemToShoppingCart(userId: number, addItemToShoppingCartDto: AddItemToShoppingCartDto) {
    const product = await this.productsServices.findProductById(addItemToShoppingCartDto.productId);
    const order = await this.getOrCreateShoppingCart(userId);
    let message: string;

    if (!order.orderItem || order.orderItem.length === 0) {
      await this.orderItemRepository.save(
        this.orderItemRepository.create({
          order: order,
          product: product,
          quantity: addItemToShoppingCartDto.quantity,
          unit_price: product.price,
        })
      );
      message = 'Produto adicionado ao carrinho';
    } else {
      const productExistInCart = order.orderItem.find(
        (productInCart) => productInCart.product.id === product.id
      );

      if (productExistInCart) {
        await this.orderItemRepository.update(productExistInCart.id, {
          quantity: addItemToShoppingCartDto.quantity,
        });
        message = 'Quantidade do produto atualizada';
      } else {
        await this.orderItemRepository.save(
          this.orderItemRepository.create({
            product,
            order,
            quantity: addItemToShoppingCartDto.quantity,
            unit_price: product.price,
          })
        );
        message = 'Produto adicionado ao carrinho';
      }
    }
    return { message };
  }

  async findOne(userId: number) {
    const shoppingCart = await this.shoppingCartRepository
      .createQueryBuilder('orders')
      .innerJoinAndSelect('orders.orderItem', 'orderItem')
      .innerJoinAndSelect('orderItem.product', 'products')
      .where('orders.status = :status', { status: OrderStatus.SHOPPING_CART })
      .andWhere('orders.user.id = :userId', { userId })
      .getMany();

    return shoppingCart.length <= 0 ? 'Carrinho vazio' : shoppingCart;
  }

  async updateQuantity(userId: number, updateShoppingCartDto: UpdateShoppingCartDto) {
    const { productId, quantity } = updateShoppingCartDto;
    const shoppingCart = await this.findShoppingCartByUserId(userId);

    const item = await this.orderItemRepository.findOne({
      where: {
        order: shoppingCart,
        product: { id: productId },
      },
    });

    if (!item)
      throw new NotFoundException(
        `Produto com o ID ${productId} não encontrado no carrinho do usuário`
      );

    await this.orderItemRepository.update(item.id, { quantity: quantity });

    return { message: 'Quantidade do produto alterada' };
  }

  async remove(userId: number, productId: number) {
    const shoppingCart = await this.findShoppingCartByUserId(userId);

    const item = await this.orderItemRepository.findOne({
      where: {
        order: shoppingCart,
        product: { id: productId },
      },
    });

    if (!item)
      throw new NotFoundException(
        `Produto com o ID ${productId} não encontrado no carrinho do usuário`
      );

    await this.orderItemRepository.remove(item);

    return { message: 'Produto removido do carrinho' };
  }

  /* ### Funções Auxiliares ### */

  async getOrCreateShoppingCart(userId: number) {
    let order = await this.shoppingCartRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.SHOPPING_CART,
      },
      relations: ['orderItem', 'orderItem.product'],
    });

    if (!order) {
      order = await this.shoppingCartRepository.save(
        this.shoppingCartRepository.create({
          user: { id: userId },
          status: OrderStatus.SHOPPING_CART,
        })
      );
    }

    return order;
  }

  async findShoppingCartByUserId(userId: number) {
    const shoppingCartExist = await this.shoppingCartRepository.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.SHOPPING_CART,
      },
    });

    if (!shoppingCartExist)
      throw new NotFoundException(`Nenhum carrinho encontrado para este usuário`);

    return shoppingCartExist;
  }
}
