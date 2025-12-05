import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface BattleEndOverlayProps {
  winnerId: number;
  playerId: number;
  onReturnToMatchmaking: () => void;
}

export default function BattleEndOverlay({
  winnerId,
  playerId,
  onReturnToMatchmaking,
}: BattleEndOverlayProps) {
  const isWinner = winnerId === playerId;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {isWinner ? "🏆 VITÓRIA! 🏆" : "💔 DERROTA 💔"}
        </Text>
        <Text style={styles.winner}>
          {isWinner ? "VOCÊ VENCEU!" : "Oponente Venceu"}
        </Text>
        <Text style={styles.subtext}>Voltando ao matchmaking...</Text>
        <TouchableOpacity style={styles.button} onPress={onReturnToMatchmaking}>
          <Text style={styles.buttonText}>VOLTAR AGORA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
