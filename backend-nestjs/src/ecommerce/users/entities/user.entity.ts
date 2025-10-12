import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Player } from 'src/game/modules/player/entities/player.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Player, (player) => player.user, { nullable: true })
  player: Player | null;
}
