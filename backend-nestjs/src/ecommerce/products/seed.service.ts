import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as productData from '../../game/data/products.data.json';
import { Product } from './entities/product.entity';

interface IProductData {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    console.log('[ProductsSeedService] Seeding/Updating Products...');
    await this.seedProducts();
  }

  private async seedProducts() {
    const typedProductData = productData as IProductData[];

    for (const data of typedProductData) {
      const imageUrl = `https://gigio42.github.io/Coffeemon/products/${data.image}`;
      const existingProduct = await this.productRepository.findOne({ where: { name: data.name } });

      if (existingProduct) {
        if (existingProduct.image !== imageUrl) {
          existingProduct.image = imageUrl;
          await this.productRepository.save(existingProduct);
        }
      } else {
        const productToCreate = this.productRepository.create({
          name: data.name,
          description: data.description,
          price: data.price,
          image: imageUrl,
        });
        await this.productRepository.save(productToCreate);
      }
    }

    console.log('[ProductsSeedService] Product seeding complete!');
  }
}
