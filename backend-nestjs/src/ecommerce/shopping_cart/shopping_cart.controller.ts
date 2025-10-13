import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddItemToShoppingCartDto } from './dto/add-item-to-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';
import { ShoppingCartService } from './shopping_cart.service';

@UseGuards(AuthGuard)
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  addItemToShoppingCart(
    @GetUser('id') userId: number,
    @Body() createShoppingCartDto: AddItemToShoppingCartDto
  ) {
    console.log('🔍 Shopping Cart - UserId recebido:', userId);
    return this.shoppingCartService.addItemToShoppingCart(userId, createShoppingCartDto);
  }

  @Get()
  findOne(@GetUser('id') userId: number) {
    return this.shoppingCartService.findOne(userId);
  }

  @Put()
  updateQuantity(
    @GetUser('id') userId: number,
    @Body() updateShoppingCartDto: UpdateShoppingCartDto
  ) {
    console.log('🔄 PUT /shopping-cart - UserId:', userId, 'DTO:', updateShoppingCartDto);
    return this.shoppingCartService.updateQuantity(userId, updateShoppingCartDto);
  }

  @Delete(':productId')
  remove(@GetUser('id') userId: number, @Param('productId') productId: string) {
    console.log('🗑️ DELETE /shopping-cart/:productId - UserId:', userId, 'ProductId:', productId);
    return this.shoppingCartService.remove(userId, +productId);
  }
}
