import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {
    if (await this.productsRepository.findOneBy({ name: createProductDto.name })) {
      throw new ConflictException('Já existe um produto com esse nome');
    }

    const product = this.productsRepository.create(createProductDto);
    this.productsRepository.save(product);

    return { message: 'Produto criado com sucesso' };
  }

  async findAll() {
    const products = await this.productsRepository.find({
      select: ['id', 'name', 'description', 'image', 'price'],
    });

    return products.length === 0
      ? { message: 'Nenhum produto encontrado' }
      : { products: products };
  }

  async findOne(productId: number) {
    return await this.findProductById(productId);
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    const product = await this.findProductById(productId);

    const productUpdated = this.productsRepository.merge(product, updateProductDto);

    await this.productsRepository.save(productUpdated);

    return { message: 'Produto atualizado com sucesso' };
  }

  async remove(productId: number) {
    const product = await this.findProductById(productId);

    await this.productsRepository.softDelete(product.id);

    return { message: 'Produto removido com sucesso' };
  }

  /* ### Funções Auxiliares ### */

  async findProductById(productId: number) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Nenhum produto encontrado com o ID ${productId}`);
    }

    return product;
  }
}
