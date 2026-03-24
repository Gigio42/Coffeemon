import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SocialFriendRequestAcceptedEvent,
  SocialFriendRequestSentEvent,
  SocialMessageSentEvent,
} from 'src/game/shared/events/game.events';
import { Repository } from 'typeorm';
import { ContentFilterService } from 'src/game/shared/content-filter/content-filter.service';
import { Player } from '../player/entities/player.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Conversation } from './entities/conversation.entity';
import { Friendship, FriendshipStatus } from './entities/friendship.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepo: Repository<Friendship>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(ChatMessage)
    private messageRepo: Repository<ChatMessage>,
    @InjectRepository(Player)
    private playerRepo: Repository<Player>,
    private eventEmitter: EventEmitter2,
    private contentFilter: ContentFilterService
  ) {}

  async sendFriendRequest(requesterPlayerId: number, targetUid: string) {
    const target = await this.playerRepo.findOne({
      where: { uid: targetUid.toUpperCase() },
      relations: ['user'],
    });
    if (!target) throw new NotFoundException(`Jogador com UID "${targetUid}" não encontrado`);
    if (target.id === requesterPlayerId)
      throw new BadRequestException('Você não pode adicionar a si mesmo');

    const existing = await this.friendshipRepo.findOne({
      where: [
        { requesterId: requesterPlayerId, addresseeId: target.id },
        { requesterId: target.id, addresseeId: requesterPlayerId },
      ],
    });
    if (existing) {
      if (existing.status === FriendshipStatus.ACCEPTED)
        throw new BadRequestException('Vocês já são amigos');
      throw new BadRequestException('Pedido de amizade já enviado');
    }

    const requester = await this.playerRepo.findOne({
      where: { id: requesterPlayerId },
      relations: ['user'],
    });

    const friendship = this.friendshipRepo.create({
      requesterId: requesterPlayerId,
      addresseeId: target.id,
      status: FriendshipStatus.PENDING,
    });
    const saved = await this.friendshipRepo.save(friendship);

    this.eventEmitter.emit(
      'social.friend.request.sent',
      new SocialFriendRequestSentEvent(
        requesterPlayerId,
        target.id,
        saved.id,
        requester?.user?.username ?? 'Desconhecido'
      )
    );

    return { message: 'Pedido de amizade enviado' };
  }

  async acceptFriendRequest(addresseePlayerId: number, requestId: number) {
    const friendship = await this.friendshipRepo.findOne({ where: { id: requestId } });
    if (!friendship) throw new NotFoundException('Pedido de amizade não encontrado');
    if (friendship.addresseeId !== addresseePlayerId)
      throw new ForbiddenException('Não autorizado');
    if (friendship.status !== FriendshipStatus.PENDING)
      throw new BadRequestException('Pedido já processado');

    friendship.status = FriendshipStatus.ACCEPTED;
    await this.friendshipRepo.save(friendship);

    const acceptor = await this.playerRepo.findOne({
      where: { id: addresseePlayerId },
      relations: ['user'],
    });
    this.eventEmitter.emit(
      'social.friend.request.accepted',
      new SocialFriendRequestAcceptedEvent(
        requestId,
        addresseePlayerId,
        acceptor?.user?.username ?? 'Desconhecido',
        friendship.requesterId
      )
    );

    return { message: 'Pedido de amizade aceito' };
  }

  async getFriends(playerId: number) {
    const friendships = await this.friendshipRepo.find({
      where: [
        { requesterId: playerId, status: FriendshipStatus.ACCEPTED },
        { addresseeId: playerId, status: FriendshipStatus.ACCEPTED },
      ],
      relations: ['requester', 'requester.user', 'addressee', 'addressee.user'],
    });

    return friendships.map((f) => {
      const friend = f.requesterId === playerId ? f.addressee : f.requester;
      return {
        id: f.id,
        playerId: friend.id,
        uid: friend.uid,
        username: friend.user?.username ?? 'Desconhecido',
        avatar: null,
      };
    });
  }

  async getFriendRequests(playerId: number) {
    const requests = await this.friendshipRepo.find({
      where: { addresseeId: playerId, status: FriendshipStatus.PENDING },
      relations: ['requester', 'requester.user'],
    });

    return requests.map((r) => ({
      id: r.id,
      fromPlayerId: r.requesterId,
      fromUid: r.requester.uid,
      fromUsername: r.requester.user?.username ?? 'Desconhecido',
      createdAt: r.createdAt,
    }));
  }

  async removeFriend(playerId: number, friendshipId: number) {
    const friendship = await this.friendshipRepo.findOne({ where: { id: friendshipId } });
    if (!friendship) throw new NotFoundException('Amizade não encontrada');
    if (friendship.requesterId !== playerId && friendship.addresseeId !== playerId)
      throw new ForbiddenException('Não autorizado');

    await this.friendshipRepo.remove(friendship);
    return { message: 'Amigo removido' };
  }

  async getOrCreateConversation(player1Id: number, player2Id: number): Promise<Conversation> {
    const [lo, hi] = player1Id < player2Id ? [player1Id, player2Id] : [player2Id, player1Id];

    let conv = await this.conversationRepo.findOne({
      where: { player1Id: lo, player2Id: hi },
    });
    if (!conv) {
      conv = this.conversationRepo.create({ player1Id: lo, player2Id: hi });
      conv = await this.conversationRepo.save(conv);
    }
    return conv;
  }

  async getConversations(playerId: number) {
    const conversations = await this.conversationRepo
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.player1', 'p1')
      .leftJoinAndSelect('p1.user', 'u1')
      .leftJoinAndSelect('conv.player2', 'p2')
      .leftJoinAndSelect('p2.user', 'u2')
      .where('conv.player1Id = :id OR conv.player2Id = :id', { id: playerId })
      .orderBy('conv.updatedAt', 'DESC')
      .getMany();

    return conversations.map((conv) => {
      const friend = conv.player1Id === playerId ? conv.player2 : conv.player1;
      return {
        id: conv.id,
        friendId: friend.id,
        friendUid: friend.uid,
        friendUsername: friend.user?.username ?? 'Desconhecido',
        lastMessageAt: conv.updatedAt,
        unreadCount: 0, // Futuramente: implementar tracking de leitura
      };
    });
  }

  async getMessages(playerId: number, conversationId: string) {
    const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.player1Id !== playerId && conv.player2Id !== playerId)
      throw new ForbiddenException('Acesso negado');

    return this.messageRepo.find({
      where: { conversationId },
      relations: ['sender', 'sender.user'],
      order: { createdAt: 'ASC' },
      take: 100,
    });
  }

  async saveMessage(
    conversationId: string,
    senderId: number,
    content: string
  ): Promise<ChatMessage> {
    const cleanContent = this.contentFilter.clean(content);
    const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.player1Id !== senderId && conv.player2Id !== senderId)
      throw new ForbiddenException('Acesso negado');

    const sender = await this.playerRepo.findOne({
      where: { id: senderId },
      relations: ['user'],
    });

    const msg = this.messageRepo.create({ conversationId, senderId, content: cleanContent });
    const saved = await this.messageRepo.save(msg);

    await this.conversationRepo.update(conversationId, { updatedAt: new Date() });

    this.eventEmitter.emit(
      'social.message.sent',
      new SocialMessageSentEvent(
        conversationId,
        saved.id,
        senderId,
        sender?.user?.username ?? 'Desconhecido',
        cleanContent,
        saved.createdAt,
        conv.player1Id,
        conv.player2Id
      )
    );

    return saved;
  }

  async getFriendIds(playerId: number): Promise<number[]> {
    const friendships = await this.friendshipRepo.find({
      where: [
        { requesterId: playerId, status: FriendshipStatus.ACCEPTED },
        { addresseeId: playerId, status: FriendshipStatus.ACCEPTED },
      ],
    });
    return friendships.map((f) => (f.requesterId === playerId ? f.addresseeId : f.requesterId));
  }
}
