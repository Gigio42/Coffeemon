import {
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/orders-by-hour')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getOrdersPerHour(@Query('intervalo') date: string) {
    return this.reportsService.getOrdersPerHour(date);
  }

  @Get('clients')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  findAllClientsByStoreId() {
    return this.reportsService.findAllClients();
  }

  @Get('cards')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getCardsInfo() {
    return this.reportsService.getCardsInfo();
  }

  @Get('total-by-store')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  countTotalAmount() {
    return this.reportsService.countTotalAmount();
  }

  @Get(':orderId/order')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getDetailsByOrderId(@Param('orderId') orderId: string, @GetUser('id') currentUserId: number) {
    return this.reportsService.getDetailsByOrderId(+orderId);
  }

  @Get('/finished-orders')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getFinishedOrders() {
    return this.reportsService.getFinishedOrders();
  }

  @Get('/top-products')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getTopProductsPerDay() {
    return this.reportsService.getTopProductsPerDay();
  }
}
