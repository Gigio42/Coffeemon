import { useCallback } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring, Easing, cancelAnimation, withDelay } from 'react-native-reanimated';

/**
 * useBattleAnimations - Hook otimizado para animações de batalha
 * Usa react-native-reanimated para animações fluidas e performáticas
 * 
 * IMPORTANTE: Todas as animações resetam os valores ao finalizar para evitar bugs visuais
 */
export function useBattleAnimations() {
  // Shared values para animações do player
  const playerTranslateX = useSharedValue(0);
  const playerTranslateY = useSharedValue(0);
  const playerOpacity = useSharedValue(1);
  const playerScale = useSharedValue(1);
  const playerFlash = useSharedValue(0); // Para efeito de flash branco

  // Shared values para animações do oponente
  const opponentTranslateX = useSharedValue(0);
  const opponentTranslateY = useSharedValue(0);
  const opponentOpacity = useSharedValue(1);
  const opponentScale = useSharedValue(1);
  const opponentFlash = useSharedValue(0); // Para efeito de flash branco

  // Shared value para wobble da arena (quando crit)
  const arenaRotation = useSharedValue(0);

  // Estilos animados
  const playerAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: playerTranslateX.value },
        { translateY: playerTranslateY.value },
        { scale: playerScale.value },
      ],
      opacity: playerOpacity.value,
    };
  });

  const opponentAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: opponentTranslateX.value },
        { translateY: opponentTranslateY.value },
        { scale: opponentScale.value },
      ],
      opacity: opponentOpacity.value,
    };
  });

  const arenaWobble = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${arenaRotation.value}deg` }],
    };
  });

  // Animação de ataque (lunge) - coffeemon avança
  const playLunge = useCallback((isPlayer: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log(`🎬 LUNGE ${isPlayer ? 'PLAYER' : 'OPPONENT'}`);
      
      if (isPlayer) {
        // Cancelar animações anteriores
        cancelAnimation(playerTranslateX);
        cancelAnimation(playerScale);
        
        // Resetar valores antes de animar
        playerTranslateX.value = 0;
        playerScale.value = 1;
        
        // Animar
        playerTranslateX.value = withSequence(
          withTiming(80, { duration: 250, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) })
        );
        playerScale.value = withSequence(
          withTiming(1.15, { duration: 250 }),
          withTiming(1, { duration: 200 })
        );
      } else {
        // Cancelar animações anteriores
        cancelAnimation(opponentTranslateX);
        cancelAnimation(opponentScale);
        
        // Resetar valores antes de animar
        opponentTranslateX.value = 0;
        opponentScale.value = 1;
        
        // Animar
        opponentTranslateX.value = withSequence(
          withTiming(-80, { duration: 250, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) })
        );
        opponentScale.value = withSequence(
          withTiming(1.15, { duration: 250 }),
          withTiming(1, { duration: 200 })
        );
      }
      
      setTimeout(() => resolve(true), 450);
    });
  }, []);

  // Animação de shake - quando recebe dano
  const playShake = useCallback((isPlayer: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log(`💥 SHAKE ${isPlayer ? 'PLAYER' : 'OPPONENT'}`);
      
      if (isPlayer) {
        cancelAnimation(playerTranslateX);
        playerTranslateX.value = 0;
        
        playerTranslateX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      } else {
        cancelAnimation(opponentTranslateX);
        opponentTranslateX.value = 0;
        
        opponentTranslateX.value = withSequence(
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      }
      
      setTimeout(() => resolve(true), 250);
    });
  }, []);

  // Animação de critical shake - shake mais intenso + wobble da arena
  const playCritShake = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('⚡ CRIT SHAKE');
      
      // Shake do oponente (sempre recebe o crit)
      cancelAnimation(opponentTranslateX);
      cancelAnimation(arenaRotation);
      
      opponentTranslateX.value = 0;
      arenaRotation.value = 0;
      
      opponentTranslateX.value = withSequence(
        withTiming(15, { duration: 40 }),
        withTiming(-15, { duration: 40 }),
        withTiming(15, { duration: 40 }),
        withTiming(-15, { duration: 40 }),
        withTiming(15, { duration: 40 }),
        withTiming(-15, { duration: 40 }),
        withTiming(0, { duration: 40 })
      );
      
      // Wobble da arena inteira
      arenaRotation.value = withSequence(
        withTiming(-2, { duration: 40 }),
        withTiming(2, { duration: 40 }),
        withTiming(-2, { duration: 40 }),
        withTiming(2, { duration: 40 }),
        withTiming(0, { duration: 80 })
      );
      
      setTimeout(() => resolve(true), 320);
    });
  }, []);

  // Animação de faint - coffeemon desmaia (NÃO MEXE EM OPACITY - só pisca e desce)
  const playFaint = useCallback((isPlayer: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log(`😵 FAINT ${isPlayer ? 'PLAYER' : 'OPPONENT'}`);
      
      if (isPlayer) {
        cancelAnimation(playerTranslateY);
        cancelAnimation(playerScale);
        
        // Resetar valores
        playerTranslateY.value = 0;
        playerScale.value = 1;
        
        // Apenas descer um pouco + pequeno shrink
        playerTranslateY.value = withTiming(15, { 
          duration: 600, 
          easing: Easing.out(Easing.quad) 
        });
        playerScale.value = withSequence(
          withTiming(0.95, { duration: 300 }),
          withTiming(0.9, { duration: 300 })
        );
      } else {
        cancelAnimation(opponentTranslateY);
        cancelAnimation(opponentScale);
        
        // Resetar valores
        opponentTranslateY.value = 0;
        opponentScale.value = 1;
        
        // Apenas descer um pouco + pequeno shrink
        opponentTranslateY.value = withTiming(15, { 
          duration: 600, 
          easing: Easing.out(Easing.quad) 
        });
        opponentScale.value = withSequence(
          withTiming(0.95, { duration: 300 }),
          withTiming(0.9, { duration: 300 })
        );
      }
      
      setTimeout(() => resolve(true), 600);
    });
  }, []);

  // Animação de switch in - coffeemon entra em campo com efeito dramático
  const playSwitchIn = useCallback((isPlayer: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log(`🔄 SWITCH IN ${isPlayer ? 'PLAYER' : 'OPPONENT'}`);
      
      if (isPlayer) {
        cancelAnimation(playerOpacity);
        cancelAnimation(playerScale);
        cancelAnimation(playerTranslateY);
        
        // Começar fora da tela (acima) e invisível
        playerTranslateY.value = -60;
        playerOpacity.value = 0;
        playerScale.value = 0.3;
        
        // Animar entrada dramática com bounce
        playerTranslateY.value = withSequence(
          withTiming(-10, { duration: 300, easing: Easing.out(Easing.quad) }),
          withSpring(0, { damping: 8, stiffness: 150 })
        );
        playerOpacity.value = withTiming(1, { duration: 400 });
        playerScale.value = withSequence(
          withTiming(1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
          withSpring(1, { damping: 10, stiffness: 100 })
        );
      } else {
        cancelAnimation(opponentOpacity);
        cancelAnimation(opponentScale);
        cancelAnimation(opponentTranslateY);
        
        // Começar fora da tela (acima) e invisível
        opponentTranslateY.value = -60;
        opponentOpacity.value = 0;
        opponentScale.value = 0.3;
        
        // Animar entrada dramática com bounce
        opponentTranslateY.value = withSequence(
          withTiming(-10, { duration: 300, easing: Easing.out(Easing.quad) }),
          withSpring(0, { damping: 8, stiffness: 150 })
        );
        opponentOpacity.value = withTiming(1, { duration: 400 });
        opponentScale.value = withSequence(
          withTiming(1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
          withSpring(1, { damping: 10, stiffness: 100 })
        );
      }
      
      setTimeout(() => resolve(true), 600);
    });
  }, []);

  // Reset COMPLETO de todas as animações
  const reset = useCallback(() => {
    console.log('🔄 RESET ALL');
    
    // Cancelar todas as animações em progresso
    cancelAnimation(playerTranslateX);
    cancelAnimation(playerTranslateY);
    cancelAnimation(playerOpacity);
    cancelAnimation(playerScale);
    cancelAnimation(opponentTranslateX);
    cancelAnimation(opponentTranslateY);
    cancelAnimation(opponentOpacity);
    cancelAnimation(opponentScale);
    cancelAnimation(arenaRotation);
    
    // Resetar para valores padrão
    playerTranslateX.value = withTiming(0, { duration: 200 });
    playerTranslateY.value = withTiming(0, { duration: 200 });
    playerOpacity.value = withTiming(1, { duration: 200 });
    playerScale.value = withTiming(1, { duration: 200 });
    
    opponentTranslateX.value = withTiming(0, { duration: 200 });
    opponentTranslateY.value = withTiming(0, { duration: 200 });
    opponentOpacity.value = withTiming(1, { duration: 200 });
    opponentScale.value = withTiming(1, { duration: 200 });
    
    arenaRotation.value = withTiming(0, { duration: 200 });
  }, []);

  return {
    playerAnimStyle,
    opponentAnimStyle,
    arenaWobble,
    playLunge,
    playShake,
    playCritShake,
    playFaint,
    playSwitchIn,
    reset,
  };
}

