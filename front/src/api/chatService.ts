import { Socket } from 'socket.io-client';
import { ChatMessage, MatchChatMessage } from '../types/social';

// ── Emitir ────────────────────────────────────────────────────────────────────

export function subscribeToNotifications(socket: Socket): void {
  socket.emit('subscribeToNotifications');
}

export function joinConversation(socket: Socket, conversationId: string): void {
  socket.emit('joinConversation', { conversationId });
}

export function leaveConversation(socket: Socket, conversationId: string): void {
  socket.emit('leaveConversation', { conversationId });
}

export function sendMessage(
  socket: Socket,
  conversationId: string,
  content: string
): void {
  socket.emit('sendMessage', { conversationId, content });
}

// ── Receber ───────────────────────────────────────────────────────────────────

export function onReceiveMessage(
  socket: Socket,
  handler: (message: ChatMessage) => void
): () => void {
  socket.on('receiveMessage', handler);
  return () => socket.off('receiveMessage', handler);
}

export function onFriendRequestReceived(
  socket: Socket,
  handler: (data: { fromUsername: string; requestId: number }) => void
): () => void {
  socket.on('friendRequestReceived', handler);
  return () => socket.off('friendRequestReceived', handler);
}

export function onFriendOnline(
  socket: Socket,
  handler: (data: { playerId: number }) => void
): () => void {
  socket.on('friendOnline', handler);
  return () => socket.off('friendOnline', handler);
}

export function sendMatchChat(socket: Socket, content: string): void {
  socket.emit('sendMatchChat', { content });
}

export function onReceiveMatchChat(
  socket: Socket,
  handler: (message: MatchChatMessage) => void
): () => void {
  socket.on('receiveMatchChat', handler);
  return () => socket.off('receiveMatchChat', handler);
}

export function onFriendOffline(
  socket: Socket,
  handler: (data: { playerId: number }) => void
): () => void {
  socket.on('friendOffline', handler);
  return () => socket.off('friendOffline', handler);
}

export function onConversationUpdate(
  socket: Socket,
  handler: (data: {
    conversationId: string;
    senderId: number;
    senderUsername: string;
    content: string;
    createdAt: string;
  }) => void
): () => void {
  socket.on('conversationUpdate', handler);
  return () => socket.off('conversationUpdate', handler);
}

export function onFriendRequestAccepted(
  socket: Socket,
  handler: (data: { acceptorPlayerId: number; acceptorUsername: string }) => void
): () => void {
  socket.on('friendRequestAccepted', handler);
  return () => socket.off('friendRequestAccepted', handler);
}
