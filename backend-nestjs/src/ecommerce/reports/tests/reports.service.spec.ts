import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from 'src/ecommerce/orders/entities/order.entity';
import { User } from 'src/ecommerce/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ReportsService } from '../reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    limit: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getQuery: jest.fn().mockReturnValue(''),
    setParameters: jest.fn().mockReturnThis(),
  };

  const mockOrderRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    manager: {
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrdersPerHour', () => {
    it('should return a list of orders per hour for a valid date', async () => {
      const date = '2025-10-12';
      const dbResult = [{ hour: '14:00', total: '3' }];
      mockQueryBuilder.getRawMany.mockResolvedValue(dbResult);

      const result = await service.getOrdersPerHour(date);

      expect(mockOrderRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.find((r) => r.hour === '14:00')?.total).toBe(3);
      expect(result.find((r) => r.hour === '15:00')?.total).toBe(0);
      expect(result.length).toBe(24);
    });

    it('should use today date if date is not provided', async () => {
      const today = new Date().toISOString().slice(0, 10);
      mockQueryBuilder.getRawMany.mockResolvedValue([]);
      await service.getOrdersPerHour('');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('DATE(order.updated_at) = :date', {
        date: today,
      });
    });

    it('should throw BadRequestException for an invalid date format', async () => {
      await expect(service.getOrdersPerHour('invalid-date')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getDetailsByOrderId', () => {
    it('should return formatted order details when order is found', async () => {
      const mockOrder = {
        id: 1,
        status: 'FINISHED',
        total_amount: 100,
        orderItem: [
          {
            id: 10,
            quantity: 2,
            unit_price: 50,
            product: { id: 1, name: 'Product A', description: 'Desc A', image: 'img.png' },
          },
        ],
      };
      mockQueryBuilder.getOne.mockResolvedValue(mockOrder);
      const result = await service.getDetailsByOrderId(1);
      expect(mockOrderRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.order_product[0].product.name).toBe('Product A');
    });

    it('should throw NotFoundException if order is not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(service.getDetailsByOrderId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFinishedOrders', () => {
    it('should return a list of formatted finished orders', async () => {
      const mockOrders = [
        {
          id: 1,
          status: 'FINISHED',
          total_amount: 100,
          orderItem: [{ quantity: 2, unit_price: 50, product: {} }],
        },
      ];
      mockQueryBuilder.getMany.mockResolvedValue(mockOrders);
      const result = await service.getFinishedOrders();
      expect(result[0].id).toBe(1);
      expect(result[0].total_items).toBe(2);
    });
  });
});
