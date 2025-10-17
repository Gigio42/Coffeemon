import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '../../../services/socket.service';

/**
 * ========================================
 * USE SOCKET HOOK
 * ========================================
 * 
 * Hook customizado para gerenciar conexão WebSocket
 * Gerencia lifecycle, eventos e cleanup automático
 */

interface UseSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback?: Function) => void;
}

export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
  const {
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError,
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const listenersRef = useRef<Map<string, Function[]>>(new Map());
  
  /**
   * Conecta ao servidor
   */
  const connect = useCallback(() => {
    if (socket?.connected) return;
    
    const newSocket = socketService.connect();
    setSocket(newSocket);
    
    // Listeners internos
    newSocket.on('connect', () => {
      setIsConnected(true);
      onConnect?.();
    });
    
    newSocket.on('disconnect', (reason: string) => {
      setIsConnected(false);
      onDisconnect?.(reason);
    });
    
    newSocket.on('connect_error', (error: Error) => {
      onError?.(error);
    });
  }, [socket, onConnect, onDisconnect, onError]);
  
  /**
   * Desconecta do servidor
   */
  const disconnect = useCallback(() => {
    if (socket) {
      // Remove todos os listeners customizados
      listenersRef.current.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          socket.off(event, callback as any);
        });
      });
      listenersRef.current.clear();
      
      socketService.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);
  
  /**
   * Emite evento para o servidor
   */
  const emit = useCallback((event: string, data?: any) => {
    if (!socket) {
      console.warn('[useSocket] Socket não conectado');
      return;
    }
    socket.emit(event, data);
  }, [socket]);
  
  /**
   * Registra listener para evento
   */
  const on = useCallback((event: string, callback: Function) => {
    if (!socket) {
      console.warn('[useSocket] Socket não conectado');
      return;
    }
    
    // Armazena listener para cleanup
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event)!.push(callback);
    
    socket.on(event, callback as any);
  }, [socket]);
  
  /**
   * Remove listener de evento
   */
  const off = useCallback((event: string, callback?: Function) => {
    if (!socket) return;
    
    if (callback) {
      socket.off(event, callback as any);
      
      // Remove da lista de listeners
      const eventListeners = listenersRef.current.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    } else {
      // Remove todos os listeners do evento
      socket.off(event);
      listenersRef.current.delete(event);
    }
  }, [socket]);
  
  /**
   * Auto-connect e cleanup
   */
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect]);
  
  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};
