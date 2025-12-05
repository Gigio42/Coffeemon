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
  const [battleRewards, setBattleRewards] = useState<BattleReward | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const battleStateRef = useRef<BattleState>(battleState);
  const recentDamageTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const coffeemonNameMapRef = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    battleStateRef.current = battleState;
    
    // Build coffeemon name map for rewards
    if (battleState) {
      const myPlayerState =
        battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
      
      if (myPlayerState?.coffeemons) {
        myPlayerState.coffeemons.forEach((mon, idx) => {
          // Store mapping using index as key (will be updated when we get actual IDs)
          coffeemonNameMapRef.current.set(idx, mon.name);
        });
      }
    }
  }, [battleState, playerId]);

  const addLog = (msg: string) => {
    if (msg) {
      setLog((prev) => [...prev, msg]);
    }
  };

  const playAnimationForEvent = async (event: BattleEvent, fullState: BattleState) => {
    try {
      const payload = event.payload || {};
      const myPlayerState =
        fullState.player1Id === playerId ? fullState.player1 : fullState.player2;
      const isPlayerAttacker = payload.playerId === playerId;

      const activeMonName =
        myPlayerState && myPlayerState.activeCoffeemonIndex !== null
          ? getBaseName(myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex].name)
          : '';

      const isPlayerTarget = payload.targetName === activeMonName;

      switch (event.type) {
        case 'ATTACK_HIT':
          await animationHandlers.playShake(!isPlayerAttacker);
          break;
        case 'ATTACK_CRIT':
          await animationHandlers.playCritShake();
          break;
        case 'ATTACK_MISS':
        case 'ATTACK_BLOCKED':
          // Sem animação para miss/block - mais rápido
          break;
        case 'COFFEEMON_FAINTED':
          await animationHandlers.playFaint(isPlayerTarget);
          break;
        case 'SWITCH_SUCCESS':
          animationHandlers.reset();
          await animationHandlers.playSwitchIn(payload.playerId === playerId);
          break;
        case 'STATUS_DAMAGE':
          // Sem animação para status damage - mais rápido
          break;
        default:
          // Sem delay para outros eventos
          break;
      }
    } catch (error) {
      console.error('Error in playAnimationForEvent:', event.type, error);
    }
  };

  const processEventSequence = async (events: BattleEvent[], fullState: BattleState) => {
    // Limitar número de eventos para evitar sobrecarga no mobile
    const maxEvents = 5;
    const eventsToProcess = events.slice(0, maxEvents);
    
    if (events.length > maxEvents) {
      console.warn(`Too many events (${events.length}), processing only first ${maxEvents}`);
    }

    for (let i = 0; i < eventsToProcess.length; i++) {
      const event = eventsToProcess[i];
      
      try {
        const payload = event.payload || {};

        // Gerar mensagem amigável usando o helper
        const message = getEventMessage(event);
        let finalMessage = message;

        if (
          payload?.damage > 0 &&
          (event.type === 'ATTACK_HIT' || event.type === 'ATTACK_CRIT' || event.type === 'STATUS_DAMAGE') &&
          !/\d/.test(message)
        ) {
          const damageValue = Math.round(payload.damage);
          finalMessage = `${message} (-${damageValue} HP)`;
        }

        // console.log('Processing event:', { type: event.type, message: finalMessage, payload: event.payload });
        addLog(finalMessage);
        
        // Handle damage display
        // console.log('Checking for damage:', event.type, payload.damage);
        if ((event.type === 'ATTACK_HIT' || event.type === 'ATTACK_CRIT' || event.type === 'STATUS_DAMAGE') && payload.damage > 0) {
          // Para ataques, usar playerId se disponível, senão determinar pelo target
          let isPlayerTakingDamage = false;
          let damagedMonName: string | null = null;
          
          if (payload.playerId !== undefined) {
            // Se temos playerId, é o atacante
            isPlayerTakingDamage = payload.playerId !== playerId;
            damagedMonName = payload.targetName ?? null;
          } else if (payload.targetName) {
            // Fallback: verificar se o target é o Coffeemon ativo do jogador
            const myPlayerState =
              fullState.player1Id === playerId ? fullState.player1 : fullState.player2;
            const activeMonName =
              myPlayerState && myPlayerState.activeCoffeemonIndex !== null
                ? getBaseName(myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex].name)
                : '';
            const targetIsPlayer = payload.targetName === activeMonName;
            isPlayerTakingDamage = targetIsPlayer;
            damagedMonName = payload.targetName;
          } else if (payload.coffeemonName) {
            damagedMonName = payload.coffeemonName;
          }
          
          // console.log('Damage event detected:', {
          //   type: event.type,
          //   playerId,
          //   payload,
          //   isPlayerTakingDamage,
          //   damage: payload.damage
          // });
          
          if (isPlayerTakingDamage) {
            setPlayerDamage(payload.damage);
          } else {
            setOpponentDamage(payload.damage);
          }

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
        }
        
        // Sem delay entre eventos - modo performance
      } catch (error) {
        console.error('Error processing event:', event, error);
        // Continuar processando próximos eventos mesmo se um falhar
      }
    }
  };

  const handleBattleEnd = (winnerIdParam: number) => {
    if (battleEnded || battleStateRef.current.battleStatus === BattleStatus.FINISHED) {
      return;
    }

    setBattleEnded(true);
    setWinnerId(winnerIdParam);
    addLog(`A batalha terminou! Vencedor: Jogador ${winnerIdParam}`);

    // Initialize rewards structure
    const myPlayerState =
      battleStateRef.current.player1Id === playerId
        ? battleStateRef.current.player1
        : battleStateRef.current.player2;

    const initialRewards: BattleReward = {
      playerId,
      coffeemonRewards: myPlayerState?.coffeemons?.map((mon: any, idx: number) => ({
        playerCoffeemonId: idx, // Will be updated by actual events
        coffeemonName: mon.name,
        learnedMoves: [],
      })) || [],
      coins: 0,
      totalExp: 0,
    };

    setBattleRewards(initialRewards);
    
    // Show modal after a short delay to let animations finish
    setTimeout(() => {
      setShowVictoryModal(true);
    }, 1500);
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

          // Processar eventos com animações otimizadas
          if (newBattleState.events && newBattleState.events.length > 0) {
            // Limitar eventos para não sobrecarregar
            const eventsToProcess = newBattleState.events.slice(0, 5);
            
            // Processar de forma não bloqueante
            processEventSequence(eventsToProcess, newBattleState).catch(err => {
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
      console.log('[Battle] Player leveled up:', data);
      setBattleRewards((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          playerLevelUp: { newLevel: data.newLevel },
        };
      });
    };

    const handleCoffeemonLevelUp = (data: {
      playerCoffeemonId: number;
      newLevel: number;
      expGained: number;
    }) => {
      console.log('[Battle] Coffeemon leveled up:', data);
      setBattleRewards((prev) => {
        if (!prev) return prev;
        
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

        return {
          ...prev,
          coffeemonRewards: updatedRewards,
          totalExp: prev.totalExp + data.expGained,
        };
      });
    };

    const handleCoffeemonLearnedMove = (data: {
      playerCoffeemonId: number;
      moveName: string;
    }) => {
      console.log('[Battle] Coffeemon learned move:', data);
      setBattleRewards((prev) => {
        if (!prev) return prev;
        
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

        return {
          ...prev,
          coffeemonRewards: updatedRewards,
        };
      });
    };

    const handleInventoryUpdate = (data: { coins: number; inventory: any }) => {
      console.log('[Battle] Inventory updated:', data);
      setBattleRewards((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          coins: data.coins,
        };
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
