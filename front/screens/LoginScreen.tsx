/**
 * ========================================
 * LOGIN SCREEN - TELA DE AUTENTICAÇÃO
 * ========================================
 * 
 * RESPONSABILIDADES DESTA TELA:
 * 1. Verificar se usuário já está logado (checkAuthStatus)
 * 2. Exibir formulário de login (email e senha)
 * 3. Fazer requisição HTTP para /auth/login
 * 4. Buscar dados do jogador em /game/players/me
 * 5. Salvar token e playerId no AsyncStorage
 * 6. Navegar para tela de Matchmaking após login bem-sucedido
 * 
 * IMPORTANTE: Esta tela NÃO depende do App.tsx para lógica de login!
 */

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '../utils/config';

interface LoginScreenProps {
  // Callback para navegar para a tela de Matchmaking
  onNavigateToMatchmaking: (token: string, playerId: number) => void;
}

export default function LoginScreen({ onNavigateToMatchmaking }: LoginScreenProps) {
  // ========================================
  // ESTADOS LOCAIS
  // ========================================
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  // ========================================
  // VERIFICAÇÃO DE AUTENTICAÇÃO AO INICIAR
  // ========================================
  // Verifica se já está autenticado ao abrir a tela
  // Se sim, navega direto para Matchmaking
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * FUNÇÃO: checkAuthStatus
   * Verifica se já existe token e playerId salvos no AsyncStorage
   * Se existir, navega automaticamente para Matchmaking
   */
  async function checkAuthStatus() {
    try {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedPlayerId = await AsyncStorage.getItem('player_id');
      
      if (storedToken && storedPlayerId) {
        onNavigateToMatchmaking(storedToken, parseInt(storedPlayerId));
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      await AsyncStorage.clear();
    }
  }

  /**
   * FUNÇÃO: handleLogin
   * Responsável por TODA a lógica de autenticação:
   * 1. Valida campos
   * 2. Faz POST para /auth/login
   * 3. Busca dados do jogador em /game/players/me
   * 4. Salva token e playerId no AsyncStorage
   * 5. Navega para Matchmaking
   */
  async function handleLogin() {
    // Validação de campos
    if (!email.trim() || !password.trim()) {
      setLoginMessage('Erro: Preencha todos os campos');
      return;
    }

    try {
      setLoginMessage('Fazendo login...');
      console.log('Tentando conectar em:', `${SOCKET_URL}/auth/login`);
      
      // ETAPA 1: Fazer login no backend
      const loginResponse = await fetch(`${SOCKET_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const loginData = await loginResponse.json();
      
      if (!loginData.access_token) {
        throw new Error(loginData.message || 'Falha no login');
      }
      
      const token = loginData.access_token;
      await AsyncStorage.setItem('jwt_token', token);
      
      setLoginMessage('Usuário autenticado! Buscando dados do jogador...');
      
      // ETAPA 2: Buscar dados do jogador (Player ID)
      const playerResponse = await fetch(`${SOCKET_URL}/game/players/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!playerResponse.ok) {
        throw new Error('Perfil de jogador não encontrado para este usuário.');
      }
      
      const playerData = await playerResponse.json();
      await AsyncStorage.setItem('player_id', playerData.id.toString());
      
      // ETAPA 3: Login bem-sucedido! Navegar para Matchmaking
      setLoginMessage(`Login bem-sucedido! Player ID: ${playerData.id}`);
      setTimeout(() => onNavigateToMatchmaking(token, playerData.id), 1000);
      
    } catch (error: any) {
      console.error('Erro de login:', error);
      setLoginMessage(`Erro: ${error.message || 'Falha na conexão com o servidor'}`);
      await AsyncStorage.clear();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        {loginMessage ? (
          <Text style={[styles.message, { color: loginMessage.includes('Erro') ? 'red' : 'green' }]}>
            {loginMessage}
          </Text>
        ) : null}
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
});
