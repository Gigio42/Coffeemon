import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from './order_item.entity';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from 'src/Shared/enums/order_status';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0})
  total_amount: number;

  @Column({ type: 'integer', nullable: false, default: 0})
  total_quantity: number;

  @Column({ type: 'varchar', enum: OrderStatus, nullable: false})
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @UpdateDateColumn()
  updated_at: Date;
}
