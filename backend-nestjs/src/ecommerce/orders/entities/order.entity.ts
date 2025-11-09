import { OrderStatus } from 'src/Shared/enums/order_status';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order_item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  total_amount: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  total_quantity: number;

  @Column({ type: 'varchar', enum: OrderStatus, nullable: false })
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @UpdateDateColumn()
  updated_at: Date;
}
