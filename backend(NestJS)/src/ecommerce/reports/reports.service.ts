import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/ecommerce/orders/entities/order.entity';
// import { Status } from 'src/shared/enums/enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getOrdersPerHour(date: string) {
    if (!date) {
        date = new Date().toISOString().slice(0, 10);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Data inválida. Use o formato YYYY-MM-DD');
    }

    const fullHours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      total: 0,
    }));

    const results = await this.orderRepository
      .createQueryBuilder('order')
      .select(`DATE_FORMAT(order.updated_at, '%H:00')`, 'hour')
      .addSelect('COUNT(*)', 'total')
      .where('DATE(order.updated_at) = :date', { date })
      .andWhere('order.status = :status', { status: "PAGO"})
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const merged = fullHours.map(h => {
      const found = results.find(r => r.hour === h.hour);
      return {
        hour: h.hour,
        total: found ? Number(found.total) : 0,
      };
    });

    return merged;
  }

  async findAllClients(): Promise<User[]> {
    const lastOrderSubQuery = this.userRepository.manager.createQueryBuilder()
      .select('MAX(subOrder.id)', 'lastOrderId')
      .from('order', 'subOrder')
      .where('subOrder.userId = user.id')
      .andWhere('subOrder.status IN (:...statuses)', { statuses: ["FINALIZADO", "PAGO"] }); 

    const users = await this.userRepository
      .createQueryBuilder('user')  
      .innerJoin('user.order', 'order')
      .where(`order.id = (${lastOrderSubQuery.getQuery()})`)
      .setParameters(lastOrderSubQuery.getParameters())
      .select([
        'user.id',
        'user.document',
        'user.company_name',
        'user.user_name',
        'user.email',
        'user.cellphone',
       ])
      .getMany();
      
    return users;
  }

  async getCardsInfo() {
      const totalOrders = +await this.countTotalOrders();
      // const percentComplete = Math.round(await this.percentComplete());
      const totalAmount = await this.countTotalAmountOrders();

    return {
      totalOrders: totalOrders || 0,
      // percentComplete: percentComplete || 0,
      totalAmount: +totalAmount || 0,
      averageTicket: (totalAmount > 0) ? totalAmount/totalOrders : 0 
    }
  }

  async countTotalAmount() {
    const today = new Date();
    const dateFormated = today.toISOString().split('T')[0]

    const dataByStores = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(DISTINCT(order.id))', 'totalOrders')
      .addSelect('SUM(order.total_amount)', 'totalAmount')
      .andWhere('order.status = :status', { status: "PAGO"})
      .andWhere('DATE(order.updated_at) = :date', { date: dateFormated })
      .getRawOne();
    
    const totalOrders = dataByStores.totalOrders || 0;
    const totalAmount = dataByStores.totalAmount || 0 
    
    return { totalOrders, totalAmount};
  }

  async getDetailsByOrderId(orderId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .innerJoinAndSelect('order.order_product', 'orderProduct')
      .innerJoinAndSelect('orderProduct.product', 'product')
      .where('order.id = :orderId', { orderId })
      .getMany();

    
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      total_items: order.orderItem.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: order.total_amount,
      order_product: order.orderItem.map(product => ({
        id: product.id,
        quantity: product.quantity,
        unit_price: product.unit_price,
          product: {
            id: product.product.id,
            name: product.product.name,
            description: product.product.description,
            image: product.product.image,
        },
      })),
    }));

    return formattedOrders;
  }

  async getFinishedOrders() {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .innerJoinAndSelect('order.order_product', 'orderProduct')
      .innerJoinAndSelect('orderProduct.product', 'product')
      .where('order.status = :status', { status: "PAGO"})
      .getMany();

    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      total_items: order.orderItem.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: order.total_amount,
      order_product: order.orderItem.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            image: item.product.image,
        },
      })),
    }));

    return formattedOrders;
  }

  async getTopProductsPerDay() {
    const today = new Date();
    const dateFormated = today.toISOString().split('T')[0]

    const topProducts = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.order_product', 'orderProduct')
      .innerJoin('orderProduct.product', 'product')
      .select('product.name', 'name')
      .addSelect('product.image', 'image')
      .addSelect('product.id', 'id')
      .addSelect('product.price', 'price')
      .addSelect('SUM(orderProduct.quantity)', 'totalQuantitySold')
      .where('DATE(order.updated_at) = :date', { date: dateFormated })
      .andWhere('order.status IN (:...statuses)', {
        statuses: ["PAGO", "FINALIZADO"],
      })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.image')
      .addGroupBy('product.price')
      .orderBy('totalQuantitySold', 'DESC')
      .limit(5)
      .getRawMany();
  
    // console.warn(" ⚠️ Descomente a linha dos filtros do status do pedido para retornar pedidos em status especificos. \n Por hora não está funcional os outros status 26/06/2025 - 13:28")
    
    return topProducts.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: Number(p.price),
      totalQuantitySold: Number(p.totalQuantitySold),
    }));
  }

  /* ### Funções Auxiliares ### */

  async countTotalOrders() {
    const today = new Date();
    const dateFormated = today.toISOString().split('T')[0]

    const totalOrders = await this.orderRepository
        .createQueryBuilder('order')
        .select('COUNT(DISTINCT order.id)', 'total')
        .where('order.status = :status', { status: "PAGO" })
        .andWhere('DATE(order.updated_at) = :date', { date: dateFormated })
        .getRawOne();

    return totalOrders.total;
  }

  async percentComplete() {
    const today = new Date();
    const dateFormated = today.toISOString().split('T')[0]

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.store', 'store')
      .innerJoin('store.store_association', 'store_association')
      .select('order.status')
      .where('DATE(order.created_at) = :date', { date: dateFormated })
      .andWhere('order.status = :status', {status: "PAGO"})
      .getRawMany();
    
    const totalOrdersDelivereds = orders
      .filter(order => order.order_status === "FINALIZADO").length;
    const result = (totalOrdersDelivereds * 100) / orders.length;

    return result;

  }

  async countTotalAmountOrders() {
    const today = new Date();
    const dateFormated = today.toISOString().split('T')[0]

    const totalOrders = await this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total_amount)', 'total' )
        .where('order.status = :status', { status: "PAGO" })
        .andWhere('DATE(order.updated_at) = :date', { date: dateFormated })
        .getRawOne();

        return totalOrders.total;
  }
}