import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CoffeemonLearnsetMove } from './coffeemon-learnset-move.entity';

export enum CoffeemonType {
  FRUITY = 'fruity',
  ROASTED = 'roasted',
  SPICY = 'spicy',
  SOUR = 'sour',
  NUTTY = 'nutty',
  FLORAL = 'floral',
  SWEET = 'sweet',
}

@Entity()
export class Coffeemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', enum: CoffeemonType })
  type: CoffeemonType;

  @Column()
  baseHp: number;

  @Column()
  baseAttack: number;

  @Column()
  baseDefense: number;

  @Column()
  baseSpeed: number;

  @Column({ nullable: true })
  defaultImage?: string;

  @Column({ nullable: true })
  backImage?: string;

  @Column({ nullable: true })
  hurtImage?: string;

  @OneToMany(() => CoffeemonLearnsetMove, (learnsetMove) => learnsetMove.coffeemon)
  learnset: CoffeemonLearnsetMove[];
}
