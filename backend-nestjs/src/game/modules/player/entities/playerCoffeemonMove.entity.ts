import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Move } from '../../moves/entities/move.entity';
import { PlayerCoffeemons } from './playerCoffeemons.entity';

@Entity()
export class PlayerCoffeemonMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlayerCoffeemons, (pc) => pc.learnedMoves)
  @JoinColumn()
  playerCoffeemon: PlayerCoffeemons;

  @ManyToOne(() => Move, { eager: true })
  @JoinColumn()
  move: Move;

  @Column()
  slot: number;
}
