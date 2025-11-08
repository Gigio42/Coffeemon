import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    giveAllCoffeemons,
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
      {/* Header Fixo */}
      <View style={styles.header}>
        {onNavigateToEcommerce && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onNavigateToEcommerce}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Arena de Batalha</Text>
        <View style={{ width: 60 }} />
      </View>

      <LinearGradient 
        colors={['#e0f0ff', '#f0d0e0']} 
        style={styles.gradientContainer}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Status de Matchmaking */}
          {matchStatus && (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>{matchStatus}</Text>
            </View>
          )}

          {/* Seção de Times */}
          <View style={styles.teamsSection}>
            <TeamSection
              title={`Meu Time (${partyMembers.length}/3)`}
              coffeemons={partyMembers}
              loading={loading}
              emptyMessage="Adicione Coffeemons ao seu time"
              onToggleParty={toggleParty}
              partyLoading={partyLoading}
              variant="grid"
            />

            <View style={styles.divider} />

            <TeamSection
              title={`Disponíveis (${availableCoffeemons.length})`}
              coffeemons={availableCoffeemons}
              loading={loading}
              emptyMessage="Capture mais Coffeemons"
              onToggleParty={toggleParty}
              partyLoading={partyLoading}
              variant="horizontal"
            />
          </View>

          {/* Botão Capturar */}
          <View style={styles.actionCard}>
            <Text style={styles.cardTitle}>Capturar Coffeemons</Text>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleOpenQRScanner}
            >
              <Text style={styles.captureButtonText}>📷 Escanear QR Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, { marginTop: 8, backgroundColor: '#27ae60' }]}
              onPress={giveAllCoffeemons}
              disabled={loading}
            >
              <Text style={styles.captureButtonText}>
                {loading ? '⏳ Capturando...' : '🎁 Capturar Todos'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção de Batalhas */}
          <View style={styles.battleSection}>
            <Text style={styles.sectionTitle}>Modos de Batalha</Text>
            
            <TouchableOpacity
              style={[styles.battleButton, styles.pvpButton]}
              onPress={handleFindMatch}
              disabled={partyMembers.length === 0}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.battleButtonEmoji}>🎮</Text>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.battleButtonTitle}>Partida Online</Text>
                  <Text style={styles.battleButtonSubtitle}>Jogador vs Jogador</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.dividerSmall} />
            <Text style={styles.orText}>ou escolha um desafio</Text>
            <View style={styles.dividerSmall} />

            <TouchableOpacity
              style={[styles.battleButton, styles.jessieButton]}
              onPress={() => handleFindBotMatch('jessie')}
              disabled={partyMembers.length === 0}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.battleButtonEmoji}>👾</Text>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.battleButtonTitle}>Desafio Jessie</Text>
                  <Text style={styles.battleButtonSubtitle}>Nível Iniciante</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.battleButton, styles.jamesButton]}
              onPress={() => handleFindBotMatch('pro-james')}
              disabled={partyMembers.length === 0}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.battleButtonEmoji}>🤖</Text>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.battleButtonTitle}>Desafio James</Text>
                  <Text style={styles.battleButtonSubtitle}>Nível Avançado</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Botão Logout */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <QRScanner
        visible={qrScannerVisible}
        token={token}
        onClose={handleCloseQRScanner}
        onCoffeemonAdded={handleCoffeemonAdded}
      />
    </SafeAreaView>
  );
}
