import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/Shared/enums/order_status';

export class OrderStatusUpdateDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
