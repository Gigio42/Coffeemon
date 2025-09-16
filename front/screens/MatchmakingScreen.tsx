import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { io } from 'socket.io-client';
import Constants from 'expo-constants';

// Detecta automaticamente o IP do servidor
const getServerUrl = () => {
  if (__DEV__) {
    // Em desenvolvimento, usa o IP do Metro/Expo
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
    return debuggerHost ? `http://${debuggerHost}:3000` : 'http://localhost:3000';
  }
  // Em produção, usar um domínio ou IP específico
  return 'http://your-production-server.com:3000';
};

interface MatchmakingScreenProps {
  token: string;
  playerId: number;
  customServerUrl?: string;
  onMatchFound: (battleId: string, battleState: any, socket: any) => void;
  onLogout: () => void;
}

export default function MatchmakingScreen({ 
  token, 
  playerId, 
  customServerUrl, 
  onMatchFound, 
  onLogout 
}: MatchmakingScreenProps) {
  const [socket, setSocket] = useState<any>(null);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);

  // Setup do Socket quando o componente monta
  useEffect(() => {
    if (token && playerId && !socket) {
      setupSocket();
    }

    // Cleanup quando o componente desmonta
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  function addLog(msg: string) {
    console.log('LOG:', msg);
    setLog((prev) => [msg, ...prev]);
  }

  function setupSocket() {
    console.log('Setting up socket with token:', token, 'playerId:', playerId);
    const serverUrl = customServerUrl?.trim() || getServerUrl();
    const s = io(serverUrl, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
    
    setSocket(s);
    
    s.on('connect', () => {
      console.log('Socket connected:', s.id);
      addLog(`Conectado ao servidor. Socket ID: ${s.id}`);
      setMatchStatus('Conectado');
    });

    s.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err);
      addLog(`Erro de conexão: ${err.message}`);
      setMatchStatus('Erro de conexão');
    });

    // Listener genérico para debug
    s.onAny((eventName: string, ...args: any[]) => {
      console.log('Socket event received:', eventName, args);
    });

    s.on('matchFound', (data: any) => {
      console.log('Match found!', data);
      console.log('BattleState structure:', JSON.stringify(data.battleState, null, 2));
      addLog(`Partida encontrada! Battle ID: ${data.battleId}`);
      setMatchStatus('Partida encontrada!');
      
      // Callback para mudança de tela
      setTimeout(() => {
        onMatchFound(data.battleId, data.battleState, s);
      }, 100);
    });
  }

  function findMatch() {
    addLog('Enviando evento "findMatch"...');
    setMatchStatus('Procurando...');
    if (socket) {
      socket.emit('findMatch');
    }
  }

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
        
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
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
    backgroundColor: '#f5f5f5',
  },
  matchmakingContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    marginVertical: 5,
    textAlign: 'center',
  },
  findMatchButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  findMatchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  logText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginVertical: 2,
    paddingHorizontal: 5,
  },
});