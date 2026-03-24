import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conv) => conv.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @Column()
  conversationId: string;

  @ManyToOne(() => Player, { eager: false, onDelete: 'CASCADE' })
  sender: Player;

  @Column()
  senderId: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
