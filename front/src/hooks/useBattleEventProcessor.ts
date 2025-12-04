import { useCallback } from "react";
import { BattleState, BattleStatus } from "../types";
import { getEventMessage } from "../utils/battleMessages";

interface BattleEvent {
  type: string;
  message: string;
  payload?: any;
}

interface AnimationHandlers {
  playLunge: (isPlayer: boolean) => Promise<unknown>;
  playShake: (isPlayer: boolean) => Promise<unknown>;
  playCritShake: () => Promise<unknown>;
  playFaint: (isPlayer: boolean) => Promise<unknown>;
  playSwitchIn: (isPlayer: boolean) => Promise<unknown>;
  reset: () => void;
}

export function useBattleEventProcessor(
  playerId: number,
  animationHandlers: AnimationHandlers,
  applyDamage: (isPlayerTakingDamage: boolean, damage: number, damagedMonName?: string | null) => void,
  addLog: (msg: string) => void
) {
  const playAnimationForEvent = useCallback(async (event: BattleEvent, fullState: BattleState) => {
    const payload = event.payload || {};

    if (event.type === "attack") {
      const attackerId = payload.attackerId;
      const isPlayer = attackerId === playerId;

      await animationHandlers.playLunge(isPlayer);
      await animationHandlers.playShake(!isPlayer);
    } else if (event.type === "critical") {
      await animationHandlers.playCritShake();
    } else if (event.type === "faint") {
      const faintedMonOwnerId = payload.playerId;
      const isPlayerFainted = faintedMonOwnerId === playerId;

      await animationHandlers.playFaint(isPlayerFainted);
    } else if (event.type === "switch") {
      const switchingPlayerId = payload.playerId;
      const isPlayerSwitching = switchingPlayerId === playerId;

      await animationHandlers.playSwitchIn(isPlayerSwitching);
    }
  }, [playerId, animationHandlers]);

  const processEventSequence = useCallback(async (events: BattleEvent[], fullState: BattleState) => {
    for (const event of events) {
      try {
        const displayMessage = getEventMessage(event);
        addLog(displayMessage);

        await playAnimationForEvent(event, fullState);

        // Processar dano
        if (event.type === "attack" || event.type === "damage") {
          const payload = event.payload || {};
          let isPlayerTakingDamage = false;
          let damagedMonName: string | null = null;

          if (payload.playerId !== undefined) {
            isPlayerTakingDamage = payload.playerId !== playerId;
            damagedMonName = payload.targetName ?? null;
          } else if (payload.targetName) {
            const myPlayerState =
              fullState.player1Id === playerId ? fullState.player1 : fullState.player2;
            const activeMonName =
              myPlayerState && myPlayerState.activeCoffeemonIndex !== null
                ? myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex].name
                : '';
            const targetIsPlayer = payload.targetName === activeMonName;
            isPlayerTakingDamage = targetIsPlayer;
            damagedMonName = payload.targetName;
          } else if (payload.coffeemonName) {
            damagedMonName = payload.coffeemonName;
          }

          if (payload.damage) {
            applyDamage(isPlayerTakingDamage, payload.damage, damagedMonName);
          }
        }
      } catch (error) {
        console.error('Error processing event:', event, error);
      }
    }
  }, [playerId, playAnimationForEvent, applyDamage, addLog]);

  return {
    processEventSequence,
  };
}
