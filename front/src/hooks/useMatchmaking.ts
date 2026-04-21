import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket } from 'socket.io-client';
import * as socketService from '../api/socketService';
import { notifyPlayerCoinsUpdate } from './usePlayer';
import { BATTLE_DISCONNECT_TIME_KEY } from './useBattle';
import { BattleState } from '../types';
import { BattleFormat, GameLobby } from '../types/lobby';

const ACTIVE_BATTLE_KEY = 'activeBattleId';
const RECONNECT_WINDOW_SECONDS = 30;
const RECONNECT_HIDE_BUFFER_SECONDS = 5; // hide banner this many seconds before server cancels

export async function clearActiveBattleStorage(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_BATTLE_KEY);
  await AsyncStorage.removeItem(BATTLE_DISCONNECT_TIME_KEY);
}

interface UseMatchmakingProps {
  token: string;
  playerId: number;
  partyCount: number;
  onNavigateToLogin: () => void;
  onNavigateToBattle: (battleId: string, battlePayload: any, socket: Socket) => void;
}

interface UseMatchmakingResult {
  socket: Socket | null;
  isConnected: boolean;
  isSearching: boolean;
  isStarting: boolean;
  format: BattleFormat;
  currentLobby: GameLobby | null;
  publicLobbies: GameLobby[];
  newLobbyAlert: GameLobby | null;
  lobbyError: string | null;
  activeBattleId: string | null;
  reconnectSecondsLeft: number | null;
  findBotMatch: (botProfileId: string) => void;
  createLobby: (type: 'public' | 'private') => void;
  joinLobby: (lobbyId: string) => void;
  leaveLobby: () => void;
  startLobby: () => void;
  refreshLobbies: () => void;
  cancelMatch: () => void;
  dismissAlert: () => void;
  clearLobbyError: () => void;
  rejoinBattle: () => void;
  clearActiveBattle: () => void;
}

export function useMatchmaking({
  token,
  playerId,
  partyCount,
  onNavigateToLogin,
  onNavigateToBattle,
}: UseMatchmakingProps): UseMatchmakingResult {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigatingToBattleRef = useRef(false);
  const partyCountRef = useRef(partyCount);

  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [currentLobby, setCurrentLobby] = useState<GameLobby | null>(null);
  const [publicLobbies, setPublicLobbies] = useState<GameLobby[]>([]);
  const [newLobbyAlert, setNewLobbyAlert] = useState<GameLobby | null>(null);
  const [lobbyError, setLobbyError] = useState<string | null>(null);
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const activeBattleIdRef = useRef<string | null>(null);
  const [reconnectSecondsLeft, setReconnectSecondsLeft] = useState<number | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const format = useMemo<BattleFormat>(
    () => (partyCount >= 3 ? '3v3' : partyCount === 2 ? '2v2' : '1v1'),
    [partyCount]
  );

  useEffect(() => { partyCountRef.current = partyCount; }, [partyCount]);

  useEffect(() => {
    AsyncStorage.multiGet([ACTIVE_BATTLE_KEY, BATTLE_DISCONNECT_TIME_KEY]).then(([[, id], [, disconnectTimeStr]]) => {
      if (!id) return;
      setActiveBattleId(id);
      activeBattleIdRef.current = id;

      if (disconnectTimeStr) {
        const disconnectTime = parseInt(disconnectTimeStr, 10);
        startReconnectCountdown(disconnectTime);
      }
    });
    return () => {
      if (reconnectTimerRef.current) clearInterval(reconnectTimerRef.current);
    };
  }, []);

  function startReconnectCountdown(disconnectTime: number) {
    if (reconnectTimerRef.current) clearInterval(reconnectTimerRef.current);

    const tick = () => {
      const elapsed = (Date.now() - disconnectTime) / 1000;
      const remaining = Math.ceil(RECONNECT_WINDOW_SECONDS - elapsed);
      const effectiveRemaining = remaining - RECONNECT_HIDE_BUFFER_SECONDS;

      if (effectiveRemaining <= 0) {
        if (reconnectTimerRef.current) clearInterval(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
        setReconnectSecondsLeft(0);
        // Auto-clear: battle window closed
        AsyncStorage.multiRemove([ACTIVE_BATTLE_KEY, BATTLE_DISCONNECT_TIME_KEY]);
        activeBattleIdRef.current = null;
        setActiveBattleId(null);
        setReconnectSecondsLeft(null);
        return;
      }

      setReconnectSecondsLeft(effectiveRemaining);
    };

    tick();
    reconnectTimerRef.current = setInterval(tick, 1000);
  }

  useEffect(() => {
    let s: Socket | null = null;
    setupSocket().then((sock) => { if (sock) s = sock; });
    return () => {
      if (!s) return;
      s.off('sessionRegistered');
      s.off('lobbyCreated');
      s.off('lobbyUpdated');
      s.off('lobbyCancelled');
      s.off('lobbyList');
      s.off('newPublicLobby');
      s.off('publicLobbyRemoved');
      s.off('lobbyError');
      s.off('lobbyStarting');
      s.off('matchStatus');
      s.off('queueLeft');
      s.off('battleError');
      s.off('battleRejoined');
      s.off('battleRejoinFailed');
      s.off('battleCancelled');
      s.off('inventoryUpdate');
      if (!navigatingToBattleRef.current) {
        socketService.disconnectSocket(s);
        socketRef.current = null;
      }
    };
  }, []);

  async function setupSocket(): Promise<Socket | null> {
    try {
      if (!token || !playerId) return null;

      const s = await socketService.createSocket(token, {
        playerId,
        onConnect: () => setIsConnected(true),
        onConnectError: () => setIsConnected(false),
        onMatchFound: (data) => {
          setIsSearching(false);
          setIsStarting(false);
          setCurrentLobby(null);
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              if (data?.battleId) {
                AsyncStorage.setItem(ACTIVE_BATTLE_KEY, data.battleId);
                activeBattleIdRef.current = data.battleId;
                setActiveBattleId(data.battleId);
                navigatingToBattleRef.current = true;
                onNavigateToBattle(data.battleId, data, s);
              }
            }, 300);
          });
        },
      });

      s.on('sessionRegistered', (data: { status: string }) => {
        if (data.status !== 'ok') {
          setIsConnected(false);
        } else {
          // Join lobby:watchers room so newPublicLobby events are received even without opening the sheet
          socketService.watchLobbies(s);
        }
      });

      s.on('lobbyCreated', ({ lobby }: { lobby: GameLobby }) => {
        setCurrentLobby(lobby);
      });

      s.on('lobbyUpdated', ({ lobby }: { lobby: GameLobby }) => {
        setCurrentLobby((prev) => (prev?.id === lobby.id ? lobby : prev));
      });

      s.on('lobbyCancelled', ({ lobbyId }: { lobbyId: string }) => {
        setIsStarting(false);
        setCurrentLobby((prev) => (prev?.id === lobbyId ? null : prev));
        setPublicLobbies((prev) => prev.filter((l) => l.id !== lobbyId));
      });

      s.on('lobbyList', ({ lobbies }: { lobbies: GameLobby[] }) => {
        setPublicLobbies(lobbies);
      });

      s.on('newPublicLobby', ({ lobby }: { lobby: GameLobby }) => {
        setPublicLobbies((prev) => {
          if (prev.some((l) => l.id === lobby.id)) return prev;
          return [lobby, ...prev];
        });
        if (partyCountRef.current > 0 && lobby.hostId !== playerId) {
          setNewLobbyAlert(lobby);
        }
      });

      s.on('publicLobbyRemoved', ({ lobbyId }: { lobbyId: string }) => {
        setPublicLobbies((prev) => prev.filter((l) => l.id !== lobbyId));
      });

      s.on('lobbyError', ({ message }: { message: string }) => {
        setIsStarting(false);
        setLobbyError(message);
      });

      s.on('lobbyStarting', () => {
        setIsStarting(true);
      });

      s.on('matchStatus', ({ status }: { status: string }) => {
        setIsSearching(status === 'waiting');
      });

      s.on('queueLeft', () => {
        setIsSearching(false);
      });

      s.on('battleError', ({ message }: { message: string }) => {
        setIsStarting(false);
        setLobbyError(message);
      });

      s.on('battleCancelled', () => {
        if (reconnectTimerRef.current) clearInterval(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
        AsyncStorage.multiRemove([ACTIVE_BATTLE_KEY, BATTLE_DISCONNECT_TIME_KEY]);
        activeBattleIdRef.current = null;
        setActiveBattleId(null);
        setReconnectSecondsLeft(null);
      });

      s.on('battleRejoined', (data: { battleId: string; battleState: BattleState }) => {
        if (reconnectTimerRef.current) clearInterval(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
        AsyncStorage.multiRemove([ACTIVE_BATTLE_KEY, BATTLE_DISCONNECT_TIME_KEY]);
        activeBattleIdRef.current = null;
        setActiveBattleId(null);
        setReconnectSecondsLeft(null);
        navigatingToBattleRef.current = true;
        onNavigateToBattle(data.battleId, data, s);
      });

      s.on('battleRejoinFailed', () => {
        if (reconnectTimerRef.current) clearInterval(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
        AsyncStorage.multiRemove([ACTIVE_BATTLE_KEY, BATTLE_DISCONNECT_TIME_KEY]);
        activeBattleIdRef.current = null;
        setActiveBattleId(null);
        setReconnectSecondsLeft(null);
        setLobbyError('A partida anterior não está mais disponível.');
      });

      s.on('inventoryUpdate', ({ coins }: { coins: number; inventory: any }) => {
        notifyPlayerCoinsUpdate(coins);
      });

      setSocket(s);
      socketRef.current = s;
      return s;
    } catch (err) {
      console.error('[useMatchmaking] socket setup error:', err);
      return null;
    }
  }

  const cancelMatch = useCallback(() => {
    if (!socketRef.current) return;
    socketService.leaveQueue(socketRef.current);
    setIsSearching(false);
  }, []);

  const createLobby = useCallback(
    (type: 'public' | 'private') => {
      if (!socketRef.current) return;
      socketService.createLobby(socketRef.current, format, type);
    },
    [format]
  );

  const joinLobby = useCallback((lobbyId: string) => {
    if (!socketRef.current) return;
    socketService.joinLobby(socketRef.current, lobbyId);
  }, []);

  const leaveLobby = useCallback(() => {
    if (!socketRef.current) return;
    socketService.leaveLobby(socketRef.current);
    setCurrentLobby(null);
    setIsStarting(false);
  }, []);

  const startLobby = useCallback(() => {
    if (!socketRef.current || !currentLobby) return;
    socketService.startLobby(socketRef.current, currentLobby.id);
  }, [currentLobby]);

  const refreshLobbies = useCallback(() => {
    if (!socketRef.current) return;
    socketService.watchLobbies(socketRef.current);
  }, []);

  const findBotMatch = useCallback(
    (botProfileId: string) => {
      if (!socketRef.current?.connected) return;
      socketService.findBotMatch(socketRef.current, botProfileId, format);
    },
    [format]
  );

  const dismissAlert = useCallback(() => setNewLobbyAlert(null), []);
  const clearLobbyError = useCallback(() => setLobbyError(null), []);

  const rejoinBattle = useCallback(() => {
    if (!socketRef.current?.connected || !activeBattleIdRef.current) return;
    socketService.rejoinBattle(socketRef.current, activeBattleIdRef.current);
  }, []);

  const clearActiveBattle = useCallback(() => {
    AsyncStorage.removeItem(ACTIVE_BATTLE_KEY);
    activeBattleIdRef.current = null;
    setActiveBattleId(null);
  }, []);

  return {
    socket,
    isConnected,
    isSearching,
    isStarting,
    format,
    currentLobby,
    publicLobbies,
    newLobbyAlert,
    lobbyError,
    activeBattleId,
    reconnectSecondsLeft,
    findBotMatch,
    createLobby,
    joinLobby,
    leaveLobby,
    startLobby,
    refreshLobbies,
    cancelMatch,
    dismissAlert,
    clearLobbyError,
    rejoinBattle,
    clearActiveBattle,
  };
}
