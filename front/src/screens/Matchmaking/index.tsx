import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Socket } from 'socket.io-client';
import { BattleState } from '../../../types';
import { useMatchmaking } from '../../hooks/useMatchmaking';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import TeamSection from '../../components/TeamSection';
import QRScanner from '../../../screens/QRScanner';
import { styles } from './styles';

interface MatchmakingScreenProps {
  token: string;
  playerId: number;
  onNavigateToLogin: () => void;
  onNavigateToEcommerce?: () => void;
  onNavigateToBattle: (
    battleId: string,
    battleState: BattleState,
    socket: Socket
  ) => void;
}

export default function MatchmakingScreen({
  token,
  playerId,
  onNavigateToLogin,
  onNavigateToEcommerce,
  onNavigateToBattle,
}: MatchmakingScreenProps) {
  const [qrScannerVisible, setQrScannerVisible] = useState<boolean>(false);

  // Hook de Matchmaking (Socket, status, logs)
  const { matchStatus, log, findMatch, findBotMatch, handleLogout } =
    useMatchmaking({
      token,
      playerId,
      onNavigateToLogin,
      onNavigateToBattle,
    });

  // Hook de Coffeemons (lista, party, loading)
  const {
    loading,
    partyLoading,
    partyMembers,
    availableCoffeemons,
    fetchCoffeemons,
    toggleParty,
  } = useCoffeemons({
    token,
    onLog: (msg) => console.log('Coffeemons:', msg),
  });

  // Handlers
  function handleFindMatch() {
    if (partyMembers.length === 0) {
      Alert.alert(
        'Time Vazio',
        'Você precisa ter pelo menos 1 Coffeemon no seu time antes de procurar uma partida!'
      );
      return;
    }
    findMatch();
  }

  function handleFindBotMatch(botProfileId: string) {
    if (partyMembers.length === 0) {
      Alert.alert(
        'Time Vazio',
        'Você precisa ter pelo menos 1 Coffeemon no seu time antes de lutar!'
      );
      return;
    }
    findBotMatch(botProfileId);
  }

  function handleOpenQRScanner() {
    setQrScannerVisible(true);
  }

  function handleCloseQRScanner() {
    setQrScannerVisible(false);
  }

  function handleCoffeemonAdded() {
    fetchCoffeemons();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.matchmakingContainer}>
          {onNavigateToEcommerce && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onNavigateToEcommerce}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.matchTitle}>Procurar Partida</Text>

          {matchStatus && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{matchStatus}</Text>
            </View>
          )}

          <TeamSection
            title={`🎮 Meu Time (${partyMembers.length}/3)`}
            coffeemons={partyMembers}
            loading={loading}
            emptyMessage="Nenhum Coffeemon no time ainda"
            onToggleParty={toggleParty}
            partyLoading={partyLoading}
            variant="grid"
          />

          <TeamSection
            title={`📦 Disponíveis (${availableCoffeemons.length})`}
            coffeemons={availableCoffeemons}
            loading={loading}
            emptyMessage="Todos os Coffeemons estão no time"
            onToggleParty={toggleParty}
            partyLoading={partyLoading}
            variant="horizontal"
          />

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleOpenQRScanner}
          >
            <Text style={styles.captureButtonText}>📷 Capturar Coffeemon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.findMatchButton, styles.pvpButton]}
            onPress={handleFindMatch}
          >
            <Text style={styles.findMatchButtonText}>
              🎮 PROCURAR PARTIDA ONLINE (PvP)
            </Text>
          </TouchableOpacity>

          <View style={styles.botButtonsContainer}>
            <Text style={styles.botSectionTitle}>Ou lute contra um bot:</Text>

            <TouchableOpacity
              style={[styles.findMatchButton, styles.jessieButton]}
              onPress={() => handleFindBotMatch('jessie')}
            >
              <Text style={styles.findMatchButtonText}>
                👾 LUTAR CONTRA JESSIE (Bot)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.findMatchButton, styles.jamesButton]}
              onPress={() => handleFindBotMatch('pro-james')}
            >
              <Text style={styles.findMatchButtonText}>
                🤖 LUTAR CONTRA JAMES (Bot Avançado)
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <QRScanner
        visible={qrScannerVisible}
        token={token}
        onClose={handleCloseQRScanner}
        onCoffeemonAdded={handleCoffeemonAdded}
      />
    </SafeAreaView>
  );
}
