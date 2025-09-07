import { OrderItem } from '../../orders/entities/orderitem.entity';
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false})
  name: string;

  @Column({ type: 'varchar', nullable: false})
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', nullable: false})
  image: string;

  @DeleteDateColumn({ type:'date'})
  deleted_at: Date;

  @OneToMany(() => OrderItem, (item) => item.product)
  items: OrderItem[];
}
