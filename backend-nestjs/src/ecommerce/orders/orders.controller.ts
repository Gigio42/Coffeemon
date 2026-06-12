import { Controller, Get, Post, Body, Param, UseGuards, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CheckoutItemsDto } from './dto/checkout-items.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly auditService: AuditService,
  ) {}

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
  async checkoutWithItems(
    @Body() dto: CheckoutItemsDto,
    @GetUser('id') userId: number | undefined,
    @Req() req: Request,
  ) {
    const result = await this.ordersService.checkoutWithItems(dto.items, userId);
    void this.auditService.log({
      action: 'order.created',
      userId: userId ?? null,
      targetId: result.orderId,
      targetType: 'Order',
      metadata: { itemCount: dto.items.length, orderId: result.orderId },
      ipAddress: req.ip,
    });
    return result;
  }
}
