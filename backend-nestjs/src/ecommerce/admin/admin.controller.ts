import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { OrdersService } from '../orders/orders.service';
import { AuditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';
import { OrderStatus } from 'src/Shared/enums/order_status';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { OrderStatusUpdateDto } from '../orders/dto/order-status-update.dto';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly auditService: AuditService,
    private readonly usersService: UsersService,
  ) {}

  @Get('orders')
  async getAllOrders(@Query('status') status?: string) {
    const orderStatus = status as OrderStatus | undefined;
    return this.ordersService.findAllAdmin(orderStatus);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: OrderStatusUpdateDto,
    @GetUser('id') adminId: number,
    @Req() req: Request,
  ) {
    const updated = await this.ordersService.updateStatus(+id, dto);
    await this.auditService.log({
      action: 'order.status_updated',
      userId: adminId,
      targetId: id,
      targetType: 'Order',
      metadata: { newStatus: dto.status, orderId: +id },
      ipAddress: req.ip,
    });
    return updated;
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
  ) {
    return this.auditService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
      action,
      userId ? +userId : undefined,
    );
  }

  @Get('stats')
  async getStats() {
    const [all, pending, delivered, users] = await Promise.all([
      this.ordersService.findAllAdmin(),
      this.ordersService.findAllAdmin(OrderStatus.FINISHED),
      this.ordersService.findAllAdmin(OrderStatus.DELIVERED),
      this.usersService.findAll(),
    ]);
    const paidOrders = all.filter(
      (o) => o.status !== OrderStatus.SHOPPING_CART && o.status !== OrderStatus.CANCELLED,
    );
    const registeredUsers = users.filter((u) => !u.isGuest);
    const guestUsers = users.filter((u) => u.isGuest);
    return {
      totalOrders: all.length,
      pendingOrders: pending.length,
      deliveredOrders: delivered.length,
      totalRevenue: paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
      registeredUsers: registeredUsers.length,
      guestUsers: guestUsers.length,
    };
  }

  @Get('analytics')
  async getAnalytics() {
    const all = await this.ordersService.findAllAdmin();
    const paidOrders = all.filter(
      (o) => o.status !== OrderStatus.SHOPPING_CART && o.status !== OrderStatus.CANCELLED,
    );

    const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const order of paidOrders) {
      for (const item of order.orderItem ?? []) {
        const key = item.product?.name ?? `#${item.id}`;
        const existing = productMap.get(key) ?? { name: key, qty: 0, revenue: 0 };
        existing.qty += item.quantity;
        existing.revenue += Number(item.total);
        productMap.set(key, existing);
      }
    }
    const topProducts = [...productMap.values()]
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const dayMap = new Map<string, { date: string; count: number; revenue: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { date: key, count: 0, revenue: 0 });
    }
    for (const order of paidOrders) {
      const key = new Date(order.updated_at).toISOString().slice(0, 10);
      if (dayMap.has(key)) {
        const day = dayMap.get(key)!;
        day.count += 1;
        day.revenue += Number(order.total_amount);
      }
    }
    const recentDays = [...dayMap.values()];

    return { topProducts, recentDays };
  }
}
