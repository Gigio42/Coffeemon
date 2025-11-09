import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlayerState, BattlePhase } from '../../../types';
import { styles } from './styles';

interface BattleActionsProps {
  playerState: PlayerState | null;
  isMyTurn: boolean;
  battlePhase: BattlePhase;
  onAttack: (moveIndex: number) => void;
  onSwitch: (index: number) => void;
}

export default function BattleActions({
  playerState,
  isMyTurn,
  battlePhase,
  onAttack,
  onSwitch,
}: BattleActionsProps) {
  if (!playerState || playerState.activeCoffeemonIndex === null) {
    return null;
  }

  const activeMon = playerState.coffeemons[playerState.activeCoffeemonIndex];
  const canAct = isMyTurn && battlePhase === 'awaiting_action';

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.buttonGrid}>
        {activeMon.moves.map((move, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.attackButton,
              !canAct && styles.attackButtonDisabled,
            ]}
            onPress={() => onAttack(index)}
            disabled={!canAct}
          >
            <Text style={[
              styles.attackButtonText,
              !canAct && styles.attackButtonTextDisabled,
            ]}>
              {move.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonGrid}>
        {playerState.coffeemons.map((mon, index) => {
          if (index === playerState.activeCoffeemonIndex) return null;
          const isFainted = mon.currentHp <= 0;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.switchButton,
                isFainted && styles.faintedButton,
              ]}
              onPress={() => onSwitch(index)}
              disabled={!canAct || isFainted}
            >
              <Text style={[
                styles.switchButtonText,
                isFainted && styles.faintedText,
              ]}>
                {mon.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
