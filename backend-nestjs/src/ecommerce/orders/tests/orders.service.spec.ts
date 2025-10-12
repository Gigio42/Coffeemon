import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { OrdersService } from '../orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrdersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrderItemsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductsRepository = {
    find: jest.fn(),
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };

      const mockProducts = [
        { id: 1, name: 'Café Expresso', price: 5.0 },
        { id: 2, name: 'Cappuccino', price: 7.5 },
      ];

      const expectedOrder = { id: 1, userId: 1, total: 17.5 };

      const expectedItems = [
        { quantity: 2, price: 5.0, total: 10.0, orderId: 1, productId: 1 },
        { quantity: 1, price: 7.5, total: 7.5, orderId: 1, productId: 2 },
      ];

      mockProductsRepository.find.mockResolvedValue(mockProducts);
      mockOrdersRepository.create.mockReturnValue(expectedOrder);
      mockOrdersRepository.save.mockResolvedValue(expectedOrder);
      mockOrderItemsRepository.create
        .mockReturnValueOnce(expectedItems[0])
        .mockReturnValueOnce(expectedItems[1]);

      await service.create(createOrderDto);

      expect(mockProductsRepository.find).toHaveBeenCalledWith({
        where: { id: In([1, 2]) },
      });

      expect(mockOrdersRepository.create).toHaveBeenCalledWith({
        total: 17.5,
        userId: 1,
      });

      expect(mockOrdersRepository.save).toHaveBeenCalledWith(expectedOrder);

      expect(mockOrderItemsRepository.create).toHaveBeenCalledTimes(2);
      expect(mockOrderItemsRepository.create).toHaveBeenCalledWith({
        quantity: 2,
        price: 5.0,
        total: 10.0,
        orderId: 1,
        productId: 1,
      });
      expect(mockOrderItemsRepository.create).toHaveBeenCalledWith({
        quantity: 1,
        price: 7.5,
        total: 7.5,
        orderId: 1,
        productId: 2,
      });

      expect(mockOrderItemsRepository.save).toHaveBeenCalledWith(expectedItems);
    });
  });

  describe('findAll', () => {
    it('should return all orders with relations', async () => {
      const mockOrders = [
        { id: 1, userId: 1, total: 15.0, items: [] },
        { id: 2, userId: 2, total: 25.5, items: [] },
      ];
      mockOrdersRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(mockOrdersRepository.find).toHaveBeenCalledWith({
        relations: ['items', 'items.product'],
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOne', () => {
    it('should return a single order by id with relations', async () => {
      const orderId = 1;
      const mockOrder = { id: orderId, userId: 1, total: 15.0, items: [] };
      mockOrdersRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId);

      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['items', 'items.product'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should return null if order not found', async () => {
      const orderId = 999;
      mockOrdersRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(orderId);

      expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['items', 'items.product'],
      });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete an order', async () => {
      const orderId = 1;
      const deleteResult = { affected: 1 };
      mockOrdersRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(orderId);

      expect(mockOrdersRepository.delete).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(deleteResult);
    });
  });
});
