import { useCallback, useRef, useState } from "react";
import { getBaseName } from "../utils/battleUtils";

const RECENT_DAMAGE_DURATION_MS = 1200;

export function useBattleDamage() {
  const [playerDamage, setPlayerDamage] = useState<number | null>(null);
  const [opponentDamage, setOpponentDamage] = useState<number | null>(null);
  const [recentDamageMap, setRecentDamageMap] = useState<Record<string, boolean>>({});
  const recentDamageTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const applyDamage = useCallback((
    isPlayerTakingDamage: boolean,
    damage: number,
    damagedMonName?: string | null
  ) => {
    if (isPlayerTakingDamage) {
      setPlayerDamage(damage);
    } else {
      setOpponentDamage(damage);
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
  }, []);

  const cleanup = useCallback(() => {
    Object.values(recentDamageTimeoutsRef.current).forEach((timeout) => {
      clearTimeout(timeout);
    });
    recentDamageTimeoutsRef.current = {};
  }, []);

  return {
    playerDamage,
    opponentDamage,
    recentDamageMap,
    applyDamage,
    cleanup,
  };
}
