import { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay } from 'react-native-reanimated';

export function useBattleAnimations() {
  const playerPosition = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
  };
  const opponentPosition = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
  };
  const arenaShake = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
  };

  const playerAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: playerPosition.translateX.value },
      { translateY: playerPosition.translateY.value },
    ],
    opacity: playerPosition.opacity.value,
  }));

  const opponentAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: opponentPosition.translateX.value },
      { translateY: opponentPosition.translateY.value },
    ],
    opacity: opponentPosition.opacity.value,
  }));

  const arenaWobble = useAnimatedStyle(() => ({
    transform: [
      { translateX: arenaShake.translateX.value },
      { translateY: arenaShake.translateY.value },
    ],
  }));

  const playLunge = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    const distance = isPlayer ? 40 : -40;
    return new Promise((resolve) => {
      anim.translateX.value = withSequence(
        withTiming(distance, { duration: 150 }),
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) resolve(true);
        })
      );
    });
  };

  const playShake = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    return new Promise((resolve) => {
      anim.translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 }, (finished) => {
          if (finished) resolve(true);
        })
      );
    });
  };

  const playCritShake = () => {
    return new Promise((resolve) => {
      arenaShake.translateX.value = withSequence(
        withTiming(-15, { duration: 60 }),
        withTiming(15, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(0, { duration: 60 }, (finished) => {
          if (finished) resolve(true);
        })
      );
    });
  };

  const playFaint = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    return new Promise((resolve) => {
      anim.translateY.value = withTiming(50, { duration: 500 });
      anim.opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) resolve(true);
      });
    });
  };

  const playSwitchIn = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    anim.translateY.value = 0;
    anim.opacity.value = 0;
    return new Promise((resolve) => {
      anim.opacity.value = withTiming(1, { duration: 300 }, (finished) => {
        if (finished) resolve(true);
      });
    });
  };

  const reset = () => {
    playerPosition.translateX.value = 0;
    playerPosition.translateY.value = 0;
    playerPosition.opacity.value = 1;
    opponentPosition.translateX.value = 0;
    opponentPosition.translateY.value = 0;
    opponentPosition.opacity.value = 1;
  };

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
