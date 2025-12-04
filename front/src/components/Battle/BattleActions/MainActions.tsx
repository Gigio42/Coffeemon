import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getBattleIcon } from "../../../../assets/iconsv2";
import { styles } from "./styles";

interface MainActionsProps {
  onAttack: () => void;
  onSwitch: () => void;
  onItem: () => void;
  canAttack: boolean;
  canSwitch: boolean;
  canUseItem: boolean;
  disabled?: boolean;
}

export default function MainActions({
  onAttack,
  onSwitch,
  onItem,
  canAttack,
  canSwitch,
  canUseItem,
  disabled = false,
}: MainActionsProps) {
  const attackIcon = getBattleIcon("sword");
  const switchIcon = getBattleIcon("switch");
  const itemIcon = getBattleIcon("backpack");

  return (
    <View style={styles.mainActionsContainer}>
      <TouchableOpacity
        style={[
          styles.mainActionButton,
          (!canAttack || disabled) && styles.disabledButton,
        ]}
        onPress={onAttack}
        disabled={!canAttack || disabled}
      >
        <View style={styles.actionIconContainer}>
          {attackIcon}
        </View>
        <Text style={styles.mainActionButtonText}>ATACAR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.mainActionButton,
          (!canSwitch || disabled) && styles.disabledButton,
        ]}
        onPress={onSwitch}
        disabled={!canSwitch || disabled}
      >
        <View style={styles.actionIconContainer}>
          {switchIcon}
        </View>
        <Text style={styles.mainActionButtonText}>TROCAR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.mainActionButton,
          (!canUseItem || disabled) && styles.disabledButton,
        ]}
        onPress={onItem}
        disabled={!canUseItem || disabled}
      >
        <View style={styles.actionIconContainer}>
          {itemIcon}
        </View>
        <Text style={styles.mainActionButtonText}>ITEM</Text>
      </TouchableOpacity>
    </View>
  );
}
