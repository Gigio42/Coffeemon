import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import {
  BattleState,
  BattleStatus,
  BattleActionType,
  AttackPayload,
  SwitchPayload,
  CoffeemonState,
} from '../../../types';
import { BATTLE_CONFIG } from '../../../utils/config';

/**
 * ========================================
 * USE BATTLE ENGINE HOOK
 * ========================================
 * 
 * Hook customizado que gerencia toda a lógica de batalha
 * Implementa FSM (Finite State Machine) para controle de turnos
 * Gerencia animações, eventos e estado da batalha
 */

interface UseBattleEngineOptions {
  socket: Socket;
  battleId: string;
  initialState: BattleState;
  playerId: number;
  onBattleEnd?: (winnerId: number) => void;
}

interface UseBattleEngineReturn {
  // Estado
  battleState: BattleState;
  isMyTurn: boolean;
  myMon: CoffeemonState | null;
  opponentMon: CoffeemonState | null;
  battleLog: string[];
  battleEnded: boolean;
  winnerId: number | null;
  
  // Ações
  performAttack: (moveId: number) => void;
  switchCoffeemon: (newIndex: number) => void;
  
  // Animações
  isAnimating: boolean;
  damageAnimation: { playerId: number; active: boolean } | null;
}

export const useBattleEngine = (options: UseBattleEngineOptions): UseBattleEngineReturn => {
  const { socket, battleId, initialState, playerId, onBattleEnd } = options;
  
  // Estado
  const [battleState, setBattleState] = useState<BattleState>(initialState);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [damageAnimation, setDamageAnimation] = useState<{ playerId: number; active: boolean } | null>(null);
  
  // Refs para evitar stale closures
  const battleStateRef = useRef(battleState);
  battleStateRef.current = battleState;
  
  /**
   * Verifica se é o turno do jogador
   */
  const isMyTurn = battleState.currentPlayerId === playerId;
  
  /**
   * Retorna Coffeemon ativo do jogador
   */
  const myMon = (() => {
    const myState = battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
    return myState.coffeemons[myState.activeCoffeemonIndex] || null;
  })();
  
  /**
   * Retorna Coffeemon ativo do oponente
   */
  const opponentMon = (() => {
    const opponentState = battleState.player1Id === playerId ? battleState.player2 : battleState.player1;
    return opponentState.coffeemons[opponentState.activeCoffeemonIndex] || null;
  })();
  
  /**
   * Processa eventos de batalha (animações, log)
   */
  const processEvents = useCallback((events: any[]) => {
    if (!events || events.length === 0) return;
    
    const newLogs: string[] = [];
    
    events.forEach((event) => {
      // Adiciona ao log
      if (event.message) {
        newLogs.push(event.message);
      }
      
      // Processa animações
      if (event.type === 'damage' || event.type === 'attack') {
        const targetPlayerId = event.payload?.targetPlayerId;
        if (targetPlayerId) {
          setDamageAnimation({ playerId: targetPlayerId, active: true });
          
          // Remove animação após duração configurada
          setTimeout(() => {
            setDamageAnimation(null);
          }, BATTLE_CONFIG.DAMAGE_ANIMATION_DURATION);
        }
      }
    });
    
    if (newLogs.length > 0) {
      setBattleLog(prev => [...prev, ...newLogs].slice(-10)); // Mantém últimas 10 mensagens
    }
  }, []);
  
  /**
   * Envia ação de ataque
   */
  const performAttack = useCallback((moveId: number) => {
    if (!isMyTurn || isAnimating || battleEnded) {
      console.warn('[Battle] Não é possível atacar agora');
      return;
    }
    
    setIsAnimating(true);
    
    const payload: AttackPayload = { moveId };
    socket.emit('battleAction', {
      battleId,
      actionType: BattleActionType.ATTACK,
      payload,
    });
    
    // Libera animação após delay
    setTimeout(() => setIsAnimating(false), 500);
  }, [socket, battleId, isMyTurn, isAnimating, battleEnded]);
  
  /**
   * Envia ação de troca de Coffeemon
   */
  const switchCoffeemon = useCallback((newIndex: number) => {
    if (!isMyTurn || isAnimating || battleEnded) {
      console.warn('[Battle] Não é possível trocar agora');
      return;
    }
    
    setIsAnimating(true);
    
    const payload: SwitchPayload = { newIndex };
    socket.emit('battleAction', {
      battleId,
      actionType: BattleActionType.SWITCH,
      payload,
    });
    
    // Libera animação após delay
    setTimeout(() => setIsAnimating(false), 500);
  }, [socket, battleId, isMyTurn, isAnimating, battleEnded]);
  
  /**
   * Setup de eventos do socket
   */
  useEffect(() => {
    if (!socket) return;
    
    // Entra na batalha
    socket.emit('joinBattle', { battleId });
    
    // Listener: Atualização de estado
    const handleBattleUpdate = (data: { battleState: BattleState }) => {
      setBattleState(data.battleState);
      processEvents(data.battleState.events);
    };
    
    // Listener: Fim de batalha
    const handleBattleEnd = (data: { winnerId: number; battleState: BattleState }) => {
      setBattleState(data.battleState);
      setBattleEnded(true);
      setWinnerId(data.winnerId);
      
      // Callback após delay
      setTimeout(() => {
        onBattleEnd?.(data.winnerId);
      }, BATTLE_CONFIG.BATTLE_END_DELAY);
    };
    
    // Listener: Erro
    const handleBattleError = (data: { message: string }) => {
      console.error('[Battle] Erro:', data.message);
      setBattleLog(prev => [...prev, `Erro: ${data.message}`]);
    };
    
    socket.on('battleUpdate', handleBattleUpdate);
    socket.on('battleEnd', handleBattleEnd);
    socket.on('battleError', handleBattleError);
    
    // Cleanup
    return () => {
      socket.off('battleUpdate', handleBattleUpdate);
      socket.off('battleEnd', handleBattleEnd);
      socket.off('battleError', handleBattleError);
    };
  }, [socket, battleId, processEvents, onBattleEnd]);
  
  return {
    // Estado
    battleState,
    isMyTurn,
    myMon,
    opponentMon,
    battleLog,
    battleEnded,
    winnerId,
    
    // Ações
    performAttack,
    switchCoffeemon,
    
    // Animações
    isAnimating,
    damageAnimation,
  };
};
