import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { BattleState, BattleStatus } from "../types";
import { CoffeemonVariant } from "../../assets/coffeemons";
import { deriveSpriteState, SpriteStateResult } from "../utils/spriteStateMachine";
import { getBaseName } from "../utils/battleUtils";
import { useBattleDamage } from "./useBattleDamage";
import { useBattleLog } from "./useBattleLog";
import { useBattleEventProcessor } from "./useBattleEventProcessor";

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

export function useBattle({
  battleId,
  initialBattleState,
  playerId,
  socket,
  onNavigateToMatchmaking,
  animationHandlers,
}: UseBattleProps) {
  // Extract and initialize battle state
  const extractedBattleState = initialBattleState?.battleState || {
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

  const [battleState, setBattleState] = useState<BattleState>(extractedBattleState);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBattleReady, setIsBattleReady] = useState(false);

  const battleStateRef = useRef<BattleState>(battleState);

  // Use modular hooks
  const { log, addLog } = useBattleLog();
  const { playerDamage, opponentDamage, recentDamageMap, applyDamage, cleanup: cleanupDamage } = useBattleDamage();
  const { processEventSequence } = useBattleEventProcessor(playerId, animationHandlers, applyDamage, addLog);

  // Update ref when state changes
  useEffect(() => {
    battleStateRef.current = battleState;
  }, [battleState]);

  // Battle end handler
  const handleBattleEnd = useCallback((winnerIdParam: number) => {
    if (battleEnded || battleStateRef.current.battleStatus === BattleStatus.FINISHED) {
      return;
    }

    setBattleEnded(true);
    setWinnerId(winnerIdParam);
    addLog(`A batalha terminou! Vencedor: Jogador ${winnerIdParam}`);

    setTimeout(() => {
      onNavigateToMatchmaking();
    }, 4000);
  }, [battleEnded, addLog, onNavigateToMatchmaking]);

  // Setup socket events
  useEffect(() => {
    const handleBattleUpdate = (newBattleState: BattleState) => {
      console.log('[Battle] Received battle update');

      requestAnimationFrame(() => {
        try {
          setIsProcessing(true);

          const isStateValid = newBattleState?.player1 && newBattleState?.player2;
          if (!isBattleReady && isStateValid) {
            console.log('[Battle] Setting battle as ready');
            setIsBattleReady(true);
          }

          setBattleState(newBattleState);

          if (newBattleState.events && newBattleState.events.length > 0) {
            processEventSequence(newBattleState.events, newBattleState).finally(() => {
              setIsProcessing(false);
            });
          } else {
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('[Battle] Error processing update:', error);
          setIsProcessing(false);
        }
      });
    };

    const handleError = (error: any) => {
      console.error('[Battle] Socket error:', error);
    };

    socket.on('battleUpdate', handleBattleUpdate);
    socket.on('battleEnd', handleBattleEnd);
    socket.on('battleError', handleError);
    socket.on('connect_error', handleError);

    // Join battle
    socket.emit('joinBattle', { battleId });

    // Check for initial selection
    if (extractedBattleState.turnPhase === 'SELECTION') {
      const myState = extractedBattleState.player1Id === playerId
        ? extractedBattleState.player1
        : extractedBattleState.player2;
      if (myState && !myState.hasSelectedCoffeemon) {
        setShowSelectionModal(true);
      }
    }

    // Cleanup
    return () => {
      socket.off('battleUpdate', handleBattleUpdate);
      socket.off('battleEnd', handleBattleEnd);
      socket.off('battleError', handleError);
      socket.off('connect_error', handleError);
      cleanupDamage();
    };
  }, [battleId, playerId, socket, isBattleReady, processEventSequence, handleBattleEnd, cleanupDamage, extractedBattleState]);

  // Actions
  const sendAction = useCallback((actionType: string, payload: any) => {
    socket.emit('battleAction', { battleId, actionType, payload });
  }, [battleId, socket]);

  const selectInitialCoffeemon = useCallback((coffeemonIndex: number) => {
    socket.emit('selectInitialCoffeemon', { battleId, coffeemonIndex });
    setShowSelectionModal(false);
  }, [battleId, socket]);

  // Derived state
  const myPlayerState = battleState?.player1Id === playerId ? battleState?.player1 : battleState?.player2;
  const opponentPlayerState = battleState?.player1Id === playerId ? battleState?.player2 : battleState?.player1;
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
    (!hasPendingEvents || isSubmissionPhase) &&
    (isSubmissionPhase ||
      isSelectingInitialCoffeemon ||
      battleState?.currentPlayerId === playerId ||
      (bothPlayersSelected && hasActiveCoffeemon));

  // Sprite variant resolver
  const resolveSpriteVariant = useCallback(
    (coffeemonName: string, baseVariant: CoffeemonVariant, statusEffects?: any[]): SpriteStateResult => {
      const baseName = getBaseName(coffeemonName).toLowerCase();
      const context = {
        statusEffects,
        recentlyDamaged: recentDamageMap[baseName] ?? false,
      };
      return deriveSpriteState(context, baseVariant);
    },
    [recentDamageMap]
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
  };
}
