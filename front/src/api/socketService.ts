import { io, Socket } from 'socket.io-client';
import { getServerUrl } from '../utils/config';

export interface SocketCallbacks {
  onConnect?: (socketId: string) => void;
  onConnectError?: (error: Error) => void;
  onMatchFound?: (data: any) => void;
  onAnyEvent?: (eventName: string, ...args: any[]) => void;
}

/**
 * Cria e configura uma conexão Socket.io com o servidor
 */
export async function createSocket(
  token: string,
  callbacks: SocketCallbacks = {}
): Promise<Socket> {
  try {
    const url = await getServerUrl();
    console.log('Creating socket connection to:', url);

    // Conecta ao servidor Socket.IO com autenticação JWT e configurações otimizadas
    const socket = io(url, {
      extraHeaders: { Authorization: `Bearer ${token}` },
      transports: ['websocket', 'polling'], // Tenta websocket primeiro
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true, // Força nova conexão
    });

    // Evento: Socket conectado com sucesso
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      if (callbacks.onConnect) {
        try {
          callbacks.onConnect(socket.id || '');
        } catch (err) {
          console.error('Error in onConnect callback:', err);
        }
      }
    });

    // Evento: Erro de conexão
    socket.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err.message, err.stack);
      if (callbacks.onConnectError) {
        try {
          callbacks.onConnectError(err);
        } catch (callbackErr) {
          console.error('Error in onConnectError callback:', callbackErr);
        }
      }
    });

    // Evento: Desconexão
    socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
    });

    // Evento: Erro genérico
    socket.on('error', (err: Error) => {
      console.error('Socket error:', err.message, err.stack);
    });

    // Debug: Log de todos os eventos recebidos
    socket.onAny((eventName: string, ...args: any[]) => {
      console.log('Socket event received:', eventName);
      if (callbacks.onAnyEvent) {
        try {
          callbacks.onAnyEvent(eventName, ...args);
        } catch (err) {
          console.error('Error in onAnyEvent callback:', err);
        }
      }
    });

    // Evento: Partida encontrada! (PvP ou PvE)
    socket.on('matchFound', (data: any) => {
      console.log('Match found! Battle ID:', data?.battleId);
      if (callbacks.onMatchFound) {
        try {
          callbacks.onMatchFound(data);
        } catch (err) {
          console.error('Error in onMatchFound callback:', err);
        }
      }
    });

    return socket;
  } catch (err) {
    console.error('Error creating socket:', err);
    throw err;
  }
}

/**
 * Emite evento para procurar partida PvP
 */
export function findPvPMatch(socket: Socket): void {
  socket.emit('findMatch');
}

/**
 * Emite evento para procurar partida contra Bot
 */
export function findBotMatch(socket: Socket, botProfileId: string): void {
  socket.emit('findBotMatch', { botProfileId });
}

/**
 * Desconecta o socket
 */
export function disconnectSocket(socket: Socket): void {
  socket.disconnect();
}
