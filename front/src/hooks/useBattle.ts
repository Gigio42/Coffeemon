import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { BattleState, BattleStatus, PlayerState } from '../types';
import { CoffeemonVariant } from '../../assets/coffeemons';
import { getBaseName } from '../utils/battleUtils';
import { getEventMessage } from '../utils/battleMessages';
import { deriveSpriteState, SpriteStateResult } from '../utils/spriteStateMachine';
import { BattleReward } from '../components/Battle/VictoryModal';

interface BattleEvent {
  type: string;
  message: string;
  payload?: any;
}

interface UseBattleProps {
  battleId: string;
  initialBattleState: any;
  playerId: number;
  socket: Socket;
  onNavigateToMatchmaking: () => void;
  imageSourceGetter: (name: string, variant: CoffeemonVariant) => any;
  animationHandlers: {
    playLunge: (isPlayer: boolean) => Promise<unknown>;
    playShake: (isPlayer: boolean) => Promise<unknown>;
    playCritShake: () => Promise<unknown>;
    playFaint: (isPlayer: boolean) => Promise<unknown>;
    playSwitchIn: (isPlayer: boolean) => Promise<unknown>;
    reset: () => void;
  };
}

const RECENT_DAMAGE_DURATION_MS = 1200;

export function useBattle({
  battleId,
  initialBattleState,
  playerId,
  socket,
  onNavigateToMatchmaking,
  imageSourceGetter,
  animationHandlers,
}: UseBattleProps) {
  // Validação e extração do estado inicial - usar useMemo para evitar recriação
  const extractedBattleState = React.useMemo(() => {
    try {
      // console.log('useBattle - Processing initial battle state:', initialBattleState);
      
      // O initialBattleState pode vir de duas formas:
      // 1. { battleState: {...} } - quando vem do matchFound
      // 2. { battleId: "..." } - quando só tem o ID
      const state = initialBattleState?.battleState;
      
      // Se não tiver battleState, criar um estado inicial mínimo
      if (!state || !state.player1 || !state.player2) {
        console.warn('useBattle - Invalid battle state, creating minimal state');
        return {
          battleStatus: 'ACTIVE' as BattleStatus,
          player1: { coffeemons: [], activeCoffeemonIndex: null, hasSelectedCoffeemon: false },
          player2: { coffeemons: [], activeCoffeemonIndex: null, hasSelectedCoffeemon: false },
          player1Id: playerId,
          player2Id: -1,
          turn: 1,
          turnPhase: 'SELECTION' as const,
          events: [],
          pendingActionStatus: {},
        };
      }
      
      // console.log('useBattle - Battle state extracted successfully:', {
      //   battleStatus: state.battleStatus,
      //   turn: state.turn,
      //   player1Id: state.player1Id,
      //   player2Id: state.player2Id,
      // });
      
      return state;
    } catch (err) {
      console.error('useBattle - Error processing battle state:', err);
      return {
        battleStatus: 'ACTIVE' as BattleStatus,
        player1: { coffeemons: [], activeCoffeemonIndex: null, hasSelectedCoffeemon: false },
        player2: { coffeemons: [], activeCoffeemonIndex: null, hasSelectedCoffeemon: false },
        player1Id: playerId,
        player2Id: -1,
        turn: 1,
        turnPhase: 'SELECTION' as const,
        events: [],
        pendingActionStatus: {},
      };
    }
  }, []); // Empty deps - só criar uma vez
  
  const [battleState, setBattleState] = useState<BattleState>(extractedBattleState);
  const [log, setLog] = useState<string[]>([]);
  const [playerDamage, setPlayerDamage] = useState<number | null>(null);
  const [opponentDamage, setOpponentDamage] = useState<number | null>(null);
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isBattleReady, setIsBattleReady] = useState<boolean>(false);
  const [recentDamageMap, setRecentDamageMap] = useState<Record<string, boolean>>({});
  const [battleRewards, setBattleRewards] = useState<BattleReward | null>({
    playerId,
    coffeemonRewards: [],
    coins: 0,
    totalExp: 0,
  });
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const battleRewardsRef = useRef<BattleReward | null>(null);
  
  // Manter referência sincronizada
  useEffect(() => {
    battleRewardsRef.current = battleRewards;
  }, [battleRewards]);

  const battleStateRef = useRef<BattleState>(battleState);
  const recentDamageTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const coffeemonNameMapRef = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    battleStateRef.current = battleState;
    
    // Build coffeemon name map for rewards using actual ID from backend
    if (battleState) {
      const myPlayerState =
        battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
      
      if (myPlayerState?.coffeemons) {
        myPlayerState.coffeemons.forEach((mon: any) => {
          // Use the actual playerCoffeemonId from backend (mon.id)
          if (mon.id) {
            coffeemonNameMapRef.current.set(mon.id, mon.name);
          }
        });
      }
    }
  }, [battleState, playerId]);

  const addLog = (msg: string) => {
    if (msg) {
      setLog((prev) => [...prev, msg]);
    }
  };

  // Helper para delays
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processEventSequence = async (events: BattleEvent[], fullState: BattleState) => {
    if (events.length === 0) return;
    
    console.log(`🎮 Processing ${events.length} battle events`);
    
    // Estados do jogo para determinar quem é quem
    const myPlayerState = fullState.player1Id === playerId ? fullState.player1 : fullState.player2;
    const opponentPlayerState = fullState.player1Id === playerId ? fullState.player2 : fullState.player1;
    
    // 🎯 SEPARAR EVENTOS EM GRUPOS PARA PROCESSAMENTO SEQUENCIAL CORRETO
    // Pokémon sempre processa switch-in COMPLETAMENTE antes de qualquer outra ação
    const switchEvents: BattleEvent[] = [];
    const otherEvents: BattleEvent[] = [];
    
    for (const event of events) {
      if (event.type === 'SWITCH_IN' || event.type === 'COFFEEMON_SENT_OUT') {
        switchEvents.push(event);
      } else {
        otherEvents.push(event);
      }
    }
    
    // 1️⃣ PROCESSAR TODOS OS SWITCH-INS PRIMEIRO (com bloqueio total)
    console.log(`🔄 Processing ${switchEvents.length} switch events first`);
    for (let i = 0; i < switchEvents.length; i++) {
      const event = switchEvents[i];
      const payload = event.payload || {};
      
      try {
        console.log(`📋 Switch Event ${i + 1}/${switchEvents.length}: ${event.type}`, payload);
        const message = getEventMessage(event);
        addLog(message);
        
        // 🚫 BLOQUEIO: Nenhum outro evento pode processar durante switch-in
        const isPlayerAttacker = payload.playerId === playerId;
        await animationHandlers.playSwitchIn(isPlayerAttacker);
        
        // Delay maior após switch para garantir que está completo
        await delay(700);
        
      } catch (error) {
        console.error(`❌ Error processing switch event ${i + 1}:`, event.type, error);
      }
    }
    
    // 2️⃣ PROCESSAR TODOS OS OUTROS EVENTOS DEPOIS
    console.log(`⚔️ Processing ${otherEvents.length} battle events after switches`);
    for (let i = 0; i < otherEvents.length; i++) {
      const event = otherEvents[i];
      const payload = event.payload || {};
      
      try {
        console.log(`📋 Event ${i + 1}/${otherEvents.length}: ${event.type}`, payload);

        // Gerar mensagem amigável
        const message = getEventMessage(event);
        let finalMessage = message;

        // Adicionar dano à mensagem se aplicável
        if (
          payload?.damage > 0 &&
          (event.type === 'ATTACK_HIT' || event.type === 'ATTACK_CRIT' || event.type === 'STATUS_DAMAGE') &&
          !/\d/.test(message)
        ) {
          finalMessage = `${message} (-${Math.round(payload.damage)} HP)`;
        }

        addLog(finalMessage);
        
        // 🎬 EXECUTAR ANIMAÇÕES BASEADAS NO TIPO DE EVENTO
        await executeEventAnimation(event, payload, myPlayerState, opponentPlayerState);
        
        // 💔 ATUALIZAR INDICADOR DE DANO NA HUD
        updateDamageIndicators(event, payload, myPlayerState);
        
      } catch (error) {
        console.error(`❌ Error processing event ${i + 1}:`, event.type, error);
      }
    }
  };

  // Função auxiliar para executar animação baseada no evento
  const executeEventAnimation = async (
    event: BattleEvent, 
    payload: any,
    myPlayerState: PlayerState,
    opponentPlayerState: PlayerState
  ) => {
    // Determinar quem é o alvo/atacante
    const isPlayerAttacker = payload.playerId === playerId;
    const isPlayerTarget = !isPlayerAttacker || (
      payload.targetName && 
      myPlayerState?.activeCoffeemonIndex !== null &&
      payload.targetName === getBaseName(myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex].name)
    );

    switch (event.type) {
      case 'ATTACK_START':
        await animationHandlers.playLunge(isPlayerAttacker);
        await delay(150);
        break;
        
      case 'ATTACK_HIT':
        if (payload.damage > 0) {
          await animationHandlers.playShake(isPlayerTarget);
        }
        await delay(200);
        break;
        
      case 'ATTACK_CRIT':
        await animationHandlers.playCritShake();
        await delay(250);
        break;
        
      case 'COFFEEMON_FAINTED':
        const faintedIsPlayer = determineFaintedPlayer(payload, myPlayerState);
        await animationHandlers.playFaint(faintedIsPlayer);
        // Delay maior após faint para apreciar a animação
        await delay(900);
        break;
        
      case 'STATUS_DAMAGE':
        if (payload.damage > 0) {
          await animationHandlers.playShake(isPlayerTarget);
        }
        await delay(150);
        break;
        
      default:
        // Pequena pausa para outros eventos
        await delay(100);
        break;
    }
  };

  // Determinar se o Coffeemon que desmaiou é do jogador
  const determineFaintedPlayer = (payload: any, myPlayerState: PlayerState): boolean => {
    if (payload.playerId !== undefined) {
      return payload.playerId === playerId;
    }
    
    if (payload.coffeemonName && myPlayerState?.activeCoffeemonIndex !== null) {
      const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
      return payload.coffeemonName === getBaseName(myActiveMon.name);
    }
    
    return false;
  };

  // Atualizar indicadores de dano na HUD
  const updateDamageIndicators = (event: BattleEvent, payload: any, myPlayerState: PlayerState) => {
    const damageEvents = ['ATTACK_HIT', 'ATTACK_CRIT', 'STATUS_DAMAGE'];
    
    if (!damageEvents.includes(event.type) || !payload.damage || payload.damage <= 0) {
      return;
    }

    // Determinar quem recebeu dano
    let isPlayerTakingDamage = false;
    let damagedMonName: string | null = null;
    
    if (payload.playerId !== undefined) {
      isPlayerTakingDamage = payload.playerId !== playerId;
      damagedMonName = payload.targetName ?? null;
    } else if (payload.targetName && myPlayerState?.activeCoffeemonIndex !== null) {
      const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
      const myActiveMonName = getBaseName(myActiveMon.name);
      isPlayerTakingDamage = payload.targetName === myActiveMonName;
      damagedMonName = payload.targetName;
    } else if (payload.coffeemonName) {
      damagedMonName = payload.coffeemonName;
    }
    
    // Atualizar indicador de dano
    if (isPlayerTakingDamage) {
      setPlayerDamage(payload.damage);
    } else {
      setOpponentDamage(payload.damage);
    }

    // Atualizar mapa de dano recente
    if (damagedMonName) {
      const baseKey = getBaseName(damagedMonName).toLowerCase();
      setRecentDamageMap((prev) => {
        if (prev[baseKey]) {
          return prev;
        }
        return { ...prev, [baseKey]: true };
      });

      if (recentDamageTimeoutsRef.current[baseKey]) {
        clearTimeout(recentDamageTimeoutsRef.current[baseKey]);
      }

      recentDamageTimeoutsRef.current[baseKey] = setTimeout(() => {
        setRecentDamageMap((prev) => {
          if (!prev[baseKey]) {
            return prev;
          }
          const { [baseKey]: _, ...rest } = prev;
          return rest;
        });
        delete recentDamageTimeoutsRef.current[baseKey];
      }, RECENT_DAMAGE_DURATION_MS);
    }
  };

  const handleBattleEnd = async (winnerIdParam: number) => {
    if (battleEnded || battleStateRef.current.battleStatus === BattleStatus.FINISHED) {
      return;
    }

    console.log('🏆 [Battle] Battle ended, winner:', winnerIdParam);
    console.log('💰 [Battle] Current rewards state:', battleRewardsRef.current);
    
    setBattleEnded(true);
    setWinnerId(winnerIdParam);
    addLog(`A batalha terminou! Vencedor: Jogador ${winnerIdParam}`);

    // ⚠️ NÃO inicializar recompensas aqui - esperar eventos do backend
    // As recompensas vêm via socket events: playerLevelUp, coffeemonLevelUp, inventoryUpdate
    // ⚠️ NÃO mostrar modal automaticamente - esperar jogador ler último diálogo
    // O modal será mostrado via useEffect quando hasUnreadMessages ficar false
  };

  const setupBattleEvents = () => {
    let isHandlingUpdate = false;
    let lastUpdateTime = 0;
    const MIN_UPDATE_INTERVAL = 200; // ms entre updates

    const handleBattleUpdate = (newBattleState: BattleState) => {
      // console.log('[Battle] Received battle update:', {
      //   hasPlayer1: !!newBattleState?.player1,
      //   hasPlayer2: !!newBattleState?.player2,
      //   state: newBattleState
      // });
      
      requestAnimationFrame(() => {
        try {
          setIsProcessing(true);
          
          // Mark battle as ready when receiving first valid state
          const isStateValid = newBattleState?.player1 && newBattleState?.player2;
          if (!isBattleReady && isStateValid) {
            // console.log('[Battle] Setting battle as ready');
            setIsBattleReady(true);
          } else if (!isStateValid) {
            console.warn('[Battle] Received incomplete battle state:', newBattleState);
          }  
          
          // Atualizar estado primeiro (síncrono)
          setBattleState(newBattleState);

          // Processar eventos com animações em sequência
          if (newBattleState.events && newBattleState.events.length > 0) {
            console.log(`📦 Received ${newBattleState.events.length} events from backend`);
            
            // Processar TODOS os eventos em ordem
            processEventSequence(newBattleState.events, newBattleState).catch(err => {
              console.error('Error processing events:', err);
            }).finally(() => {
              setIsProcessing(false);
              isHandlingUpdate = false;
            });
          } else {
            setIsProcessing(false);
            isHandlingUpdate = false;
          }

          if (newBattleState.turnPhase === 'SELECTION') {
            const myState =
              newBattleState.player1Id === playerId ? newBattleState.player1 : newBattleState.player2;
            if (myState && !myState.hasSelectedCoffeemon) {
              setShowSelectionModal(true);
            } else {
              setShowSelectionModal(false);
            }
          } else {
            setShowSelectionModal(false);
          }

          if (newBattleState.battleStatus === BattleStatus.FINISHED) {
            if (newBattleState.winnerId !== null) {
              handleBattleEnd(newBattleState.winnerId);
            }
          }
        } catch (err) {
          console.error('Error processing battle update:', err);
          isHandlingUpdate = false;
          setIsProcessing(false);
        }
      });
      
    };

    const handleError = (error: any) => {
      console.error('[Battle] Socket error:', error);
      // Set battle as ready to prevent infinite loading
      setIsBattleReady(true);
    };

    // Handle reward events
    const handlePlayerLevelUp = (data: { newLevel: number }) => {
      console.log('🎉 [Battle] Player leveled up:', data);
      setBattleRewards((prev) => {
        const updated = {
          ...prev,
          playerId: prev?.playerId || playerId,
          coffeemonRewards: prev?.coffeemonRewards || [],
          coins: prev?.coins || 0,
          totalExp: prev?.totalExp || 0,
          playerLevelUp: { newLevel: data.newLevel },
        };
        console.log('📊 Updated rewards with player level up:', updated);
        return updated;
      });
    };

    const handleCoffeemonLevelUp = (data: {
      playerCoffeemonId: number;
      newLevel: number;
      expGained: number;
    }) => {
      console.log('⬆️ [Battle] Coffeemon leveled up:', data);
      setBattleRewards((prev) => {
        if (!prev) {
          prev = { playerId, coffeemonRewards: [], coins: 0, totalExp: 0 };
        }
        
        // Find existing reward or create new one
        let updatedRewards = [...prev.coffeemonRewards];
        const existingIdx = updatedRewards.findIndex(
          (r) => r.playerCoffeemonId === data.playerCoffeemonId
        );

        // Try to get coffeemon name from map
        const coffeemonName = coffeemonNameMapRef.current.get(data.playerCoffeemonId) || 
                              `Coffeemon #${data.playerCoffeemonId}`;

        if (existingIdx >= 0) {
          updatedRewards[existingIdx] = {
            ...updatedRewards[existingIdx],
            coffeemonName, // Update name if available
            levelUp: {
              newLevel: data.newLevel,
              expGained: data.expGained,
            },
          };
        } else {
          // Create new reward entry if not found
          updatedRewards.push({
            playerCoffeemonId: data.playerCoffeemonId,
            coffeemonName,
            learnedMoves: [],
            levelUp: {
              newLevel: data.newLevel,
              expGained: data.expGained,
            },
          });
        }

        const updated = {
          ...prev,
          coffeemonRewards: updatedRewards,
          totalExp: prev.totalExp + data.expGained,
        };
        console.log('📊 Updated rewards with coffeemon level up:', updated);
        return updated;
      });
    };

    const handleCoffeemonLearnedMove = (data: {
      playerCoffeemonId: number;
      moveName: string;
    }) => {
      console.log('🎯 [Battle] Coffeemon learned move:', data);
      setBattleRewards((prev) => {
        if (!prev) {
          prev = { playerId, coffeemonRewards: [], coins: 0, totalExp: 0 };
        }
        
        let updatedRewards = [...prev.coffeemonRewards];
        const existingIdx = updatedRewards.findIndex(
          (r) => r.playerCoffeemonId === data.playerCoffeemonId
        );

        // Try to get coffeemon name from map
        const coffeemonName = coffeemonNameMapRef.current.get(data.playerCoffeemonId) || 
                              `Coffeemon #${data.playerCoffeemonId}`;

        if (existingIdx >= 0) {
          updatedRewards[existingIdx] = {
            ...updatedRewards[existingIdx],
            coffeemonName, // Update name if available
            learnedMoves: [...updatedRewards[existingIdx].learnedMoves, data.moveName],
          };
        } else {
          // Create new reward entry if not found
          updatedRewards.push({
            playerCoffeemonId: data.playerCoffeemonId,
            coffeemonName,
            learnedMoves: [data.moveName],
          });
        }

        const updated = {
          ...prev,
          coffeemonRewards: updatedRewards,
        };
        console.log('📊 Updated rewards with learned move:', updated);
        return updated;
      });
    };

    const handleInventoryUpdate = (data: { coins: number; inventory: any }) => {
      console.log('💰 [Battle] Inventory updated:', data);
      setBattleRewards((prev) => {
        const updated = {
          ...prev,
          playerId: prev?.playerId || playerId,
          coffeemonRewards: prev?.coffeemonRewards || [],
          totalExp: prev?.totalExp || 0,
          coins: data.coins,
        };
        console.log('📊 Updated rewards with coins:', updated);
        return updated;
      });
    };

    const handleBattleEndEvent = (data: { winnerId: number; battleState?: any }) => {
      console.log('[Battle] Battle ended event:', data);
      if (data.winnerId !== null && data.winnerId !== undefined) {
        handleBattleEnd(data.winnerId);
      }
    };

    socket.on('battleUpdate', async (data: any) => {
      const now = Date.now();
      
      // Throttle: ignorar updates muito frequentes
      if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
        return;
      }
      
      if (!data || !data.battleState) {
        console.error('Invalid battleUpdate data');
        return;
      }

      // Evitar processamento múltiplo simultâneo
      if (isHandlingUpdate) {
        return;
      }

      isHandlingUpdate = true;
      lastUpdateTime = now;

      handleBattleUpdate(data.battleState);
    });

    // Set up additional event listeners
    socket.on('error', handleError);
    socket.on('connect_error', handleError);
    socket.on('battleEnd', handleBattleEndEvent);
    socket.on('playerLevelUp', handlePlayerLevelUp);
    socket.on('coffeemonLevelUp', handleCoffeemonLevelUp);
    socket.on('coffeemonLearnedMove', handleCoffeemonLearnedMove);
    socket.on('inventoryUpdate', handleInventoryUpdate);

    // Log initial connection status
    // console.log('[Battle] Socket connected:', socket.connected);
    if (socket.connected) {
      // console.log('[Battle] Requesting initial battle state...');
      socket.emit('get_battle_state', { battleId });
    }
  };

  const sendAction = (actionType: string, payload: any) => {
    socket.emit('battleAction', { battleId, actionType, payload });
  };

  const selectInitialCoffeemon = (coffeemonIndex: number) => {
    socket.emit('selectInitialCoffeemon', {
      battleId,
      coffeemonIndex,
    });
    setShowSelectionModal(false);
  };

  useEffect(() => {
    setupBattleEvents();
    socket.emit('joinBattle', { battleId });
    
    if (extractedBattleState.turnPhase === 'SELECTION') {
      const myState =
        extractedBattleState.player1Id === playerId
          ? extractedBattleState.player1
          : extractedBattleState.player2;
      if (myState && !myState.hasSelectedCoffeemon) {
        setShowSelectionModal(true);
      }
    }

    return () => {
      socket.off('battleUpdate');
      socket.off('battleEnd');
      socket.off('battleError');
      socket.off('opponentDisconnected');
      socket.off('playerReconnected');
      socket.off('battleCancelled');
      socket.off('playerLevelUp');
      socket.off('coffeemonLevelUp');
      socket.off('coffeemonLearnedMove');
      socket.off('inventoryUpdate');
      Object.values(recentDamageTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      recentDamageTimeoutsRef.current = {};
    };
  }, []);

  const myPlayerState =
    battleState?.player1Id === playerId ? battleState?.player1 : battleState?.player2;
  const opponentPlayerState =
    battleState?.player1Id === playerId ? battleState?.player2 : battleState?.player1;

  const myPendingAction = battleState?.pendingActions?.[playerId];
  const hasPendingEvents = battleState?.events && battleState.events.length > 0;
  const isSubmissionPhase = battleState?.turnPhase === 'SUBMISSION';
  const isSelectingInitialCoffeemon =
    battleState?.turnPhase === 'SELECTION' && myPlayerState && !myPlayerState.hasSelectedCoffeemon;
  const bothPlayersSelected =
    myPlayerState?.hasSelectedCoffeemon && opponentPlayerState?.hasSelectedCoffeemon;
  const hasActiveCoffeemon =
    myPlayerState?.activeCoffeemonIndex !== null &&
    myPlayerState?.activeCoffeemonIndex !== undefined;

  const canAct =
    !battleEnded &&
    !isProcessing &&
    !myPendingAction &&
    (!hasPendingEvents || isSubmissionPhase) && // ✅ Eventos não bloqueiam em SUBMISSION
    (isSubmissionPhase ||
      isSelectingInitialCoffeemon ||
      battleState?.currentPlayerId === playerId ||
      (bothPlayersSelected && hasActiveCoffeemon));

  const resolveSpriteVariant = useCallback(
    (coffeemonName: string, baseVariant: CoffeemonVariant, statusEffects?: any[]): SpriteStateResult => {
      const baseName = getBaseName(coffeemonName).toLowerCase();
      const context = {
        statusEffects,
        recentlyDamaged: recentDamageMap[baseName] ?? false,
      };
      return deriveSpriteState(context, baseVariant);
    },
    [recentDamageMap],
  );

  return {
    battleState,
    log,
    playerDamage,
    opponentDamage,
    battleEnded,
    winnerId,
    showSelectionModal,
    isProcessing,
    myPlayerState,
    opponentPlayerState,
    myPendingAction,
    canAct,
    isBattleReady,
    sendAction,
    selectInitialCoffeemon,
    recentDamageMap,
    resolveSpriteVariant,
    battleRewards,
    showVictoryModal,
    setShowVictoryModal,
  };
}
