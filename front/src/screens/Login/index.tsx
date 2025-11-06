import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import ConfigModal from '../../components/ConfigModal';
import { useAuth } from '../../hooks/useAuth';
import { styles } from './styles';

interface LoginScreenProps {
  onNavigateToMatchmaking: (
    token: string,
    playerId: number,
    userId: number
  ) => void;
}

export default function LoginScreen({
  onNavigateToMatchmaking,
}: LoginScreenProps) {
  const [configVisible, setConfigVisible] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    message,
    isRegistering,
    setIsRegistering,
    handleLogin,
    handleRegister,
    clearCache,
  } = useAuth({ onSuccess: onNavigateToMatchmaking });

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de Configuração */}
      <TouchableOpacity
        style={styles.configButton}
        onPress={() => setConfigVisible(true)}
      >
        <Text style={styles.configButtonText}>⚙️</Text>
      </TouchableOpacity>

      {/* Modal de Configuração */}
      <ConfigModal
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
      />

      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>
          {isRegistering ? 'Criar Conta' : 'Login'}
        </Text>

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            accessibilityLabel="usernameInput"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="emailInput"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="passwordInput"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={isRegistering ? handleRegister : handleLogin}
          accessibilityLabel={isRegistering ? 'registerButton' : 'loginButton'}
        >
          <Text style={styles.loginButtonText}>
            {isRegistering ? 'Criar Conta' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggleMode}
        >
          <Text style={styles.toggleButtonText}>
            {isRegistering
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Registre-se'}
          </Text>
        </TouchableOpacity>

        {message ? (
          <Text
            style={[
              styles.message,
              { color: message.includes('Erro') ? 'red' : 'green' },
            ]}
          >
            {message}
          </Text>
        ) : null}

        {/* Botão para limpar cache (útil na web) */}
        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={styles.clearCacheButton}
            onPress={clearCache}
          >
            <Text style={styles.clearCacheText}>🗑️ Limpar Cache</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
