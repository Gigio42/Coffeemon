import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

export interface BattleReward {
  playerId: number;
  playerLevelUp?: {
    newLevel: number;
  };
  coffeemonRewards: {
    playerCoffeemonId: number;
    coffeemonName: string;
    levelUp?: {
      newLevel: number;
      expGained: number;
    };
    learnedMoves: string[];
  }[];
  coins: number;
  totalExp: number;
}

interface VictoryModalProps {
  visible: boolean;
  isVictory: boolean;
  playerId: number;
  winnerId: number;
  rewards: BattleReward | null;
  onClose: () => void;
}

export default function VictoryModal({
  visible,
  isVictory,
  playerId,
  winnerId,
  rewards,
  onClose,
}: VictoryModalProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  const hasPlayerLevelUp = rewards?.playerLevelUp !== undefined;
  const hasAnyCoffeemonLevelUp = rewards?.coffeemonRewards.some(
    (r) => r.levelUp !== undefined
  );
  const hasAnyLearnedMoves = rewards?.coffeemonRewards.some(
    (r) => r.learnedMoves.length > 0
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={
              isVictory
                ? ["#FFD700", "#FFA500", "#FF8C00"]
                : ["#555555", "#777777", "#999999"]
            }
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.emoji}>{isVictory ? "🏆" : "😔"}</Text>
              <Text style={styles.title}>
                {isVictory ? "VITÓRIA!" : "DERROTA"}
              </Text>
              <Text style={styles.subtitle}>
                {isVictory
                  ? "Você venceu a batalha!"
                  : "Você perdeu a batalha..."}
              </Text>
            </View>

            {/* Rewards Section */}
            {rewards && (
              <ScrollView style={styles.scrollView}>
                <View style={styles.rewardsContainer}>
                  {/* Moedas e XP */}
                  <View style={styles.rewardSection}>
                    <Text style={styles.sectionTitle}>Recompensas</Text>
                    <View style={styles.rewardRow}>
                      <Text style={styles.rewardIcon}>💰</Text>
                      <Text style={styles.rewardText}>
                        +{rewards.coins} Moedas
                      </Text>
                    </View>
                    <View style={styles.rewardRow}>
                      <Text style={styles.rewardIcon}>⭐</Text>
                      <Text style={styles.rewardText}>
                        +{rewards.totalExp} XP Total
                      </Text>
                    </View>
                  </View>

                  {/* Player Level Up */}
                  {hasPlayerLevelUp && (
                    <View style={styles.levelUpSection}>
                      <View style={styles.levelUpBadge}>
                        <Text style={styles.levelUpTitle}>
                          Você subiu de nível!
                        </Text>
                        <Text style={styles.levelUpLevel}>
                          Nível {rewards.playerLevelUp!.newLevel}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Coffeemon Rewards */}
                  {(hasAnyCoffeemonLevelUp || hasAnyLearnedMoves) && (
                    <View style={styles.coffeemonSection}>
                      <Text style={styles.sectionTitle}>Seus Coffeemons</Text>
                      {rewards.coffeemonRewards.map((coffeemonReward, idx) => {
                        const hasLevelUp = coffeemonReward.levelUp !== undefined;
                        const hasMoves = coffeemonReward.learnedMoves.length > 0;

                        if (!hasLevelUp && !hasMoves) return null;

                        return (
                          <View key={idx} style={styles.coffeemonCard}>
                            <Text style={styles.coffeemonName}>
                              {coffeemonReward.coffeemonName}
                            </Text>

                            {hasLevelUp && (
                              <View style={styles.coffeemonLevelUp}>
                                <View style={styles.levelUpBadgeSmall}>
                                  <Text style={styles.levelUpArrow}>↑</Text>
                                </View>
                                <View style={styles.levelUpInfo}>
                                  <Text style={styles.coffeemonLevelUpText}>
                                    Nível {coffeemonReward.levelUp!.newLevel}
                                  </Text>
                                  <Text style={styles.coffeemonExpText}>
                                    +{coffeemonReward.levelUp!.expGained} XP
                                  </Text>
                                </View>
                              </View>
                            )}

                            {hasMoves && (
                              <View style={styles.learnedMovesContainer}>
                                <Text style={styles.learnedMovesTitle}>
                                  Novas Habilidades
                                </Text>
                                <View style={styles.movesList}>
                                  {coffeemonReward.learnedMoves.map(
                                    (moveName, moveIdx) => (
                                      <View key={moveIdx} style={styles.moveItem}>
                                        <View style={styles.moveBullet} />
                                        <Text style={styles.learnedMoveText}>
                                          {moveName}
                                        </Text>
                                      </View>
                                    )
                                  )}
                                </View>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Sair da Batalha</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}
