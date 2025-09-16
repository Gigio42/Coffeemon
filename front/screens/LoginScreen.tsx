import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const SOCKET_URL = getServerUrl();

interface LoginScreenProps {
  onLoginSuccess: (token: string, playerId: number) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [customServerUrl, setCustomServerUrl] = useState('');
  const [showServerConfig, setShowServerConfig] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setLoginMessage('Erro: Preencha todos os campos');
      return;
    }

    // Usar servidor customizado se fornecido
    const serverUrl = customServerUrl.trim() || SOCKET_URL;

    try {
      setLoginMessage('Fazendo login...');
      console.log('Tentando conectar em:', `${serverUrl}/auth/login`);
      
      // Fazer login
      const loginResponse = await fetch(`${serverUrl}/auth/login`, {
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
      
      // Buscar dados do jogador
      const playerResponse = await fetch(`${serverUrl}/game/players/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!playerResponse.ok) {
        throw new Error('Perfil de jogador não encontrado para este usuário.');
      }
      
      const playerData = await playerResponse.json();
      await AsyncStorage.setItem('player_id', playerData.id.toString());
      
      setLoginMessage(`Login bem-sucedido! Player ID: ${playerData.id}`);
      
      // Chamar callback de sucesso
      setTimeout(() => {
        onLoginSuccess(token, playerData.id);
      }, 1000);
      
    } catch (error: any) {
      console.error('Erro de login:', error);
      setLoginMessage(`Erro: ${error.message || 'Falha na conexão com o servidor'}`);
      await AsyncStorage.clear();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Coffeemon Battle</Text>
        
        <TextInput
          style={styles.input}
          placeholder="E-mail"
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
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.configButton} 
          onPress={() => setShowServerConfig(!showServerConfig)}
        >
          <Text style={styles.configButtonText}>
            {showServerConfig ? 'Ocultar' : 'Configurar'} Servidor
          </Text>
        </TouchableOpacity>
        
        {showServerConfig && (
          <View style={styles.serverConfig}>
            <Text style={styles.serverLabel}>URL do Servidor (opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder={`Padrão: ${SOCKET_URL}`}
              value={customServerUrl}
              onChangeText={setCustomServerUrl}
              autoCapitalize="none"
            />
          </View>
        )}
        
        {loginMessage ? (
          <Text style={[
            styles.message, 
            loginMessage.includes('Erro') ? styles.errorMessage : styles.successMessage
          ]}>
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
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  configButton: {
    marginTop: 15,
    padding: 10,
  },
  configButtonText: {
    color: '#3498db',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  serverConfig: {
    width: '100%',
    marginTop: 20,
  },
  serverLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 20,
  },
  errorMessage: {
    color: '#e74c3c',
  },
  successMessage: {
    color: '#27ae60',
  },
});