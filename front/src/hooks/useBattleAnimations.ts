/**
 * useBattleAnimations - Versão sem animações
 * Retorna funções vazias para manter compatibilidade com o código existente
 */
export function useBattleAnimations() {
  // Funções de animação vazias (não fazem nada)
  const playLunge = (isPlayer: boolean) => Promise.resolve(true);
  const playShake = (isPlayer: boolean) => Promise.resolve(true);
  const playCritShake = () => Promise.resolve(true);
  const playFaint = (isPlayer: boolean) => Promise.resolve(true);
  const playSwitchIn = (isPlayer: boolean) => Promise.resolve(true);
  const reset = () => {};

  return {
    playerAnimStyle: {},
    opponentAnimStyle: {},
    arenaWobble: {},
    playLunge,
    playShake,
    playCritShake,
    playFaint,
    playSwitchIn,
    reset,
  };
}

