import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Café Expresso',
      description: 'Um café forte e encorpado.',
      price: 5.5,
    };

    it('should create a new product without an image', async () => {
      mockProductsService.create.mockResolvedValue({ id: 1, ...createProductDto });
      const result = await controller.create(createProductDto, undefined as any);

      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual({ id: 1, ...createProductDto });
    });

    it('should create a new product with an image', async () => {
      const mockFile = { path: 'uploads/products/image.jpg' } as any;
      const dtoWithImage = { ...createProductDto, image: mockFile.path };

      mockProductsService.create.mockResolvedValue({ id: 1, ...dtoWithImage });
      const result = await controller.create(createProductDto, mockFile);

      expect(mockProductsService.create).toHaveBeenCalledWith(dtoWithImage);
      expect(result).toEqual({ id: 1, ...dtoWithImage });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [{ id: 1, name: 'Café Expresso', price: 5.5 }];
      mockProductsService.findAll.mockResolvedValue(products);
      const result = await controller.findAll();
      expect(mockProductsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = '1';
      const product = { id: 1, name: 'Café Expresso', price: 5.5 };
      mockProductsService.findOne.mockResolvedValue(product);
      const result = await controller.findOne(productId);
      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    const productId = '1';
    const updateProductDto: UpdateProductDto = { price: 6.0 };

    it('should update a product without an image', async () => {
      const updateResult = { message: 'Produto atualizado com sucesso' };
      mockProductsService.update.mockResolvedValue(updateResult);
      const result = await controller.update(productId, updateProductDto, undefined as any);
      expect(mockProductsService.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toEqual(updateResult);
    });

    it('should update a product with an image', async () => {
      const mockFile = { path: 'uploads/products/new-image.jpg' } as any;
      const dtoWithImage = { ...updateProductDto, image: mockFile.path };
      const updateResult = { message: 'Produto atualizado com sucesso' };

      mockProductsService.update.mockResolvedValue(updateResult);
      const result = await controller.update(productId, updateProductDto, mockFile);

      expect(mockProductsService.update).toHaveBeenCalledWith(1, dtoWithImage);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = '1';
      const deleteResult = { message: 'Produto removido com sucesso' };
      mockProductsService.remove.mockResolvedValue(deleteResult);
      const result = await controller.remove(productId);
      expect(mockProductsService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
