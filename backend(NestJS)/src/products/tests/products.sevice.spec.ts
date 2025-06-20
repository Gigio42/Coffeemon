import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
      };
      const newProduct = { id: 1, ...createProductDto };

      mockRepository.create.mockReturnValue(newProduct);
      mockRepository.save.mockResolvedValue(newProduct);

      const result = await service.create(createProductDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(newProduct);
    });

    it('should throw a ConflictException if product with the same name already exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Existing Product',
        price: 100,
      };

      mockRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Existing Product' });

      await expect(service.create(createProductDto)).rejects.toThrow(
        'Product with this name already exists'
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ name: createProductDto.name });

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = { price: 150 };
      const updateResult = { affected: 1 };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(productId, updateProductDto);

      expect(mockRepository.update).toHaveBeenCalledWith(productId, updateProductDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 1;
      const product = { id: productId, name: 'Test Product', price: 100 };
      mockRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findOne(productId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(result).toEqual(product);
    });

    it('should return null if product not found', async () => {
      const productId = 999;
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(productId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = 1;
      const deleteResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(productId);

      expect(mockRepository.delete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deleteResult);
    });
  });
});
