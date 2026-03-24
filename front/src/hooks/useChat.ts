import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '../api/socketService';
import {
  subscribeToNotifications,
  joinConversation,
  leaveConversation,
  sendMessage as emitMessage,
  onReceiveMessage,
  onFriendOnline,
  onFriendOffline,
  onFriendRequestReceived,
  onConversationUpdate,
  onFriendRequestAccepted,
} from '../api/chatService';
import { getConversations, getMessages } from '../api/socialService';
import { ChatMessage, Conversation } from '../types/social';

interface UseChatOptions {
  token: string | null;
  playerId: number;
  onFriendOnline?: (playerId: number) => void;
  onFriendOffline?: (playerId: number) => void;
  onFriendRequest?: (data: { requestId: number; fromPlayerId: number; fromUsername: string }) => void;
  onFriendRequestAccepted?: (data: { acceptorPlayerId: number; acceptorUsername: string }) => void;
}

export function useChat({
  token,
  playerId,
  onFriendOnline: handleFriendOnline,
  onFriendOffline: handleFriendOffline,
  onFriendRequest: handleFriendRequest,
  onFriendRequestAccepted: handleFriendRequestAccepted,
}: UseChatOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Connect socket when hook mounts
  useEffect(() => {
    if (!token) return;

    let socket: Socket;
    createSocket(token, {
      playerId,
      onConnect: () => setIsConnected(true),
      onConnectError: () => setIsConnected(false),
    }).then((s) => {
      socket = s;
      socketRef.current = s;

      // Entra na sala pessoal de notificações
      subscribeToNotifications(s);

      const offMessage = onReceiveMessage(s, (msg) => {
        // Append to active conversation if it matches
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        // Update last message in conversations list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === msg.conversationId
              ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
              : c
          )
        );
      });

      // Atualiza lista de conversas mesmo com o chat fechado
      const offConvUpdate = onConversationUpdate(s, (update) => {
        const isActive = activeConversationIdRef.current === update.conversationId;
        setConversations((prev) => {
          const exists = prev.find((c) => c.id === update.conversationId);
          if (exists) {
            return prev.map((c) =>
              c.id === update.conversationId
                ? {
                    ...c,
                    lastMessage: update.content,
                    lastMessageAt: update.createdAt,
                    // Só incrementa unread se o chat não estiver aberto agora
                    unreadCount: isActive ? 0 : c.unreadCount + 1,
                  }
                : c
            );
          }
          return prev;
        });
      });

      const offOnline = onFriendOnline(s, ({ playerId: pid }) => {
        handleFriendOnline?.(pid);
      });

      const offOffline = onFriendOffline(s, ({ playerId: pid }) => {
        handleFriendOffline?.(pid);
      });

      const offFriendReq = onFriendRequestReceived(s, (data) => {
        handleFriendRequest?.(data);
      });

      const offFriendAccepted = onFriendRequestAccepted(s, (data) => {
        handleFriendRequestAccepted?.(data);
      });

      // Cleanup stored so we can call them on unmount
      (socket as any).__offHandlers = [
        offMessage,
        offConvUpdate,
        offOnline,
        offOffline,
        offFriendReq,
        offFriendAccepted,
      ];
    });

    return () => {
      if (socket) {
        const offs: Array<() => void> = (socket as any).__offHandlers ?? [];
        offs.forEach((off) => off());
        socket.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [token, playerId]);

  const loadConversations = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getConversations(token);
      setConversations(data);
    } catch {
      // silent – user can retry via pull-to-refresh
    }
  }, [token]);

  const openConversation = useCallback(
    async (conversation: Conversation) => {
      if (!token) return;
      // Leave previous room
      if (activeConversation && socketRef.current) {
        leaveConversation(socketRef.current, activeConversation.id);
      }
      setActiveConversation(conversation);
      activeConversationIdRef.current = conversation.id;
      setMessages([]);
      setIsLoadingMessages(true);
      try {
        const msgs = await getMessages(token, conversation.id);
        setMessages(msgs);
      } catch {
        // messages will just be empty
      } finally {
        setIsLoadingMessages(false);
      }
      if (socketRef.current) {
        joinConversation(socketRef.current, conversation.id);
      }
      // Clear unread badge
      setConversations((prev) =>
        prev.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c))
      );
    },
    [token, activeConversation]
  );

  const closeConversation = useCallback(() => {
    if (activeConversation && socketRef.current) {
      leaveConversation(socketRef.current, activeConversation.id);
    }
    activeConversationIdRef.current = null;
    setActiveConversation(null);
    setMessages([]);
  }, [activeConversation]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !activeConversation || !content.trim()) return;
      emitMessage(socketRef.current, activeConversation.id, content.trim());
    },
    [activeConversation]
  );

  return {
    isConnected,
    conversations,
    activeConversation,
    messages,
    isLoadingMessages,
    loadConversations,
    openConversation,
    closeConversation,
    sendMessage,
  };
}
