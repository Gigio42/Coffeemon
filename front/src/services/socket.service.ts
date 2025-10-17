import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';
import { useAuthStore } from '../state';

/**
 * ========================================
 * SOCKET SERVICE
 * ========================================
 * 
 * Serviço centralizado para WebSocket (Socket.IO)
 * Gerencia conexão, autenticação e eventos
 */

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  /**
   * Conecta ao servidor Socket.IO
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }
    
    const token = useAuthStore.getState().token;
    
    this.socket = io(SOCKET_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    // Listeners padrão
    this.socket.on('connect', () => {
      console.log('[Socket] Conectado:', this.socket?.id);
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Erro de conexão:', error);
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Desconectado:', reason);
    });
    
    return this.socket;
  }
  
  /**
   * Desconecta do servidor
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }
  
  /**
   * Registra listener para evento
   */
  on(event: string, callback: Function): void {
    if (!this.socket) {
      throw new Error('Socket não conectado. Chame connect() primeiro.');
    }
    
    // Armazena listener para cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    
    // Registra no socket
    this.socket.on(event, callback as any);
  }
  
  /**
   * Remove listener de evento
   */
  off(event: string, callback?: Function): void {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback as any);
      
      // Remove da lista de listeners
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    } else {
      // Remove todos os listeners do evento
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }
  
  /**
   * Emite evento para o servidor
   */
  emit(event: string, data?: any): void {
    if (!this.socket) {
      throw new Error('Socket não conectado. Chame connect() primeiro.');
    }
    
    this.socket.emit(event, data);
  }
  
  /**
   * Retorna socket atual
   */
  getSocket(): Socket | null {
    return this.socket;
  }
  
  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
  
  /**
   * Limpa todos os listeners
   */
  removeAllListeners(): void {
    if (this.socket) {
      this.listeners.forEach((_, event) => {
        this.socket!.off(event);
      });
      this.listeners.clear();
    }
  }
}

// Exporta instância singleton
export const socketService = new SocketService();
