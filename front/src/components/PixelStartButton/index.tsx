import React from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { styles } from './styles';

type PixelStartButtonProps = {
  label?: string;
  subtitle?: string;
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const ANIMATION_IN_DURATION = 90;
const ANIMATION_BOUNCE_UP_DURATION = 120;
const ANIMATION_BOUNCE_DOWN_DURATION = 140;
const PRESSED_SCALE = 0.95;
const BOUNCE_SCALE = 1.05;

export default function PixelStartButton({
  label = 'INICIAR',
  subtitle,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: PixelStartButtonProps) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = React.useState(false);

  const animateTo = React.useCallback(
    (toValue: number, duration: number) => {
      scale.stopAnimation();
      Animated.timing(scale, {
        toValue,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    [scale]
  );

  const handlePressIn = React.useCallback(() => {
    if (disabled) {
      return;
    }

    setPressed(true);
    animateTo(PRESSED_SCALE, ANIMATION_IN_DURATION);
  }, [animateTo, disabled]);

  const handlePressOut = React.useCallback(() => {
    if (disabled) {
      setPressed(false);
      animateTo(1, ANIMATION_BOUNCE_DOWN_DURATION);
      return;
    }

    setPressed(false);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: BOUNCE_SCALE,
        duration: ANIMATION_BOUNCE_UP_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIMATION_BOUNCE_DOWN_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animateTo, disabled, scale]);

  const handlePress = React.useCallback(() => {
    if (disabled) {
      return;
    }
    onPress();
  }, [disabled, onPress]);

  const combinedButtonStyle = React.useMemo(
    () => [
      styles.button,
      pressed ? styles.buttonPressed : undefined,
      disabled ? styles.buttonDisabled : undefined,
      { transform: [{ scale }] },
    ],
    [disabled, pressed, scale]
  );

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableWithoutFeedback
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
      >
        <Animated.View style={combinedButtonStyle}>
          <View
            style={[
              styles.shine,
              pressed ? styles.shinePressed : undefined,
            ]}
          />
          <View
            style={[
              styles.shade,
              pressed ? styles.shadePressed : undefined,
            ]}
          />
          <View
            style={[
              styles.inset,
              pressed ? styles.insetPressed : undefined,
            ]}
          />

          <View
            style={[
              styles.pixel,
              styles.pixelTopLeft,
              pressed ? styles.pixelPressed : undefined,
            ]}
          />
          <View
            style={[
              styles.pixel,
              styles.pixelTopRight,
              pressed ? styles.pixelPressed : undefined,
            ]}
          />
          <View
            style={[
              styles.pixel,
              styles.pixelBottomLeft,
              pressed ? styles.pixelPressed : undefined,
            ]}
          />
          <View
            style={[
              styles.pixel,
              styles.pixelBottomRight,
              pressed ? styles.pixelPressed : undefined,
            ]}
          />

          <Text
            style={[
              styles.label,
              pressed ? styles.labelPressed : undefined,
            ]}
          >
            {label}
          </Text>

          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                pressed ? styles.subtitlePressed : undefined,
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}
