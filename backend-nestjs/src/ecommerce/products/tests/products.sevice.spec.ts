import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    softDelete: jest.fn(),
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
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Café',
      description: 'Café preto',
      price: 5,
    };

    it('should create a product', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createProductDto);
      const result = await service.create(createProductDto);
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual({ message: 'Produto criado com sucesso' });
    });

    it('should throw a conflict exception if product already exists', async () => {
      mockRepository.findOneBy.mockResolvedValue(createProductDto);
      await expect(service.create(createProductDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Café', description: 'Café preto', price: 5 }];
      mockRepository.find.mockResolvedValue(products);
      const result = await service.findAll();
      expect(result).toEqual({ products });
    });

    it('should return a message if no products are found', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual({ message: 'Nenhum produto encontrado' });
    });
  });

  describe('findOne', () => {
    it('should return a product by calling findProductById', async () => {
      const product = { id: 1, name: 'Café' };

      const findByIdSpy = jest.spyOn(service, 'findProductById').mockResolvedValue(product as any);
      const result = await service.findOne(1);
      expect(findByIdSpy).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });
  });

  describe('findProductById', () => {
    it('should return a product when found', async () => {
      const product = { id: 1, name: 'Café' };
      mockRepository.findOneBy.mockResolvedValue(product);
      const result = await service.findProductById(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findProductById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateProductDto: UpdateProductDto = { name: 'Café com Leite', price: 6 };
    const product = { id: 1, name: 'Café', description: 'Café preto', price: 5 };

    it('should update a product', async () => {
      const findByIdSpy = jest.spyOn(service, 'findProductById').mockResolvedValue(product as any);
      mockRepository.merge.mockReturnValue({ ...product, ...updateProductDto });
      const result = await service.update(1, updateProductDto);
      expect(findByIdSpy).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith({ ...product, ...updateProductDto });
      expect(result).toEqual({ message: 'Produto atualizado com sucesso' });
    });

    it('should throw NotFoundException if product to update is not found', async () => {
      jest.spyOn(service, 'findProductById').mockRejectedValue(new NotFoundException());
      await expect(service.update(999, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const product = { id: 1, name: 'Café', description: 'Café preto', price: 5 };

    it('should remove a product', async () => {
      jest.spyOn(service, 'findProductById').mockResolvedValue(product as any);
      const result = await service.remove(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(product.id);
      expect(result).toEqual({ message: 'Produto removido com sucesso' });
    });

    it('should throw NotFoundException if product to remove is not found', async () => {
      jest.spyOn(service, 'findProductById').mockRejectedValue(new NotFoundException());
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
