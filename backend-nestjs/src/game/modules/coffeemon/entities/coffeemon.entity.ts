import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Move } from '../../moves/entities/move.entity';

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

  @ManyToMany(() => Move, { eager: true })
  @JoinTable()
  moves: Move[];
}
