import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEffect } from '../../battles/types/battle-state.types';

export enum moveType {
  ATTACK = 'attack',
  SUPPORT = 'support',
}
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

  @Column({ type: 'varchar', enum: moveType })
  type: moveType;

  @Column({ type: 'simple-json', nullable: true })
  effects?: StatusEffect[];
}
