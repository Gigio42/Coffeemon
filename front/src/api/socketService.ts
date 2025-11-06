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
  const url = await getServerUrl();

  // Conecta ao servidor Socket.IO com autenticação JWT
  const socket = io(url, {
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  // Evento: Socket conectado com sucesso
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    if (callbacks.onConnect) {
      callbacks.onConnect(socket.id || '');
    }
  });

  // Evento: Erro de conexão
  socket.on('connect_error', (err: Error) => {
    console.error('Socket connection error:', err);
    if (callbacks.onConnectError) {
      callbacks.onConnectError(err);
    }
  });

  // Debug: Log de todos os eventos recebidos
  socket.onAny((eventName: string, ...args: any[]) => {
    console.log('Socket event received:', eventName, args);
    if (callbacks.onAnyEvent) {
      callbacks.onAnyEvent(eventName, ...args);
    }
  });

  // Evento: Partida encontrada! (PvP ou PvE)
  socket.on('matchFound', (data: any) => {
    console.log('Match found! Full data:', data);
    if (callbacks.onMatchFound) {
      callbacks.onMatchFound(data);
    }
  });

  return socket;
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
