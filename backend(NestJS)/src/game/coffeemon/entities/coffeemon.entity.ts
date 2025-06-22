import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CoffeemonType {
  FRUITY = 'fruity',
  ROASTED = 'roasted',
  SPICY = 'spicy',
  NUTTY = 'nutty',
  FLORAL = 'floral',
}

@Entity()
export class Coffeemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    enum: CoffeemonType,
  })
  type: CoffeemonType;

  @Column()
  baseHp: number;

  @Column()
  baseAttack: number;

  @Column()
  baseDefense: number;

  @Column()
  imageUrl: string;

  @Column({ type: 'simple-json' })
  moves: {
    id: number;
    name: string;
    power: number;
    type: string;
    description: string;
  }[];
}
