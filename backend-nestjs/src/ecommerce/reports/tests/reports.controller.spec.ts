import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { ReportsService } from '../reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockReportsService = {
    getOrdersPerHour: jest.fn(),
    findAllClients: jest.fn(),
    getCardsInfo: jest.fn(),
    countTotalAmount: jest.fn(),
    getDetailsByOrderId: jest.fn(),
    getFinishedOrders: jest.fn(),
    getTopProductsPerDay: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrdersPerHour', () => {
    it('should call getOrdersPerHour service method', async () => {
      const date = '2023-10-27';
      await controller.getOrdersPerHour(date);
      expect(mockReportsService.getOrdersPerHour).toHaveBeenCalledWith(date);
    });
  });

  describe('findAllClientsByStoreId', () => {
    it('should call findAllClients service method', async () => {
      await controller.findAllClientsByStoreId();
      expect(mockReportsService.findAllClients).toHaveBeenCalled();
    });
  });

  describe('getCardsInfo', () => {
    it('should call getCardsInfo service method', async () => {
      await controller.getCardsInfo();
      expect(mockReportsService.getCardsInfo).toHaveBeenCalled();
    });
  });

  describe('countTotalAmount', () => {
    it('should call countTotalAmount service method', async () => {
      await controller.countTotalAmount();
      expect(mockReportsService.countTotalAmount).toHaveBeenCalled();
    });
  });

  describe('getDetailsByOrderId', () => {
    it('should call getDetailsByOrderId service method', async () => {
      const orderId = '1';
      await controller.getDetailsByOrderId(orderId, 1);
      expect(mockReportsService.getDetailsByOrderId).toHaveBeenCalledWith(+orderId);
    });
  });

  describe('getFinishedOrders', () => {
    it('should call getFinishedOrders service method', async () => {
      await controller.getFinishedOrders();
      expect(mockReportsService.getFinishedOrders).toHaveBeenCalled();
    });
  });

  describe('getTopProductsPerDay', () => {
    it('should call getTopProductsPerDay service method', async () => {
      await controller.getTopProductsPerDay();
      expect(mockReportsService.getTopProductsPerDay).toHaveBeenCalled();
    });
  });
});
