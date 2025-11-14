import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEffect } from '../../battles/types/battle-state.types';
import { CoffeemonType } from '../../coffeemon/entities/coffeemon.entity';

export enum moveType {
  ATTACK = 'attack',
  SUPPORT = 'support',
}

export enum MoveCategory {
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

  @Column({ type: 'varchar', enum: MoveCategory })
  category: MoveCategory;

  @Column({ type: 'varchar', enum: CoffeemonType, nullable: true })
  elementalType: CoffeemonType | null;

  @Column({ type: 'simple-json', nullable: true })
  effects?: StatusEffect[];
}
