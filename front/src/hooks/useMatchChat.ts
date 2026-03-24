import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { sendMatchChat, onReceiveMatchChat } from '../api/chatService';
import { MatchChatMessage } from '../types/social';

interface UseMatchChatOptions {
  socket: Socket | null;
  playerId: number;
  enabled: boolean; // false for bot battles
}

export function useMatchChat({ socket, playerId, enabled }: UseMatchChatOptions) {
  const [messages, setMessages] = useState<MatchChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (!socket || !enabled) return;

    const unsubscribe = onReceiveMatchChat(socket, (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!isOpenRef.current) {
        setUnreadCount((n) => n + 1);
      }
    });

    return unsubscribe;
  }, [socket, enabled]);

  const send = (content: string) => {
    if (!socket || !content.trim() || !enabled) return;
    sendMatchChat(socket, content.trim());
  };

  const markRead = () => {
    setUnreadCount(0);
    isOpenRef.current = true;
  };

  const onClose = () => {
    isOpenRef.current = false;
  };

  return { messages, unreadCount, send, markRead, onClose };
}
