import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEffect } from '../../battles/types/batlle.types';

@Entity()
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  power: number;

  @Column()
  type: string;

  @Column({ type: 'simple-json', nullable: true })
  effects?: StatusEffect[];
}
