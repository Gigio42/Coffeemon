import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@GetUser('id') userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get(':orderId')
  @UseGuards(AuthGuard)
  findOne(@GetUser('id') userId: number, @Param('orderId') orderId: string) {
    return this.ordersService.findOne(userId, +orderId);
  }

  @Patch()
  @UseGuards(AuthGuard)
  checkout(@GetUser('id') userId: number) {
    return this.ordersService.checkout(userId);
  }
}
