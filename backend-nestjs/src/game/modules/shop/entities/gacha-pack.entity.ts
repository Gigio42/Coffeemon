import { CoffeemonType } from '../../coffeemon/entities/coffeemon.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GachaPack {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  cost: number;

  @Column({ type: 'simple-array' })
  notes: CoffeemonType[];
}
