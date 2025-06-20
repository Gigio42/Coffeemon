import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        products: [
          { quantity: 2, productId: 1 },
          { quantity: 1, productId: 2 },
        ],
      };

      const expectedResult = {
        id: 1,
        userId: 1,
        total: 25.5,
        items: [
          { id: 1, orderId: 1, productId: 1, quantity: 2, price: 10.0 },
          { id: 2, orderId: 1, productId: 2, quantity: 1, price: 5.5 },
        ],
      };

      mockOrdersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const expectedOrders = [
        {
          id: 1,
          userId: 1,
          total: 25.5,
          items: [{ id: 1, orderId: 1, productId: 1, quantity: 2 }],
        },
        {
          id: 2,
          userId: 2,
          total: 15.75,
          items: [{ id: 2, orderId: 2, productId: 3, quantity: 1 }],
        },
      ];
      mockOrdersService.findAll.mockResolvedValue(expectedOrders);

      const result = await controller.findAll();

      expect(mockOrdersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedOrders);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const orderId = '1';
      const expectedOrder = {
        id: 1,
        userId: 1,
        total: 25.5,
        items: [{ id: 1, orderId: 1, productId: 1, quantity: 2 }],
      };
      mockOrdersService.findOne.mockResolvedValue(expectedOrder);

      const result = await controller.findOne(orderId);

      expect(mockOrdersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const orderId = '1';
      const expectedResult = { affected: 1 };
      mockOrdersService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(orderId);

      expect(mockOrdersService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
