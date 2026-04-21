import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatus } from 'src/Shared/enums/order_status';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { OrdersService } from '../orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;

  const mockOrdersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockOrderItemsRepository = {
    save: jest.fn(),
    create: jest.fn(),
  };
  const mockProductsRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrdersRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemsRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all orders for a user', async () => {
      const userId = 1;
      await service.findAll(userId);
      expect(mockOrdersRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
    });
  });

  describe('findOne', () => {
    it('should return one order for a user', async () => {
      const userId = 1;
      const orderId = 1;
      await service.findOne(userId, orderId);
      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId, user: { id: userId } },
        relations: ['orderItem', 'orderItem.product'],
      });
    });
  });

  describe('checkout', () => {
    it('should checkout an order successfully', async () => {
      const userId = 1;
      const shoppingCart = { id: 1, status: OrderStatus.SHOPPING_CART };
      mockOrdersRepository.findOne.mockResolvedValue(shoppingCart);
      mockOrdersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.checkout(userId);

      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, status: OrderStatus.SHOPPING_CART },
        relations: ['orderItem'],
      });
      expect(mockOrdersRepository.update).toHaveBeenCalledWith(shoppingCart.id, {
        status: OrderStatus.FINISHED,
        total_amount: 0,
        total_quantity: 0,
      });
      expect(result).toEqual('Pedido finalizado');
    });

    it('should throw NotFoundException if shopping cart does not exist', async () => {
      mockOrdersRepository.findOne.mockResolvedValue(null);
      await expect(service.checkout(1)).rejects.toThrow(NotFoundException);
    });

    it('should return an error message on update failure', async () => {
      const userId = 1;
      const shoppingCart = { id: 1, status: OrderStatus.SHOPPING_CART };
      mockOrdersRepository.findOne.mockResolvedValue(shoppingCart);
      const error = new Error('DB error');
      mockOrdersRepository.update.mockRejectedValue(error);

      const result = await service.checkout(userId);

      expect(result).toContain('Erro ao tentar atualizar o status do pedido.');
    });
  });

  describe('checkoutWithItems', () => {
    it('should throw BadRequestException when items are empty', async () => {
      await expect(service.checkoutWithItems([])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a finished order for anonymous checkout', async () => {
      const items = [{ productId: 1, quantity: 2 }];
      const savedOrder = { id: 99 };
      const product = { id: 1, price: 12.5 };

      mockOrdersRepository.create.mockReturnValue({
        status: OrderStatus.FINISHED,
      });
      mockOrdersRepository.save.mockResolvedValue(savedOrder);
      mockProductsRepository.findOne.mockResolvedValue(product);
      mockOrderItemsRepository.create.mockImplementation((data) => data);
      mockOrderItemsRepository.save.mockResolvedValue({});
      mockOrdersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.checkoutWithItems(items);

      expect(mockOrdersRepository.save).toHaveBeenCalled();
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockOrderItemsRepository.save).toHaveBeenCalled();
      expect(mockOrdersRepository.update).toHaveBeenCalledWith(savedOrder.id, {
        total_amount: 25,
        total_quantity: 2,
      });
      expect(result).toEqual({
        message: 'Pedido realizado com sucesso!',
        orderId: savedOrder.id,
      });
    });
  });
});
