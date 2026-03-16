import { UseGuards } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithUser } from 'src/auth/types/auth.types';
import {
  MatchChatMessageEvent,
  PlayerOfflineEvent,
  PlayerOnlineEvent,
  SocialFriendRequestAcceptedEvent,
  SocialFriendRequestSentEvent,
  SocialMessageSentEvent,
} from 'src/game/shared/events/game.events';
import { WsGameAuthGuard } from 'src/game/shared/auth/guards/ws-game-auth-guard';
import { WsPlayerGuard } from 'src/game/modules/player/auth/ws-player.guard';
import { SocketManagerService } from 'src/game/shared/socket-manager/socket-manager.service';
import { WsSendMessageDto } from './dto/ws-send-message.dto';
import { ContentFilterService } from 'src/game/shared/content-filter/content-filter.service';
import { SocialService } from './social.service';

const MATCH_CHAT_MAX_LENGTH = 200;

@WebSocketGateway({ cors: { origin: '*' } })
export class SocialGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socialService: SocialService,
    private readonly socketManager: SocketManagerService,
    private readonly eventEmitter: EventEmitter2,
    private readonly contentFilter: ContentFilterService
  ) {}

  // ── WebSocket: entrar na sala pessoal de notificações ────────────────────────

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('subscribeToNotifications')
  async handleSubscribeToNotifications(@ConnectedSocket() socket: SocketWithUser) {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    await socket.join(`player:${playerId}`);
  }

  // ── WebSocket: chat ──────────────────────────────────────────────────────────

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { conversationId: string }
  ) {
    const playerId = socket.data.playerId;
    if (!playerId || !data?.conversationId) return;

    try {
      await this.socialService.getMessages(playerId, data.conversationId);
      await socket.join(`conversation:${data.conversationId}`);
    } catch {
      socket.emit('error', { message: 'Conversa não encontrada ou acesso negado' });
    }
  }

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { conversationId: string }
  ) {
    if (data?.conversationId) {
      await socket.leave(`conversation:${data.conversationId}`);
    }
  }

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: WsSendMessageDto
  ) {
    const playerId = socket.data.playerId;
    if (!playerId || !data?.conversationId || !data?.content) return;

    try {
      await this.socialService.saveMessage(data.conversationId, playerId, data.content);
    } catch {
      socket.emit('error', { message: 'Não foi possível enviar a mensagem' });
    }
  }

  // ── WebSocket: chat em partida ────────────────

  @UseGuards(WsGameAuthGuard, WsPlayerGuard)
  @SubscribeMessage('sendMatchChat')
  handleSendMatchChat(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() data: { content: string }
  ) {
    const battleId = socket.data.battleId;
    const playerId = socket.data.playerId;
    if (!battleId || !playerId || !data?.content?.trim()) return;

    const content = this.contentFilter.clean(data.content.trim().slice(0, MATCH_CHAT_MAX_LENGTH));

    this.eventEmitter.emit(
      'match.chat.message',
      new MatchChatMessageEvent(battleId, playerId, socket.data.username ?? '', content, new Date())
    );
  }

  // ── Evento interno: mensagem de partida recebida ──────────────────────────────

  @OnEvent('match.chat.message')
  handleMatchChatMessage(event: MatchChatMessageEvent) {
    this.server.to(`battle:${event.battleId}`).emit('receiveMatchChat', {
      senderId: event.senderId,
      senderUsername: event.senderUsername,
      content: event.content,
      timestamp: event.timestamp,
    });
  }

  // ── Eventos internos: mensagem enviada ───────────────────────────────────────

  @OnEvent('social.message.sent')
  handleMessageSent(event: SocialMessageSentEvent) {
    const payload = {
      id: event.messageId,
      conversationId: event.conversationId,
      senderId: event.senderId,
      senderUsername: event.senderUsername,
      content: event.content,
      createdAt: event.createdAt,
    };

    this.server.to(`conversation:${event.conversationId}`).emit('receiveMessage', payload);

    const update = {
      conversationId: event.conversationId,
      senderId: event.senderId,
      senderUsername: event.senderUsername,
      content: event.content,
      createdAt: event.createdAt,
    };
    this.server.to(`player:${event.player1Id}`).emit('conversationUpdate', update);
    this.server.to(`player:${event.player2Id}`).emit('conversationUpdate', update);
  }

  // ── Eventos internos: pedido de amizade ──────────────────────────────────────

  @OnEvent('social.friend.request.sent')
  handleFriendRequestSent(event: SocialFriendRequestSentEvent) {
    this.server.to(`player:${event.toPlayerId}`).emit('friendRequestReceived', {
      requestId: event.requestId,
      fromPlayerId: event.fromPlayerId,
      fromUsername: event.fromUsername,
    });
  }

  // ── Eventos internos: pedido de amizade aceito ───────────────────────────────

  @OnEvent('social.friend.request.accepted')
  handleFriendRequestAccepted(event: SocialFriendRequestAcceptedEvent) {
    this.server.to(`player:${event.requesterPlayerId}`).emit('friendRequestAccepted', {
      acceptorPlayerId: event.acceptorPlayerId,
      acceptorUsername: event.acceptorUsername,
    });
  }

  // ── Eventos internos: online / offline ───────────────────────────────────────

  @OnEvent('player.online')
  async handlePlayerOnline(event: PlayerOnlineEvent) {
    const friendIds = await this.socialService.getFriendIds(event.playerId);
    for (const friendId of friendIds) {
      const socketId = this.socketManager.getSocketId(friendId);
      if (socketId) {
        this.server.to(socketId).emit('friendOnline', { playerId: event.playerId });
      }
    }
  }

  @OnEvent('player.offline')
  async handlePlayerOffline(event: PlayerOfflineEvent) {
    const friendIds = await this.socialService.getFriendIds(event.playerId);
    for (const friendId of friendIds) {
      const socketId = this.socketManager.getSocketId(friendId);
      if (socketId) {
        this.server.to(socketId).emit('friendOffline', { playerId: event.playerId });
      }
    }
  }
}
