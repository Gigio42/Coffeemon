import React from "react";
import { Animated, Image, View } from "react-native";
import { styles } from "./styles";

interface BattleSpriteProps {
  imageSource: any;
  isPlayer: boolean;
  animStyle: any;
  uniqueKey: string;
}

export default function BattleSprite({
  imageSource,
  isPlayer,
  animStyle,
  uniqueKey,
}: BattleSpriteProps) {
  return (
    <Animated.View
      key={uniqueKey}
      style={[
        styles.spriteContainer,
        isPlayer ? styles.playerSprite : styles.opponentSprite,
        animStyle,
      ]}
    >
      <Image
        source={imageSource}
        style={[
          styles.spriteImage,
          isPlayer && styles.playerSpriteImage,
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
