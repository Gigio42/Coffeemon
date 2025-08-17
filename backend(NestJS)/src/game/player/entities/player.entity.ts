import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../ecommerce/users/entities/user.entity';
import { PlayerCoffeemons } from './playerCoffeemons.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.player)
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  coins: number;

  @Column()
  level: number;

  @Column()
  experience: number;

  @OneToMany(() => PlayerCoffeemons, (playerCoffeemon) => playerCoffeemon.player)
  coffeemons: PlayerCoffeemons[];
}
