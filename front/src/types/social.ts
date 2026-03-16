export interface Friend {
  id: number;
  playerId: number;
  uid: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface FriendRequest {
  id: number;
  fromPlayerId: number;
  fromUid: string;
  fromUsername: string;
  fromAvatar?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: number;
  senderUsername: string;
  content: string;
  createdAt: string;
}

export interface MatchChatMessage {
  senderId: number;
  senderUsername: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  friendId: number;
  friendUid: string;
  friendUsername: string;
  friendAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}
