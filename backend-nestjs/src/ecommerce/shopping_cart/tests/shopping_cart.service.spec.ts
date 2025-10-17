import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order_item.entity';
import { ProductsService } from '../../products/products.service';
import { UsersService } from '../../users/users.service';
import { AddItemToShoppingCartDto } from '../dto/add-item-to-shopping_cart.dto';
import { ShoppingCartService } from '../shopping_cart.service';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let shoppingCartRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;

  const mockShoppingCartRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockOrderItemRepository = {
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductsService = {
    findProductById: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        { provide: getRepositoryToken(Order), useValue: mockShoppingCartRepository },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepository },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ShoppingCartService>(ShoppingCartService);
    shoppingCartRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItemToShoppingCart', () => {
    const userId = 1;
    const product = { id: 1, name: 'Test Product', price: 10 };
    const addItemDto: AddItemToShoppingCartDto = { productId: product.id, quantity: 2 };

    it('should add a new item to an empty cart', async () => {
      const order = { id: 1, orderItem: [] };
      jest.spyOn(service, 'getOrCreateShoppingCart').mockResolvedValue(order as any);
      mockProductsService.findProductById.mockResolvedValue(product);
      mockOrderItemRepository.create.mockImplementation((dto) => dto);

      const result = await service.addItemToShoppingCart(userId, addItemDto);

      expect(mockOrderItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          order,
          product,
          quantity: addItemDto.quantity,
          unit_price: product.price,
          total: product.price * addItemDto.quantity,
        })
      );
      expect(result.message).toBe('Produto adicionado ao carrinho');
    });

    it('should update quantity if product already exists in cart', async () => {
      const existingItem = { id: 10, product: { id: 1 } };
      const order = { id: 1, orderItem: [existingItem] };
      jest.spyOn(service, 'getOrCreateShoppingCart').mockResolvedValue(order as any);
      mockProductsService.findProductById.mockResolvedValue(product);

      const result = await service.addItemToShoppingCart(userId, addItemDto);

      expect(mockOrderItemRepository.update).toHaveBeenCalledWith(existingItem.id, {
        quantity: addItemDto.quantity,
      });
      expect(result.message).toBe('Quantidade do produto atualizada');
    });

    it('should add a new product to a cart that already has other items', async () => {
      const newItemDto: AddItemToShoppingCartDto = { productId: 2, quantity: 1 };
      const newProduct = { id: 2, name: 'New Product', price: 20 };
      const existingItem = { id: 10, product: { id: 1 } };
      const order = { id: 1, orderItem: [existingItem] };

      jest.spyOn(service, 'getOrCreateShoppingCart').mockResolvedValue(order as any);
      mockProductsService.findProductById.mockResolvedValue(newProduct);
      mockOrderItemRepository.create.mockImplementation((dto) => dto);

      const result = await service.addItemToShoppingCart(userId, newItemDto);

      expect(mockOrderItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          product: newProduct,
          order,
          quantity: newItemDto.quantity,
          unit_price: newProduct.price,
          total: newProduct.price * newItemDto.quantity,
        })
      );
      expect(result.message).toBe('Produto adicionado ao carrinho');
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity and return success message', async () => {
      const dto = { productId: 1, quantity: 5 };
      const cart = { id: 1 };
      const item = { id: 10, product: { price: 10 } };
      jest.spyOn(service, 'findShoppingCartByUserId').mockResolvedValue(cart as any);
      mockOrderItemRepository.findOne.mockResolvedValue(item);

      const result = await service.updateQuantity(1, dto);

      expect(mockOrderItemRepository.update).toHaveBeenCalledWith(item.id, {
        quantity: dto.quantity,
        total: 50,
      });
      expect(result).toEqual({ message: 'Quantidade do produto alterada' });
    });

    it('should throw NotFoundException if item is not in the cart', async () => {
      const dto = { productId: 99, quantity: 5 };
      jest.spyOn(service, 'findShoppingCartByUserId').mockResolvedValue({ id: 1 } as any);
      mockOrderItemRepository.findOne.mockResolvedValue(null);

      await expect(service.updateQuantity(1, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an item and return success message', async () => {
      const productId = 1;
      const cart = { id: 1 };
      const item = { id: 10 };
      jest.spyOn(service, 'findShoppingCartByUserId').mockResolvedValue(cart as any);
      mockOrderItemRepository.findOne.mockResolvedValue(item);

      const result = await service.remove(1, productId);

      expect(mockOrderItemRepository.remove).toHaveBeenCalledWith(item);
      expect(result).toEqual({ message: 'Produto removido do carrinho' });
    });

    it('should throw NotFoundException if item to remove is not in the cart', async () => {
      jest.spyOn(service, 'findShoppingCartByUserId').mockResolvedValue({ id: 1 } as any);
      mockOrderItemRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrCreateShoppingCart', () => {
    it('should return an existing cart', async () => {
      const existingCart = { id: 1 };
      mockShoppingCartRepository.findOne.mockResolvedValue(existingCart);
      const cart = await service.getOrCreateShoppingCart(1);
      expect(cart).toEqual(existingCart);
    });

    it('should create a new cart if none exists', async () => {
      mockShoppingCartRepository.findOne.mockResolvedValue(null);
      mockUsersService.findOne.mockResolvedValue({ id: 1, name: 'User Test' });
      const newCart = { id: 2 };
      mockShoppingCartRepository.create.mockReturnValue({});
      mockShoppingCartRepository.save.mockResolvedValue(newCart);

      const cart = await service.getOrCreateShoppingCart(1);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
      expect(mockShoppingCartRepository.save).toHaveBeenCalled();
      expect(cart).toEqual(newCart);
    });
  });

  describe('findShoppingCartByUserId', () => {
    it('should find and return a shopping cart', async () => {
      const existingCart = { id: 1 };
      mockShoppingCartRepository.findOne.mockResolvedValue(existingCart);
      const cart = await service.findShoppingCartByUserId(1);
      expect(cart).toEqual(existingCart);
    });

    it('should throw NotFoundException if cart is not found', async () => {
      mockShoppingCartRepository.findOne.mockResolvedValue(null);
      await expect(service.findShoppingCartByUserId(1)).rejects.toThrow(NotFoundException);
    });
  });
});
