import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    checkout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAll service with userId', async () => {
      const mockUserId = 1;
      await controller.findAll(mockUserId);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('findOne', () => {
    it('should call findOne service with userId and orderId', async () => {
      const mockUserId = 1;
      const mockOrderId = '1';
      await controller.findOne(mockUserId, mockOrderId);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith(mockUserId, +mockOrderId);
    });
  });

  describe('checkout', () => {
    it('should call checkout service with userId', async () => {
      const mockUserId = 1;
      await controller.checkout(mockUserId);
      expect(mockOrdersService.checkout).toHaveBeenCalledWith(mockUserId);
    });
  });
});
