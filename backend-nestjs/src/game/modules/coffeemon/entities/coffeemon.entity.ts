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

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  flavorProfile: string;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  height: number;

  @Column({ type: 'simple-array' })
  types: CoffeemonType[];

  @Column()
  baseHp: number;

  @Column()
  baseAttack: number;

  @Column()
  baseDefense: number;

  @Column()
  baseSpeed: number;

  @OneToMany(() => CoffeemonLearnsetMove, (learnsetMove) => learnsetMove.coffeemon)
  learnset: CoffeemonLearnsetMove[];
}
