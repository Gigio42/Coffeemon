import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddItemToShoppingCartDto } from '../dto/add-item-to-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCartController } from '../shopping_cart.controller';
import { ShoppingCartService } from '../shopping_cart.service';

describe('ShoppingCartController', () => {
  let controller: ShoppingCartController;

  const mockShoppingCartService = {
    addItemToShoppingCart: jest.fn(),
    findOne: jest.fn(),
    updateQuantity: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingCartController],
      providers: [
        {
          provide: ShoppingCartService,
          useValue: mockShoppingCartService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ShoppingCartController>(ShoppingCartController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addItemToShoppingCart', () => {
    it('should call addItemToShoppingCart service with correct params', async () => {
      const userId = 1;
      const addItemDto: AddItemToShoppingCartDto = { productId: 1, quantity: 1 };
      await controller.addItemToShoppingCart(userId, addItemDto);
      expect(mockShoppingCartService.addItemToShoppingCart).toHaveBeenCalledWith(
        userId,
        addItemDto
      );
    });
  });

  describe('findOne', () => {
    it('should call findOne service with userId', async () => {
      const userId = 1;
      await controller.findOne(userId);
      expect(mockShoppingCartService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateQuantity', () => {
    it('should call updateQuantity service with correct params', async () => {
      const userId = 1;
      const updateDto: UpdateShoppingCartDto = { productId: 1, quantity: 2 };
      await controller.updateQuantity(userId, updateDto);
      expect(mockShoppingCartService.updateQuantity).toHaveBeenCalledWith(userId, updateDto);
    });
  });

  describe('remove', () => {
    it('should call remove service with correct params', async () => {
      const userId = 1;
      const productId = '1';
      await controller.remove(userId, productId);
      expect(mockShoppingCartService.remove).toHaveBeenCalledWith(userId, +productId);
    });
  });
});
