import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { BattleState, BattleStatus, PlayerState } from '../types';
import { getCoffeemonImageUrl } from '../utils/battleUtils';
import { getEventMessage } from '../utils/battleMessages';

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
  animationHandlers: {
    playLunge: (isPlayer: boolean) => Promise<unknown>;
    playShake: (isPlayer: boolean) => Promise<unknown>;
    playCritShake: () => Promise<unknown>;
    playFaint: (isPlayer: boolean) => Promise<unknown>;
    playSwitchIn: (isPlayer: boolean) => Promise<unknown>;
    reset: () => void;
  };
}

export function useBattle({
  battleId,
  initialBattleState,
  playerId,
  socket,
  onNavigateToMatchmaking,
  animationHandlers,
}: UseBattleProps) {
  // Validação e extração do estado inicial - usar useMemo para evitar recriação
  const extractedBattleState = React.useMemo(() => {
    try {
      console.log('useBattle - Processing initial battle state:', initialBattleState);
      
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
      
      console.log('useBattle - Battle state extracted successfully:', {
        battleStatus: state.battleStatus,
        turn: state.turn,
        player1Id: state.player1Id,
        player2Id: state.player2Id,
      });
      
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
  const [playerImageUrl, setPlayerImageUrl] = useState<string>('');
  const [opponentImageUrl, setOpponentImageUrl] = useState<string>('');
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isBattleReady, setIsBattleReady] = useState<boolean>(false);

  const battleStateRef = useRef<BattleState>(battleState);

  useEffect(() => {
    battleStateRef.current = battleState;
  }, [battleState]);

  const addLog = (msg: string) => {
    if (msg) {
      setLog((prev) => [...prev, msg]);
    }
  };

  const showPopup = (message: string) => {
    return new Promise((resolve) => {
      if (!message) {
        resolve(true);
        return;
      }
      setPopupMessage(message);
      
      // Mostrar por 800ms e depois esconder
      setTimeout(() => {
        setPopupMessage(null);
        resolve(true);
      }, 800);
    });
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
        // Gerar mensagem amigável usando o helper
        const message = getEventMessage(event);
        addLog(message);
        
        // Sem delay entre eventos - modo performance
        
        // Apenas popup, SEM animações (modo performance para APK)
        const popupPromise = Promise.race([
          showPopup(message),
          new Promise(resolve => setTimeout(resolve, 400))
        ]);

        await popupPromise;
      } catch (error) {
        console.error('Error processing event:', event, error);
        // Continuar processando próximos eventos mesmo se um falhar
      }
    }
  };

  const updateCoffeemonImages = (state: BattleState) => {
    if (!state || !playerId) {
      console.log('updateCoffeemonImages: Invalid state or playerId');
      return;
    }

    try {
      console.log('updateCoffeemonImages: Starting update');
      const myPlayerState = state.player1Id === playerId ? state.player1 : state.player2;
      const opponentPlayerState =
        state.player1Id === playerId ? state.player2 : state.player1;

      if (myPlayerState && myPlayerState.activeCoffeemonIndex !== null) {
        const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
        if (myActiveMon && myActiveMon.name) {
          const imageUrl = getCoffeemonImageUrl(myActiveMon.name, 'back');
          console.log('updateCoffeemonImages: Player image URL:', imageUrl);
          setPlayerImageUrl(imageUrl);
        }
      } else {
        setPlayerImageUrl('');
      }

      if (opponentPlayerState && opponentPlayerState.activeCoffeemonIndex !== null) {
        const opponentActiveMon =
          opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
        if (opponentActiveMon && opponentActiveMon.name) {
          const imageUrl = getCoffeemonImageUrl(opponentActiveMon.name, 'default');
          console.log('updateCoffeemonImages: Opponent image URL:', imageUrl);
          setOpponentImageUrl(imageUrl);
        }
      } else {
        setOpponentImageUrl('');
      }
      console.log('updateCoffeemonImages: Update complete');
    } catch (error) {
      console.error('Erro ao atualizar imagens dos Coffeemon:', error);
    }
  };

  const handleBattleEnd = (winnerIdParam: number) => {
    if (battleEnded || battleStateRef.current.battleStatus === BattleStatus.FINISHED) {
      return;
    }

    setBattleEnded(true);
    setWinnerId(winnerIdParam);
    addLog(`A batalha terminou! Vencedor: Jogador ${winnerIdParam}`);

    setTimeout(() => {
      onNavigateToMatchmaking();
    }, 4000);
  };

  const setupBattleEvents = () => {
    let isHandlingUpdate = false;
    let lastUpdateTime = 0;
    const MIN_UPDATE_INTERVAL = 200; // ms entre updates

    socket.on('battleUpdate', async (data: any) => {
      try {
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
        
        const newBattleState = data.battleState;

        // Usar requestAnimationFrame para sincronizar com o frame
        requestAnimationFrame(() => {
          try {
            setIsProcessing(true);
            
            // Marcar batalha como pronta quando receber primeiro estado válido
            if (!isBattleReady && newBattleState.player1 && newBattleState.player2) {
              setIsBattleReady(true);
            }
            
            // Atualizar estado primeiro (síncrono)
            setBattleState(newBattleState);
            updateCoffeemonImages(newBattleState);

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
              handleBattleEnd(newBattleState.winnerId);
            }
          } catch (err) {
            console.error('Error processing battle update:', err);
            isHandlingUpdate = false;
            setIsProcessing(false);
          }
        });
        
      } catch (error) {
        console.error('Error in battleUpdate handler:', error);
        isHandlingUpdate = false;
        setIsProcessing(false);
      }
    });

    socket.on('battleEnd', (data: any) => {
      console.log('Received battleEnd event:', data);
      handleBattleEnd(data.winnerId);
    });

    socket.on('battleError', (data: any) => {
      console.error('Battle error:', data.message);
      addLog(`Erro: ${data.message}`);
    });

    socket.on('opponentDisconnected', (data: any) => {
      addLog('Oponente desconectou da batalha');
    });

    socket.on('playerReconnected', (data: any) => {
      addLog('Oponente reconectou à batalha');
    });

    socket.on('battleCancelled', (data: any) => {
      addLog('Batalha cancelada pelo servidor');
      onNavigateToMatchmaking();
    });
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
    updateCoffeemonImages(extractedBattleState);
    
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
    };
  }, []);

  const myPlayerState =
    battleState?.player1Id === playerId ? battleState?.player1 : battleState?.player2;
  const opponentPlayerState =
    battleState?.player1Id === playerId ? battleState?.player2 : battleState?.player1;

  const myPendingAction = battleState?.pendingActions?.[playerId];
  const canAct =
    !battleEnded &&
    !isProcessing &&
    !myPendingAction &&
    battleState?.turnPhase === 'SUBMISSION';

  return {
    battleState,
    log,
    playerImageUrl,
    opponentImageUrl,
    battleEnded,
    winnerId,
    showSelectionModal,
    isProcessing,
    popupMessage,
    myPlayerState,
    opponentPlayerState,
    myPendingAction,
    canAct,
    isBattleReady,
    sendAction,
    selectInitialCoffeemon,
  };
}
