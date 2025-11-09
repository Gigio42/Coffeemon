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
    if ((await this.productRepository.count()) === 0) {
      console.log('[ProductsSeedService] Seeding Products...');
      await this.seedProducts();
    } else {
      console.log('[ProductsSeedService] Products already seeded.');
    }
  }

  private async seedProducts() {
    const typedProductData = productData as IProductData[];

    const productsToCreate: Partial<Product>[] = typedProductData.map((data) => ({
      name: data.name,
      description: data.description,
      price: data.price,
      image: `/imgs/products/${data.image}`,
    }));

    await this.productRepository.save(productsToCreate);
    console.log('[ProductsSeedService] Product seeding complete!');
  }
}
