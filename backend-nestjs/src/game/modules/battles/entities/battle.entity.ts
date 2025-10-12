import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Type } from 'class-transformer';

@Entity()
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Type(() => Number)
  player1Id: number;

  @Column()
  @Type(() => Number)
  player2Id: number;

  @Column()
  player1SocketId: string;

  @Column()
  player2SocketId: string;

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'FINISHED';

  @Column({ nullable: true })
  winnerId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  endedAt: Date;
}
