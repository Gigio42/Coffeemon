import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { PlayerCoffeemon } from './playercoffeemon.entity';

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

  @Column({ default: false })
  isInParty: boolean;

  @OneToMany(() => PlayerCoffeemon, (playerCoffeemon) => playerCoffeemon.player)
  coffeemons: PlayerCoffeemon[];
}
