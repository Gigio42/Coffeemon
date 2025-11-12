import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffeemon } from '../../coffeemon/entities/coffeemon.entity';
import { Player } from './player.entity';
import { PlayerCoffeemonMove } from './playerCoffeemonMove.entity';
import { CoffeemonStats } from '../../coffeemon/Types/coffeemon-stats.types';

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
  level: number;

  @Column()
  experience: number;

  @Column({ default: false })
  isInParty: boolean;

  @Column({ type: 'simple-json', nullable: true })
  evs: CoffeemonStats;

  @OneToMany(() => PlayerCoffeemonMove, (pcm) => pcm.playerCoffeemon)
  learnedMoves: PlayerCoffeemonMove[];
}
