import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Move } from '../../moves/entities/move.entity';
import { Coffeemon } from './coffeemon.entity';

export enum MoveLearnMethod {
  LEVEL_UP = 'level_up',
  MACHINE = 'machine', // equivalente a TM/HM/TR
  TUTOR = 'tutor',
  EGG = 'egg',
  EVOLUTION = 'evolution',
  START = 'start',
}

@Entity()
export class CoffeemonLearnsetMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Coffeemon, (coffeemon) => coffeemon.learnset)
  @JoinColumn({ name: 'coffeemonId' })
  coffeemon: Coffeemon;

  @Column()
  coffeemonId: number;

  @ManyToOne(() => Move, { eager: true })
  @JoinColumn({ name: 'moveId' })
  move: Move;

  @Column()
  moveId: number;

  @Column({ type: 'varchar', enum: MoveLearnMethod })
  learnMethod: MoveLearnMethod;

  @Column({ nullable: true })
  levelLearned?: number;
}
