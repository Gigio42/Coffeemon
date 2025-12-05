import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Move } from "../../../types";
import { styles } from "./styles";

interface AttackActionsProps {
  moves: Move[];
  onSelectMove: (moveIndex: number) => void;
  onBack: () => void;
  canUseMove: (move: Move) => { valid: boolean; reason?: string };
  disabled?: boolean;
}

const getCategoryEmoji = (category: string) => {
  switch (category?.toLowerCase()) {
    case "físico":
    case "physical":
      return "⚔️";
    case "especial":
    case "special":
      return "✨";
    case "estado":
    case "status":
      return "🔮";
    default:
      return "❓";
  }
};

const getTypeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    roasted: "#8B4513",
    sweet: "#FFB6C1",
    bitter: "#2C1810",
    creamy: "#F5DEB3",
    fruity: "#FF6B9D",
    herbal: "#90EE90",
    spicy: "#FF4500",
    nutty: "#D2691E",
  };
  return typeColors[type?.toLowerCase()] || "#777";
};

export default function AttackActions({
  moves,
  onSelectMove,
  onBack,
  canUseMove,
  disabled = false,
}: AttackActionsProps) {
  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.attackScrollView}
        contentContainerStyle={styles.attackScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {moves.map((move, index) => {
          const validation = canUseMove(move);
          const typeColor = getTypeColor(move.type);
          const categoryEmoji = getCategoryEmoji(move.category);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.attackButton,
                { borderLeftColor: typeColor, borderLeftWidth: 4 },
                (!validation.valid || disabled) && styles.disabledAttackButton,
              ]}
              onPress={() => onSelectMove(index)}
              disabled={!validation.valid || disabled}
            >
              <View style={styles.attackButtonHeader}>
                <Text style={styles.attackButtonName}>
                  {categoryEmoji} {move.name}
                </Text>
                <Text style={styles.attackButtonPower}>
                  {move.power ? `⚡${move.power}` : "—"}
                </Text>
              </View>

              <View style={styles.attackButtonDetails}>
                <Text style={styles.attackButtonType}>{move.type}</Text>
                <Text style={styles.attackButtonPP}>
                  PP: {move.currentPP ?? move.pp}/{move.pp}
                </Text>
              </View>

              {!validation.valid && validation.reason && (
                <Text style={styles.attackButtonDisabledText}>
                  {validation.reason}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
