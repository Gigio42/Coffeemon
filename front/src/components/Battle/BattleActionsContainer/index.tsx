import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getBattleIcon } from "../../../../assets/iconsv2";
import { Move } from "../../../types";
import {
  canUseAttackButton,
  canUseItemButton,
  canUseSwitchButton,
  getBattleStatusText,
} from "../../Battle/battleHelpers";
import { AttackActions, ItemActions, MainActions } from "../BattleActions";
import { styles } from "./styles";

interface BattleActionsContainerProps {
  actionMode: "main" | "attack" | "item";
  setActionMode: (mode: "main" | "attack" | "item") => void;
  
  // Estado de batalha
  canAct: boolean;
  myPendingAction: any;
  battleEnded: boolean;
  isProcessing: boolean;
  turnPhase: string;
  needsSwitch: boolean;
  hasSwitchCandidate: boolean;
  hasSelectedCoffeemon: boolean;
  opponentHasSelectedCoffeemon: boolean;
  isMyTurn: boolean;
  
  // Ações
  onAttack: (moveIndex: number) => void;
  onSwitch: () => void;
  onItem: (item: any) => void;
  onFlee: () => void;
  
  // Dados
  moves: Move[];
  items: any[];
  playerItems: Map<number, number>;
  canUseMove: (move: Move) => { valid: boolean; reason?: string };
  isSwitchModalVisible: boolean;
}

export default function BattleActionsContainer({
  actionMode,
  setActionMode,
  canAct,
  myPendingAction,
  battleEnded,
  isProcessing,
  turnPhase,
  needsSwitch,
  hasSwitchCandidate,
  hasSelectedCoffeemon,
  opponentHasSelectedCoffeemon,
  isMyTurn,
  onAttack,
  onSwitch,
  onItem,
  onFlee,
  moves,
  items,
  playerItems,
  canUseMove,
  isSwitchModalVisible,
}: BattleActionsContainerProps) {
  const statusText = getBattleStatusText({
    battleEnded,
    isProcessing,
    myPendingAction,
    turnPhase,
    needsSwitch,
    canAct,
    actionMode,
    isSwitchModalVisible,
    hasSelectedCoffeemon,
    opponentHasSelectedCoffeemon,
    isMyTurn,
  });

  const canAttack = canUseAttackButton({ canAct, myPendingAction, needsSwitch });
  const canSwitch = canUseSwitchButton({
    hasSwitchCandidate,
    isProcessing,
    myPendingAction,
    turnPhase,
    canAct,
  });
  const canUseItem = canUseItemButton({
    canAct,
    myPendingAction,
    hasItems: items.length > 0,
  });

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {actionMode === "main" && (
        <MainActions
          onAttack={() => setActionMode("attack")}
          onSwitch={onSwitch}
          onItem={() => setActionMode("item")}
          canAttack={canAttack}
          canSwitch={canSwitch}
          canUseItem={canUseItem}
          disabled={battleEnded}
        />
      )}

      {actionMode === "attack" && (
        <AttackActions
          moves={moves}
          onSelectMove={(index) => {
            onAttack(index);
            setActionMode("main");
          }}
          onBack={() => setActionMode("main")}
          canUseMove={canUseMove}
          disabled={!canAct}
        />
      )}

      {actionMode === "item" && (
        <ItemActions
          items={items}
          playerItems={playerItems}
          onSelectItem={(item) => {
            onItem(item);
            setActionMode("main");
          }}
          onBack={() => setActionMode("main")}
          disabled={!canAct}
        />
      )}

      <TouchableOpacity
        style={[styles.fleeButton, battleEnded && styles.fleeButtonDisabled]}
        onPress={onFlee}
        disabled={battleEnded}
      >
        <Text style={styles.fleeButtonText}>🏃 FUGIR</Text>
      </TouchableOpacity>
    </View>
  );
}
