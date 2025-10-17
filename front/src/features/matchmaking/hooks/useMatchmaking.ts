import { useState, useCallback, useEffect } from 'react';
import { useSocket } from './useSocket';
import { BattleState } from '../../../types';

/**
 * ========================================
 * USE MATCHMAKING HOOK
 * ========================================
 * 
 * Hook customizado para gerenciar matchmaking
 * Busca partidas, gerencia fila, escuta eventos
 */

interface UseMatchmakingOptions {
  onMatchFound?: (battleId: string, battleState: BattleState) => void;
  onError?: (error: string) => void;
}

interface UseMatchmakingReturn {
  // Estado
  isSearching: boolean;
  matchStatus: string;
  isConnected: boolean;
  
  // Ações
  findMatch: () => void;
  cancelSearch: () => void;
}

export const useMatchmaking = (options: UseMatchmakingOptions = {}): UseMatchmakingReturn => {
  const { onMatchFound, onError } = options;
  
  const [isSearching, setIsSearching] = useState(false);
  const [matchStatus, setMatchStatus] = useState('Desconectado');
  
  const { socket, isConnected, emit, on, off } = useSocket({
    autoConnect: true,
    onConnect: () => {
      setMatchStatus('Conectado');
    },
    onDisconnect: () => {
      setMatchStatus('Desconectado');
      setIsSearching(false);
    },
    onError: (error) => {
      setMatchStatus('Erro de conexão');
      onError?.(error.message);
    },
  });
  
  /**
   * Inicia busca por partida
   */
  const findMatch = useCallback(() => {
    if (!isConnected) {
      onError?.('Socket não conectado');
      return;
    }
    
    setIsSearching(true);
    setMatchStatus('Procurando partida...');
    emit('findMatch');
  }, [isConnected, emit, onError]);
  
  /**
   * Cancela busca por partida
   */
  const cancelSearch = useCallback(() => {
    if (!isConnected) return;
    
    setIsSearching(false);
    setMatchStatus('Conectado');
    emit('leaveQueue');
  }, [isConnected, emit]);
  
  /**
   * Setup de eventos
   */
  useEffect(() => {
    if (!socket) return;
    
    // Listener: Status da fila
    const handleMatchStatus = (data: { status: string }) => {
      if (data.status === 'waiting') {
        setMatchStatus('Na fila...');
      }
    };
    
    // Listener: Partida encontrada
    const handleMatchFound = (data: { battleId: string }) => {
      setIsSearching(false);
      setMatchStatus('Partida encontrada!');
      
      // Aguarda battleUpdate com o estado inicial
      const handleBattleUpdate = (updateData: { battleState: BattleState }) => {
        off('battleUpdate', handleBattleUpdate);
        onMatchFound?.(data.battleId, updateData.battleState);
      };
      
      on('battleUpdate', handleBattleUpdate);
    };
    
    // Listener: Jogador entrou na fila
    const handlePlayerJoinedQueue = (data: { playerId: number }) => {
      console.log('[Matchmaking] Jogador entrou na fila:', data.playerId);
    };
    
    // Listener: Jogador saiu da fila
    const handlePlayerLeftQueue = (data: { playerId: number }) => {
      console.log('[Matchmaking] Jogador saiu da fila:', data.playerId);
    };
    
    // Listener: Fila abandonada
    const handleQueueLeft = (data: { success: boolean }) => {
      if (data.success) {
        setIsSearching(false);
        setMatchStatus('Conectado');
      }
    };
    
    on('matchStatus', handleMatchStatus);
    on('matchFound', handleMatchFound);
    on('playerJoinedQueue', handlePlayerJoinedQueue);
    on('playerLeftQueue', handlePlayerLeftQueue);
    on('queueLeft', handleQueueLeft);
    
    // Cleanup
    return () => {
      off('matchStatus', handleMatchStatus);
      off('matchFound', handleMatchFound);
      off('playerJoinedQueue', handlePlayerJoinedQueue);
      off('playerLeftQueue', handlePlayerLeftQueue);
      off('queueLeft', handleQueueLeft);
    };
  }, [socket, on, off, onMatchFound]);
  
  return {
    // Estado
    isSearching,
    matchStatus,
    isConnected,
    
    // Ações
    findMatch,
    cancelSearch,
  };
};
