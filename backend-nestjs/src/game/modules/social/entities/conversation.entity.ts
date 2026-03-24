import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { ChatMessage } from './chat-message.entity';

@Entity()
@Index(['player1Id', 'player2Id'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, { eager: false, onDelete: 'CASCADE' })
  player1: Player;

  @Column()
  player1Id: number;

  @ManyToOne(() => Player, { eager: false, onDelete: 'CASCADE' })
  player2: Player;

  @Column()
  player2Id: number;

  @OneToMany(() => ChatMessage, (msg) => msg.conversation)
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
