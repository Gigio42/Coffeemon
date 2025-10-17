import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BattleScreenRouteProp } from '../../../navigation/types';
import { useBattleEngine } from '../hooks';
import { useSocket } from '../../matchmaking/hooks';
import { useAuthStore } from '../../../state';
import { BattleDisplay, Button } from '../../../components';
import { theme } from '../../../styles/theme';

/**
 * ========================================
 * BATTLE SCREEN
 * ========================================
 * 
 * Tela de batalha
 * Usa useBattleEngine para gerenciar lógica
 */

export const BattleScreen: React.FC = () => {
  const route = useRoute<BattleScreenRouteProp>();
  const navigation = useNavigation();
  const { battleId, battleState: initialBattleState } = route.params;
  const { playerId } = useAuthStore();
  
  const { socket } = useSocket({ autoConnect: false });
  
  const {
    battleState,
    isMyTurn,
    myMon,
    opponentMon,
    battleLog,
    battleEnded,
    winnerId,
    performAttack,
    switchCoffeemon,
    isAnimating,
    damageAnimation,
  } = useBattleEngine({
    socket: socket!,
    battleId,
    initialState: initialBattleState,
    playerId: playerId!,
    onBattleEnd: (winner) => {
      const isWinner = winner === playerId;
      setTimeout(() => {
        Alert.alert(
          isWinner ? 'Vitória!' : 'Derrota',
          isWinner ? 'Você venceu a batalha!' : 'Você perdeu a batalha.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1000);
    },
  });
  
  if (!myMon || !opponentMon) {
    return (
      <View style={styles.container}>
        <Text>Carregando batalha...</Text>
      </View>
    );
  }
  
  const myState = battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
  const opponentState = battleState.player1Id === playerId ? battleState.player2 : battleState.player1;
  
  return (
    <View style={styles.container}>
      {/* Opponent Display */}
      <View style={styles.opponentSection}>
        <BattleDisplay
          coffeemon={opponentMon}
          variant="opponent"
          isAnimating={damageAnimation?.playerId === (battleState.player1Id === playerId ? battleState.player2Id : battleState.player1Id)}
        />
      </View>
      
      {/* Battle Log */}
      <View style={styles.logSection}>
        <ScrollView style={styles.logScroll}>
          {battleLog.map((message, index) => (
            <Text key={index} style={styles.logText}>
              {message}
            </Text>
          ))}
        </ScrollView>
      </View>
      
      {/* Player Display */}
      <View style={styles.playerSection}>
        <BattleDisplay
          coffeemon={myMon}
          variant="player"
          isAnimating={damageAnimation?.playerId === playerId}
        />
      </View>
      
      {/* Actions */}
      <View style={[styles.actionsSection, !isMyTurn && styles.actionsSectionDisabled]}>
        {battleEnded ? (
          <View style={styles.endOverlay}>
            <Text style={styles.endText}>
              {winnerId === playerId ? '🎉 Vitória!' : '😢 Derrota'}
            </Text>
          </View>
        ) : !isMyTurn ? (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>Aguardando turno do oponente...</Text>
          </View>
        ) : (
          <>
            {/* Attack Buttons */}
            <View style={styles.movesSection}>
              <Text style={styles.sectionTitle}>Ataques</Text>
              <View style={styles.movesGrid}>
                {myMon.moves.map((move) => (
                  <TouchableOpacity
                    key={move.id}
                    style={styles.moveButton}
                    onPress={() => performAttack(move.id)}
                    disabled={isAnimating || !myMon.canAct}
                  >
                    <Text style={styles.moveButtonText}>{move.name}</Text>
                    <Text style={styles.moveButtonPower}>⚡ {move.power}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Switch Buttons */}
            {myState.coffeemons.length > 1 && (
              <View style={styles.switchSection}>
                <Text style={styles.sectionTitle}>Trocar Coffeemon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {myState.coffeemons.map((coffeemon, index) => {
                    if (index === myState.activeCoffeemonIndex || coffeemon.isFainted) {
                      return null;
                    }
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.switchButton}
                        onPress={() => switchCoffeemon(index)}
                        disabled={isAnimating}
                      >
                        <Text style={styles.switchButtonText}>{coffeemon.name}</Text>
                        <Text style={styles.switchButtonHp}>
                          HP: {coffeemon.currentHp}/{coffeemon.maxHp}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.battleArena,
  },
  opponentSection: {
    flex: 2,
    justifyContent: 'flex-start',
    paddingTop: theme.spacing.lg,
  },
  logSection: {
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: theme.spacing.sm,
  },
  logScroll: {
    flex: 1,
  },
  logText: {
    fontSize: theme.typography.sizes.sm,
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  playerSection: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.lg,
  },
  actionsSection: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    minHeight: 200,
  },
  actionsSectionDisabled: {
    opacity: 0.6,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  movesSection: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  moveButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  moveButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  moveButtonPower: {
    fontSize: theme.typography.sizes.sm,
    color: '#fff',
  },
  switchSection: {
    marginTop: theme.spacing.md,
  },
  switchButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    minWidth: 120,
  },
  switchButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  switchButtonHp: {
    fontSize: theme.typography.sizes.xs,
    color: '#fff',
  },
  endOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.borderRadius.xl,
  },
  endText: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: '#fff',
  },
});
