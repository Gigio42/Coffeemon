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

  @Column({ type: 'simple-json' })
  battleState: {
    player1: {
      activeCoffeemonIndex: number;
      coffeemons: {
        id: number;
        name: string;
        currentHp: number;
        maxHp: number;
        attack: number;
        defense: number;
        moves: {
          id: number;
          name: string;
          power: number;
          type: string;
        }[];
      }[];
    };
    player2: {
      activeCoffeemonIndex: number;
      coffeemons: {
        id: number;
        name: string;
        currentHp: number;
        maxHp: number;
        attack: number;
        defense: number;
        moves: {
          id: number;
          name: string;
          power: number;
          type: string;
        }[];
      }[];
    };
    turn: number;
    currentPlayerId: number;
    battleStatus: 'ACTIVE' | 'FINISHED';
    winnerId?: number;
  };

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'FINISHED';

  @Column({ nullable: true })
  winnerId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
