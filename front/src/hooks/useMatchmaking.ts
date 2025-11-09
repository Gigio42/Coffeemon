import { useState, useEffect } from 'react';
import { InteractionManager } from 'react-native';
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
    try {
      if (!token || !playerId) {
        console.error('Missing token or playerId');
        addLog('Erro: Dados de autenticação inválidos');
        return;
      }

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
        try {
          addLog(`Partida encontrada! Battle ID: ${data.battleId}`);
          setMatchStatus('Partida encontrada!');
          
          // Esperar todas as interações/animações terminarem
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              try {
                if (data && data.battleId) {
                  onNavigateToBattle(data.battleId, data, s);
                } else {
                  console.error('Invalid battle data:', data);
                  addLog('Erro: Dados de batalha inválidos');
                }
              } catch (err) {
                console.error('Error navigating to battle:', err);
                addLog('Erro ao iniciar batalha');
              }
            }, 500);
          });
        } catch (err) {
          console.error('Error in onMatchFound:', err);
          addLog('Erro ao processar partida');
        }
      },
      onAnyEvent: (eventName, ...args) => {
        // Debug: já logado no socketService
      },
    });

      setSocket(s);
    } catch (err) {
      console.error('Error setting up socket:', err);
      addLog('Erro ao conectar ao servidor');
      setMatchStatus('Erro de conexão');
    }
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
    try {
      if (!socket) {
        addLog('Socket não conectado');
        return;
      }

      if (!socket.connected) {
        addLog('Socket desconectado. Tentando reconectar...');
        socket.connect();
        setTimeout(() => findBotMatch(botProfileId), 1000);
        return;
      }

      const botName = botProfileId === 'jessie' ? 'Jessie' : 'James';
      addLog(`Criando partida contra ${botName} (Bot)...`);
      setMatchStatus(`Criando partida contra ${botName}...`);
      socketService.findBotMatch(socket, botProfileId);
    } catch (err) {
      console.error('Error finding bot match:', err);
      addLog('Erro ao iniciar partida com bot');
    }
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
