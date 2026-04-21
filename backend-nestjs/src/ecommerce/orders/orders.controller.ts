import { Controller, Get, Post, Body, Param, UseGuards, Patch, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CheckoutItemsDto } from './dto/checkout-items.dto';

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

  @Post('checkout-items')
  @UseGuards(OptionalAuthGuard)
  checkoutWithItems(
    @Body() dto: CheckoutItemsDto,
    @GetUser('id') userId: number | undefined,
  ) {
    return this.ordersService.checkoutWithItems(dto.items, userId);
  }
}
