import { io, Socket } from 'socket.io-client';
import { getServerUrl } from '../utils/config';

export interface SocketCallbacks {
  onConnect?: (socketId: string) => void;
  onConnectError?: (error: Error) => void;
  onMatchFound?: (data: any) => void;
  onAnyEvent?: (eventName: string, ...args: any[]) => void;
  playerId?: number; // Added to register session
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

    let consecutiveConnectErrors = 0;
    let switchedToPollingFirst = false;

    // Conecta ao servidor Socket.IO com autenticação JWT e configurações otimizadas
    const socket = io(url, {
      auth: { token },
      transports: ['polling', 'websocket'],
      tryAllTransports: true,
      upgrade: true,
      rememberUpgrade: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
    });

    // Evento: Socket conectado com sucesso
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      consecutiveConnectErrors = 0;
      
      // Register session with backend if playerId is provided
      if (callbacks.playerId) {
        console.log('[Socket] Registering session for player', callbacks.playerId);
        socket.emit('registerSession');
        
        // Listen for registration confirmation
        socket.once('sessionRegistered', (data: any) => {
          if (data.status === 'ok') {
            console.log('[Socket] ✅ Session registered successfully for player', data.playerId);
          } else {
            console.error('[Socket] ❌ Session registration failed:', data.message);
          }
        });
      }
      
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
      consecutiveConnectErrors += 1;
      const msg = (err.message || '').toLowerCase();

      if (!switchedToPollingFirst && msg.includes('websocket')) {
        switchedToPollingFirst = true;
        socket.io.opts.transports = ['polling', 'websocket'];
      }

      console.warn(
        `Socket connect_error (${consecutiveConnectErrors}): ${err.message}`
      );
      if (callbacks.onConnectError && consecutiveConnectErrors >= 3) {
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
      // console.log('Socket event received:', eventName);
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

// ─── Queue ────────────────────────────────────────────────────────────────────

export function findPvPMatch(socket: Socket, format = '3v3'): void {
  socket.emit('findMatch', { format });
}

export function findBotMatch(socket: Socket, botProfileId: string, format = '3v3'): void {
  socket.emit('findBotMatch', { botProfileId, format });
}

export function leaveQueue(socket: Socket): void {
  socket.emit('leaveQueue');
}

// ─── Lobbies ─────────────────────────────────────────────────────────────────

export function createLobby(socket: Socket, format: string, type: 'public' | 'private'): void {
  socket.emit('createLobby', { format, type });
}

export function joinLobby(socket: Socket, lobbyId: string): void {
  socket.emit('joinLobby', { lobbyId });
}

export function leaveLobby(socket: Socket): void {
  socket.emit('leaveLobby');
}

export function startLobby(socket: Socket, lobbyId: string): void {
  socket.emit('startLobby', { lobbyId });
}

export function rejoinBattle(socket: Socket, battleId: string): void {
  socket.emit('rejoinBattle', { battleId });
}

export function watchLobbies(socket: Socket): void {
  socket.emit('watchLobbies');
}

export function unwatchLobbies(socket: Socket): void {
  socket.emit('unwatchLobbies');
}

// ─── Utils ────────────────────────────────────────────────────────────────────

export function disconnectSocket(socket: Socket): void {
  socket.disconnect();
}
