import React from 'react';
import { View, Text } from 'react-native';
import { PlayerState } from '../../../types';
import AnimatedHealthBar from '../AnimatedHealthBar';
import { styles } from './styles';

interface BattleHUDProps {
  playerState: PlayerState | null;
  isMe: boolean;
}

export default function BattleHUD({ playerState, isMe }: BattleHUDProps) {
  const activeMon =
    playerState && playerState.activeCoffeemonIndex !== null
      ? playerState.coffeemons[playerState.activeCoffeemonIndex]
      : null;

  const containerStyle = isMe ? styles.playerHudContainer : styles.opponentHudContainer;

  if (!activeMon) {
    return <View style={[styles.hudInfoBox, containerStyle, { opacity: 0 }]} />;
  }

  return (
    <View style={[styles.hudInfoBox, containerStyle]}>
      <Text style={styles.hudName}>{activeMon.name}</Text>
      <AnimatedHealthBar currentHp={activeMon.currentHp} maxHp={activeMon.maxHp} />
    </View>
  );
}
