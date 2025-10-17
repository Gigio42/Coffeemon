import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../navigation/types';
import { usePlayer, useMatchmaking } from '../hooks';
import { useAuth } from '../../auth/hooks';
import { Button, CoffeemonCard } from '../../../components';
import { theme } from '../../../styles/theme';
import { QRScanner } from './QRScanner';

/**
 * ========================================
 * MATCHMAKING SCREEN
 * ========================================
 * 
 * Tela de matchmaking e gerenciamento de party
 * Usa hooks: usePlayer, useMatchmaking, useAuth
 */

export const MatchmakingScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  
  const { logout } = useAuth();
  const {
    coffeemons,
    party,
    isLoading,
    addToParty,
    removeFromParty,
    addCoffeemonByQR,
    canAddToParty,
    partyCount,
  } = usePlayer();
  
  const {
    isSearching,
    matchStatus,
    isConnected,
    findMatch,
    cancelSearch,
  } = useMatchmaking({
    onMatchFound: (battleId, battleState) => {
      navigation.navigate('Battle', { battleId, battleState });
    },
    onError: (error) => {
      Alert.alert('Erro', error);
    },
  });
  
  const handleToggleParty = async (coffeemon: any) => {
    if (coffeemon.isInParty) {
      await removeFromParty(coffeemon.id);
    } else {
      await addToParty(coffeemon.id);
    }
  };
  
  const handleQRScan = async (data: string) => {
    try {
      const coffeemonId = parseInt(data);
      if (isNaN(coffeemonId)) {
        Alert.alert('Erro', 'QR Code inválido');
        return;
      }
      
      await addCoffeemonByQR(coffeemonId);
      setQrScannerVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar Coffeemon');
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };
  
  const partyMembers = coffeemons.filter(c => c.isInParty);
  const availableCoffeemons = coffeemons.filter(c => !c.isInParty);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isConnected && styles.statusDotConnected]} />
          <Text style={styles.statusText}>{matchStatus}</Text>
        </View>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Party Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Meu Time ({partyCount}/3)
          </Text>
          
          {partyMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Adicione até 3 Coffeemons ao seu time
              </Text>
            </View>
          ) : (
            partyMembers.map((coffeemon) => (
              <CoffeemonCard
                key={coffeemon.id}
                coffeemon={coffeemon}
                onActionPress={() => handleToggleParty(coffeemon)}
                actionLabel="Remover"
                actionVariant="error"
                isInParty={true}
                showStats={true}
              />
            ))
          )}
        </View>
        
        {/* Available Coffeemons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Disponíveis</Text>
            <Button
              title="Scan QR"
              onPress={() => setQrScannerVisible(true)}
              variant="secondary"
              style={styles.qrButton}
            />
          </View>
          
          {availableCoffeemons.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Nenhum Coffeemon disponível. Use o QR Scanner para adicionar!
              </Text>
            </View>
          ) : (
            availableCoffeemons.map((coffeemon) => (
              <CoffeemonCard
                key={coffeemon.id}
                coffeemon={coffeemon}
                onActionPress={() => handleToggleParty(coffeemon)}
                actionLabel="Adicionar"
                actionVariant="success"
                isInParty={false}
                showStats={true}
              />
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Matchmaking Button */}
      <View style={styles.footer}>
        {partyCount === 0 ? (
          <Text style={styles.warningText}>
            Adicione pelo menos 1 Coffeemon ao time para batalhar
          </Text>
        ) : (
          <Button
            title={isSearching ? 'Cancelar Busca' : 'Buscar Partida'}
            onPress={isSearching ? cancelSearch : findMatch}
            variant={isSearching ? 'error' : 'primary'}
            disabled={!isConnected || isLoading}
            loading={isLoading}
          />
        )}
      </View>
      
      {/* QR Scanner Modal */}
      {qrScannerVisible && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setQrScannerVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.error,
    marginRight: theme.spacing.sm,
  },
  statusDotConnected: {
    backgroundColor: theme.colors.success,
  },
  statusText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
    fontWeight: theme.typography.weights.bold,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  qrButton: {
    paddingHorizontal: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  warningText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    textAlign: 'center',
    padding: theme.spacing.md,
  },
});
