import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('relatorios')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/pedidos-por-hora')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getOrdersPerHour(@Query('intervalo') date: string) {
    return this.reportsService.getOrdersPerHour(date);
  }
  
  @Get('clientes')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  findAllClientsByStoreId() {
    return this.reportsService.findAllClients();
  }

  @Get('cards')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getCardsInfo() {
    return this.reportsService.getCardsInfo()
  }

  @Get('total-da-loja')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  countTotalAmount() {
    return this.reportsService.countTotalAmount();
  }

  @Get(':orderId/pedido')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getDetailsByOrderId(@Param('orderId') orderId: string, @GetUser('id') currentUserId: number) { 
    return this.reportsService.getDetailsByOrderId(+orderId);
  }

  @Get('/pedidos-finalizados')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getFinishedOrders() {
    return this.reportsService.getFinishedOrders()
  }

  @Get('/top-produtos')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  getTopProductsPerDay() {
    return this.reportsService.getTopProductsPerDay();
  }
}
