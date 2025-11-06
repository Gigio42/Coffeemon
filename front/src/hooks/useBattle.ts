import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { BattleState, BattleStatus, PlayerState } from '../types';
import { BASE_IMAGE_URL } from '../utils/config';
import { getBaseName } from '../utils/battleUtils';
import { useSharedValue, withSequence, withTiming, withDelay } from 'react-native-reanimated';

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
  const extractedBattleState = initialBattleState?.battleState || initialBattleState;
  
  const [battleState, setBattleState] = useState<BattleState>(extractedBattleState);
  const [log, setLog] = useState<string[]>([]);
  const [playerImageUrl, setPlayerImageUrl] = useState<string>('');
  const [opponentImageUrl, setOpponentImageUrl] = useState<string>('');
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const battleStateRef = useRef<BattleState>(battleState);
  const popupOpacity = useSharedValue(0);

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
      popupOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(
          1200,
          withTiming(0, { duration: 200 }, (finished) => {
            if (finished) {
              setPopupMessage(null);
              resolve(true);
            }
          })
        )
      );
    });
  };

  const playAnimationForEvent = async (event: BattleEvent, fullState: BattleState) => {
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
        await animationHandlers.playLunge(isPlayerAttacker);
        await animationHandlers.playShake(!isPlayerAttacker);
        break;
      case 'ATTACK_CRIT':
        await animationHandlers.playLunge(isPlayerAttacker);
        await animationHandlers.playCritShake();
        await animationHandlers.playShake(!isPlayerAttacker);
        break;
      case 'ATTACK_MISS':
      case 'ATTACK_BLOCKED':
        await animationHandlers.playLunge(isPlayerAttacker);
        break;
      case 'COFFEEMON_FAINTED':
        await animationHandlers.playFaint(isPlayerTarget);
        break;
      case 'SWITCH_SUCCESS':
        animationHandlers.reset();
        await animationHandlers.playSwitchIn(payload.playerId === playerId);
        break;
      case 'STATUS_DAMAGE':
        await animationHandlers.playShake(isPlayerTarget);
        break;
      default:
        await new Promise((r) => setTimeout(r, 200));
        break;
    }
  };

  const processEventSequence = async (events: BattleEvent[], fullState: BattleState) => {
    for (const event of events) {
      addLog(event.message);
      const animationPromise = playAnimationForEvent(event, fullState);
      const popupPromise = showPopup(event.message);

      await Promise.all([animationPromise, popupPromise]);
    }
  };

  const updateCoffeemonImages = (state: BattleState) => {
    if (!state || !playerId) return;

    try {
      const myPlayerState = state.player1Id === playerId ? state.player1 : state.player2;
      const opponentPlayerState =
        state.player1Id === playerId ? state.player2 : state.player1;

      if (myPlayerState && myPlayerState.activeCoffeemonIndex !== null) {
        const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
        if (myActiveMon && myActiveMon.name) {
          setPlayerImageUrl(`${BASE_IMAGE_URL}${getBaseName(myActiveMon.name)}/back.png`);
        }
      } else {
        setPlayerImageUrl('');
      }

      if (opponentPlayerState && opponentPlayerState.activeCoffeemonIndex !== null) {
        const opponentActiveMon =
          opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
        if (opponentActiveMon && opponentActiveMon.name) {
          setOpponentImageUrl(
            `${BASE_IMAGE_URL}${getBaseName(opponentActiveMon.name)}/default.png`
          );
        }
      } else {
        setOpponentImageUrl('');
      }
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
    socket.on('battleUpdate', async (data: any) => {
      console.log('Received battleUpdate:', data);
      if (!data || !data.battleState) {
        console.error('Invalid battleUpdate data');
        return;
      }

      setIsProcessing(true);
      const newBattleState = data.battleState;

      await processEventSequence(newBattleState.events || [], newBattleState);

      setBattleState(newBattleState);
      updateCoffeemonImages(newBattleState);

      if (newBattleState.turnPhase === 'SELECTION') {
        const myState =
          newBattleState.player1Id === playerId ? newBattleState.player1 : newBattleState.player2;
        if (myState && !myState.hasSelectedCoffeemon) {
          setShowSelectionModal(true);
        } else {
          setShowSelectionModal(false);
          if (!isProcessing) addLog('Aguardando oponente selecionar Coffeemon...');
        }
      } else {
        setShowSelectionModal(false);
      }

      if (newBattleState.battleStatus === BattleStatus.FINISHED) {
        handleBattleEnd(newBattleState.winnerId);
      }

      setIsProcessing(false);
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
    battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
  const opponentPlayerState =
    battleState.player1Id === playerId ? battleState.player2 : battleState.player1;

  const myPendingAction = battleState.pendingActions?.[playerId];
  const canAct =
    !battleEnded &&
    !isProcessing &&
    !myPendingAction &&
    battleState.turnPhase === 'SUBMISSION';

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
    popupOpacity,
    myPlayerState,
    opponentPlayerState,
    myPendingAction,
    canAct,
    sendAction,
    selectInitialCoffeemon,
  };
}
