import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

@Entity()
@Index(['requesterId', 'addresseeId'], { unique: true })
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, { eager: false, onDelete: 'CASCADE' })
  requester: Player;

  @Column()
  requesterId: number;

  @ManyToOne(() => Player, { eager: false, onDelete: 'CASCADE' })
  addressee: Player;

  @Column()
  addresseeId: number;

  @Column({ type: 'varchar', default: FriendshipStatus.PENDING })
  status: FriendshipStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
