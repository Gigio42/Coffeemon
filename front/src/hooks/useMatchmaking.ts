import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket } from 'socket.io-client';
import * as socketService from '../api/socketService';
import { BattleState } from '../../types';

interface UseMatchmakingProps {
  token: string;
  playerId: number;
  onNavigateToLogin: () => void;
  onNavigateToBattle: (battleId: string, battleState: BattleState, socket: Socket) => void;
}

interface UseMatchmakingResult {
  socket: Socket | null;
  matchStatus: string;
  log: string[];
  findMatch: () => void;
  findBotMatch: (botProfileId: string) => void;
  handleLogout: () => Promise<void>;
}

export function useMatchmaking({
  token,
  playerId,
  onNavigateToLogin,
  onNavigateToBattle,
}: UseMatchmakingProps): UseMatchmakingResult {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setupSocket();

    // Cleanup: desconecta socket quando componente é desmontado
    return () => {
      if (socket) {
        socketService.disconnectSocket(socket);
      }
    };
  }, []);

  function addLog(msg: string) {
    console.log('LOG:', msg);
    setLog((prev) => [msg, ...prev]);
  }

  async function setupSocket() {
    console.log('Setting up socket with token:', token, 'playerId:', playerId);

    const s = await socketService.createSocket(token, {
      onConnect: (socketId) => {
        addLog(`Conectado ao servidor. Socket ID: ${socketId}`);
        setMatchStatus('Conectado');
      },
      onConnectError: (err) => {
        addLog(`Erro de conexão: ${err.message}`);
        setMatchStatus('Erro de conexão');
      },
      onMatchFound: (data) => {
        addLog(`Partida encontrada! Battle ID: ${data.battleId}`);
        setMatchStatus('Partida encontrada!');
        setTimeout(() => {
          onNavigateToBattle(data.battleId, data, s);
        }, 100);
      },
      onAnyEvent: (eventName, ...args) => {
        // Debug: já logado no socketService
      },
    });

    setSocket(s);
  }

  function findMatch() {
    if (!socket) {
      addLog('Socket não conectado');
      return;
    }

    addLog('Procurando partida online (PvP)...');
    setMatchStatus('Procurando partida online...');
    socketService.findPvPMatch(socket);
  }

  function findBotMatch(botProfileId: string) {
    if (!socket) {
      addLog('Socket não conectado');
      return;
    }

    const botName = botProfileId === 'jessie' ? 'Jessie' : 'James';
    addLog(`Criando partida contra ${botName} (Bot)...`);
    setMatchStatus(`Criando partida contra ${botName}...`);
    socketService.findBotMatch(socket, botProfileId);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    if (socket) {
      socketService.disconnectSocket(socket);
      setSocket(null);
    }
    onNavigateToLogin();
  }

  return {
    socket,
    matchStatus,
    log,
    findMatch,
    findBotMatch,
    handleLogout,
  };
}
