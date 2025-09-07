import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
  }))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    console.log(file.path);
    (file) ? (createProductDto.image = file.path): null;
    return this.productsService.create(createProductDto);
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
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: '.uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
  }))
  update(@Param('productId') productId: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {
    (file) ? updateProductDto.image = file.path : null
    return this.productsService.update(+productId, updateProductDto);
  }

  @Delete(':productId')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  remove(@Param('productId') productId: string) {
    return this.productsService.remove(+productId);
  }
}


