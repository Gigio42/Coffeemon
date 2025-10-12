import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { AddItemToShoppingCartDto } from './dto/add-item-to-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@UseGuards(AuthGuard)
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  addItemToShoppingCart(@GetUser('id') userId: number, @Body() createShoppingCartDto: AddItemToShoppingCartDto) {
    return this.shoppingCartService.addItemToShoppingCart(userId, createShoppingCartDto);
  }

  @Get()
  findOne(@GetUser('id') userId: number) {
    return this.shoppingCartService.findOne(userId);
  }

  @Put()
  updateQuantity(@GetUser('id') userId: number, @Body() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.updateQuantity(userId, updateShoppingCartDto);
  }

  @Delete(':productId')
  remove(@GetUser('id') userId: number, @Param('productId') productId: string) {
    return this.shoppingCartService.remove(userId, +productId);
  }
}
