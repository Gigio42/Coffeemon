import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  cost: number;

  @Column({ type: 'simple-json' })
  effects: Record<string, any>[];
}
