import { Move } from 'src/game/modules/battles/types/batlle.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  moves: Move[];
}
