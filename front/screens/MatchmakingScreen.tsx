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
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';
import { BattleState } from '../types';

interface MatchmakingScreenProps {
  token: string;                  // Token JWT recebido do login
  playerId: number;               // ID do jogador
  onNavigateToLogin: () => void;  // Callback para voltar ao login
  onNavigateToBattle: (battleId: string, battleState: BattleState, socket: Socket) => void; // Callback para ir à batalha
}

export default function MatchmakingScreen({ 
  token, 
  playerId, 
  onNavigateToLogin, 
  onNavigateToBattle 
}: MatchmakingScreenProps) {
  // ========================================
  // ESTADOS LOCAIS
  // ========================================
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);

  // ========================================
  // SETUP DO SOCKET AO INICIAR
  // ========================================
  useEffect(() => {
    setupSocket();
    
    // Cleanup: desconecta socket quando componente é desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

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

  // ========================================
  // RENDERIZAÇÃO DA UI
  // ========================================
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.matchmakingContainer}>
        <Text style={styles.matchTitle}>Procurar Partida</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>User ID: {playerId}</Text>
          <Text style={styles.infoText}>Socket ID: {socket?.id || 'Desconectado'}</Text>
          <Text style={styles.infoText}>Status: {matchStatus || 'Conectado'}</Text>
        </View>
        
        <TouchableOpacity style={styles.findMatchButton} onPress={findMatch}>
          <Text style={styles.findMatchButtonText}>Procurar Partida</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.logContainer}>
          <Text style={styles.sectionTitle}>Log</Text>
          <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
            {log.map((msg, idx) => (
              <Text key={idx} style={styles.logText}>{msg}</Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f5ed',
    padding: 16,
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
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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
  logContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 16,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    maxWidth: 400,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  logText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
});
