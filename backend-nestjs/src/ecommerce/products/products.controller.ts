import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  // @Roles(UserRole.ADMIN)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const productData = file?.path
      ? { ...createProductDto, image: file.path }
      : createProductDto;

    return this.productsService.create(productData);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':productId')
  findOne(@Param('productId') productId: string) {
    return this.productsService.findOne(+productId);
  }

  @Patch(':productId')
  @UseInterceptors(FileInterceptor('image'))
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const productData = file?.path
      ? { ...updateProductDto, image: file.path }
      : updateProductDto;

    return this.productsService.update(+productId, productData);
  }

  @Delete(':productId')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  remove(@Param('productId') productId: string) {
    return this.productsService.remove(+productId);
  }
}
