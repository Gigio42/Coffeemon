import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { styles } from './styles';

const AnimatedView = Animated.createAnimatedComponent(View);

interface AnimatedHealthBarProps {
  currentHp: number;
  maxHp: number;
}

const AnimatedHealthBar = React.memo(({ currentHp, maxHp }: AnimatedHealthBarProps) => {
  const hp = useSharedValue(currentHp);
  const hpPercent = useSharedValue((currentHp / maxHp) * 100);

  useEffect(() => {
    hp.value = withTiming(currentHp, { duration: 400 });
    hpPercent.value = withTiming(maxHp > 0 ? (currentHp / maxHp) * 100 : 0, {
      duration: 400,
    });
  }, [currentHp, maxHp]);

  const animatedHpBar = useAnimatedStyle(() => {
    const width = Math.max(0, hpPercent.value);
    const color = interpolateColor(
      width,
      [0, 20, 50, 100],
      ['#e74c3c', '#e74c3c', '#f1c40f', '#2ecc71']
    );
    return {
      width: `${width}%`,
      backgroundColor: color,
    };
  });

  return (
    <View style={styles.hudHpBarContainer}>
      <View style={styles.hudHpBarBackground}>
        <AnimatedView style={[styles.hudHpBarFill, animatedHpBar]} />
      </View>
      <Text style={styles.hudHpText}>
        {Math.floor(hp.value)}/{maxHp}
      </Text>
    </View>
  );
});

export default AnimatedHealthBar;
