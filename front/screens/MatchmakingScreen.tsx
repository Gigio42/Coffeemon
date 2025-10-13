/**
 * ========================================
 * MATCHMAKING SCREEN - TELA DE PROCURAR PARTIDA
 * ========================================
 * 
 * RESPONSABILIDADES DESTA TELA:
 * 1. Conectar ao servidor via Socket.IO
 * 2. Exibir botão "Procurar Partida"
 * 3. Emitir evento "findMatch" quando usuário clica no botão
 * 4. Escutar evento "matchFound" quando servidor encontra oponente
 * 5. Fazer logout (limpar AsyncStorage e desconectar socket)
 * 6. Navegar para tela de Batalha quando partida é encontrada
 * 
 * IMPORTANTE: Esta tela NÃO depende do App.tsx para lógica de matchmaking!
 */

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, getServerUrl, BASE_IMAGE_URL } from '../utils/config';
import { BattleState } from '../types';
import QRScanner from './QRScanner';

// Interface para os Coffeemons do jogador
interface PlayerCoffeemon {
  id: number;
  hp: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  isInParty: boolean;
  coffeemon: {
    id: number;
    name: string;
    type: string;
    imageUrl?: string;
  };
}

interface MatchmakingScreenProps {
  token: string;                  // Token JWT recebido do login
  playerId: number;               // ID do jogador
  onNavigateToLogin: () => void;  // Callback para voltar ao login
  onNavigateToEcommerce?: () => void; // Callback para voltar ao e-commerce
  onNavigateToBattle: (battleId: string, battleState: BattleState, socket: Socket) => void; // Callback para ir à batalha
}

export default function MatchmakingScreen({ 
  token, 
  playerId, 
  onNavigateToLogin,
  onNavigateToEcommerce,
  onNavigateToBattle 
}: MatchmakingScreenProps) {
  // ========================================
  // ESTADOS LOCAIS
  // ========================================
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const [coffeemons, setCoffeemons] = useState<PlayerCoffeemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [partyLoading, setPartyLoading] = useState<number | null>(null);
  const [qrScannerVisible, setQrScannerVisible] = useState<boolean>(false);

  // ========================================
  // SETUP DO SOCKET AO INICIAR
  // ========================================
  useEffect(() => {
    setupSocket();
    fetchPlayerCoffeemons(); // Buscar Coffeemons do jogador
    
    // Cleanup: desconecta socket quando componente é desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  /**
   * FUNÇÃO: fetchPlayerCoffeemons
   * Busca todos os Coffeemons do jogador da API
   */
  async function fetchPlayerCoffeemons() {
    setLoading(true);
    try {
      // Primeiro busca o player (que já retorna os coffeemons incluídos)
      const playerResponse = await fetch(`${getServerUrl()}/game/players/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (playerResponse.ok) {
        const player = await playerResponse.json();
        console.log('Player data:', player);
        
        // Agora busca todos os coffeemons desse player
        const coffeemonsResponse = await fetch(
          `${getServerUrl()}/game/players/${player.id}/coffeemons`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (coffeemonsResponse.ok) {
          const data = await coffeemonsResponse.json();
          console.log('Coffeemons data:', data);
          setCoffeemons(data);
          addLog(`${data.length} Coffeemons carregados`);
        } else {
          addLog('Erro ao carregar Coffeemons');
        }
      } else {
        addLog('Erro ao carregar dados do jogador');
      }
    } catch (error) {
      console.error('Error fetching coffeemons:', error);
      addLog('Erro de conexão ao carregar Coffeemons');
    } finally {
      setLoading(false);
    }
  }

  /**
   * FUNÇÃO: toggleParty
   * Adiciona ou remove um Coffeemon do time
   */
  async function toggleParty(coffeemon: PlayerCoffeemon) {
    // Verifica limite do time (máximo 3)
    const partyCount = coffeemons.filter(c => c.isInParty).length;
    
    if (!coffeemon.isInParty && partyCount >= 3) {
      Alert.alert('Limite atingido', 'Você só pode ter 3 Coffeemons no time!');
      return;
    }

    setPartyLoading(coffeemon.id);
    
    try {
      let response;
      
      if (coffeemon.isInParty) {
        // Remover do time
        response = await fetch(
          `${getServerUrl()}/game/players/me/party/remove/${coffeemon.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Adicionar ao time
        response = await fetch(`${getServerUrl()}/game/players/me/party`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerCoffeemonId: coffeemon.id }),
        });
      }

      if (response.ok) {
        // Atualiza o estado local
        setCoffeemons(prev =>
          prev.map(c =>
            c.id === coffeemon.id ? { ...c, isInParty: !c.isInParty } : c
          )
        );
        addLog(
          `${coffeemon.coffeemon.name} ${!coffeemon.isInParty ? 'adicionado ao' : 'removido do'} time`
        );
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.message || 'Erro ao alterar time');
      }
    } catch (error) {
      console.error('Error toggling party:', error);
      Alert.alert('Erro', 'Erro de conexão ao alterar time');
    } finally {
      setPartyLoading(null);
    }
  }

  /**
   * FUNÇÃO: setupSocket
   * Responsável por TODA a lógica de conexão Socket.IO:
   * 1. Conecta ao servidor usando token JWT
   * 2. Escuta eventos de conexão
   * 3. Escuta evento "matchFound" (quando servidor encontra oponente)
   */
  function setupSocket() {
    console.log('Setting up socket with token:', token, 'playerId:', playerId);
    
    // Conecta ao servidor Socket.IO com autenticação JWT
    const s = io(SOCKET_URL, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
    
    setSocket(s);
    
    // Evento: Socket conectado com sucesso
    s.on('connect', () => {
      console.log('Socket connected:', s.id);
      addLog(`Conectado ao servidor. Socket ID: ${s.id}`);
      setMatchStatus('Conectado');
    });

    // Evento: Erro de conexão
    s.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err);
      addLog(`Erro de conexão: ${err.message}`);
      setMatchStatus('Erro de conexão');
    });

    // Debug: Log de todos os eventos recebidos
    s.onAny((eventName: string, ...args: any[]) => {
      console.log('Socket event received:', eventName, args);
    });

    // Evento: Partida encontrada!
    // Quando servidor encontra um oponente, navega para tela de batalha
    s.on('matchFound', (data: any) => {
      console.log('Match found!', data);
      addLog(`Partida encontrada! Battle ID: ${data.battleId}`);
      setMatchStatus('Partida encontrada!');
      
      // Pequeno delay para dar tempo de atualizar UI
      setTimeout(() => {
        onNavigateToBattle(data.battleId, data.battleState, s);
      }, 100);
    });
  }

  /**
   * FUNÇÃO: addLog
   * Adiciona mensagem ao log da tela
   */
  function addLog(msg: string) {
    console.log('LOG:', msg);
    setLog((prev) => [msg, ...prev]);
  }

  /**
   * FUNÇÃO: findMatch
   * Emite evento "findMatch" para o servidor
   * Servidor vai colocar jogador na fila de matchmaking
   */
  function findMatch() {
    addLog('Enviando evento "findMatch"...');
    setMatchStatus('Procurando...');
    if (socket) {
      socket.emit('findMatch');
    }
  }

  /**
   * FUNÇÃO: handleLogout
   * Responsável por TODA a lógica de logout:
   * 1. Limpa AsyncStorage (remove token e playerId)
   * 2. Desconecta socket
   * 3. Navega para tela de Login
   */
  async function handleLogout() {
    await AsyncStorage.clear();
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    onNavigateToLogin();
  }

  /**
   * FUNÇÃO: handleOpenQRScanner
   * Abre o modal do scanner de QR code
   */
  function handleOpenQRScanner() {
    setQrScannerVisible(true);
  }

  /**
   * FUNÇÃO: handleCloseQRScanner
   * Fecha o modal do scanner de QR code
   */
  function handleCloseQRScanner() {
    setQrScannerVisible(false);
  }

  /**
   * FUNÇÃO: handleCoffeemonAdded
   * Callback chamado quando um Coffeemon é adicionado via QR code
   * Recarrega a lista de Coffeemons
   */
  function handleCoffeemonAdded() {
    fetchPlayerCoffeemons();
  }

  // ========================================
  // RENDERIZAÇÃO DA UI
  // ========================================
  
  // Separa Coffeemons em time e disponíveis
  const partyMembers = coffeemons.filter(c => c.isInParty);
  const availableCoffeemons = coffeemons.filter(c => !c.isInParty);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.matchmakingContainer}>
          {/* BOTÃO DE VOLTAR */}
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

          {/* SEÇÃO: MEU TIME */}
          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>🎮 Meu Time ({partyMembers.length}/3)</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#2ecc71" />
            ) : partyMembers.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum Coffeemon no time ainda</Text>
            ) : (
              <View style={styles.teamGrid}>
                {partyMembers.map((pc) => (
                  <View key={pc.id} style={styles.coffeemonCard}>
                    <Image
                      source={{ 
                        uri: `${BASE_IMAGE_URL}${pc.coffeemon.name}/default.png` 
                      }}
                      style={styles.coffeemonImage}
                      defaultSource={require('../assets/icon.png')}
                    />
                    <Text style={styles.coffeemonName}>{pc.coffeemon.name}</Text>
                    <Text style={styles.coffeemonLevel}>Nv. {pc.level}</Text>
                    <TouchableOpacity
                      style={[styles.partyButton, styles.removeButton]}
                      onPress={() => toggleParty(pc)}
                      disabled={partyLoading === pc.id}
                    >
                      {partyLoading === pc.id ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>➖ Remover</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* SEÇÃO: COFFEEMONS DISPONÍVEIS */}
          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>📦 Disponíveis ({availableCoffeemons.length})</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#3498db" />
            ) : availableCoffeemons.length === 0 ? (
              <Text style={styles.emptyText}>Todos os Coffeemons estão no time</Text>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.availableScroll}
              >
                {availableCoffeemons.map((pc) => (
                  <View key={pc.id} style={styles.coffeemonCardSmall}>
                    <Image
                      source={{ 
                        uri: `${BASE_IMAGE_URL}${pc.coffeemon.name}/default.png` 
                      }}
                      style={styles.coffeemonImageSmall}
                      defaultSource={require('../assets/icon.png')}
                    />
                    <Text style={styles.coffeemonNameSmall}>{pc.coffeemon.name}</Text>
                    <Text style={styles.coffeemonLevelSmall}>Nv. {pc.level}</Text>
                    <TouchableOpacity
                      style={[styles.partyButton, styles.addButton]}
                      onPress={() => toggleParty(pc)}
                      disabled={partyLoading === pc.id || partyMembers.length >= 3}
                    >
                      {partyLoading === pc.id ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>➕</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={handleOpenQRScanner}
          >
            <Text style={styles.captureButtonText}>📷 Capturar Coffeemon</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.findMatchButton} onPress={findMatch}>
            <Text style={styles.findMatchButtonText}>Procurar Partida</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR SCANNER MODAL */}
      <QRScanner
        visible={qrScannerVisible}
        token={token}
        onClose={handleCloseQRScanner}
        onCoffeemonAdded={handleCoffeemonAdded}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f5ed',
  },
  scrollView: {
    flex: 1,
  },
  matchmakingContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  statusText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600',
  },
  // ESTILOS PARA SEÇÃO DE TIME
  teamSection: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coffeemonCard: {
    width: '31%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  coffeemonImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  coffeemonName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  coffeemonLevel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  // ESTILOS PARA DISPONÍVEIS (SCROLL HORIZONTAL)
  availableScroll: {
    maxHeight: 180,
  },
  coffeemonCardSmall: {
    width: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  coffeemonImageSmall: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  coffeemonNameSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  coffeemonLevelSmall: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  // BOTÕES DE PARTY
  partyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#2ecc71',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // BOTÕES PRINCIPAIS
  captureButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: '#9b59b6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  findMatchButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  findMatchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    maxWidth: 300,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
