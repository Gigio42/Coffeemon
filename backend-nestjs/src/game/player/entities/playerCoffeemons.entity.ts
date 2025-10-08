import { Move } from 'src/game/battles/types/batlle.types';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coffeemon } from '../../coffeemon/entities/coffeemon.entity';
import { Player } from './player.entity';

@Entity()
export class PlayerCoffeemons {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.coffeemons)
  @JoinColumn()
  player: Player;

  @ManyToOne(() => Coffeemon)
  @JoinColumn()
  coffeemon: Coffeemon;

  @Column()
  hp: number;

  @Column()
  attack: number;

  @Column()
  defense: number;

  @Column()
  level: number;

  @Column()
  experience: number;

  @Column({ default: false })
  isInParty: boolean;

  @Column({ type: 'simple-json', nullable: true })
  customMoves: Move[];
}
