import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret'
    })
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
