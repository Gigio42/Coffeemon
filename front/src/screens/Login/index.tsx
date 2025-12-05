import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ConfigModal from '../../components/ConfigModal';
import { useAuth } from '../../hooks/useAuth';
import { styles } from './styles';
import { pixelArt } from '../../theme';

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
  const [isPressed, setIsPressed] = useState(false);

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

  const isError = message.toLowerCase().includes('erro') || message.toLowerCase().includes('falha');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#fdfbf7', '#f5f2e8', '#e6dec5']}
        style={[styles.safeArea, { position: 'absolute', width: '100%', height: '100%' }]}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Botão de Configuração (Engrenagem) */}
        <View style={styles.configButtonContainer}>
          <TouchableOpacity
            style={styles.configButton}
            onPress={() => setConfigVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.configIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <ConfigModal
          visible={configVisible}
          onClose={() => setConfigVisible(false)}
        />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.loginCard}>
              
              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.logoIcon}>☕</Text>
                <Text style={styles.appTitle}>COFFEEMON</Text>
                <Text style={styles.appSubtitle}>Tactics & Tastes</Text>
              </View>

              {/* Formulário */}
              <View style={styles.formContainer}>
                <Text style={{ 
                  ...pixelArt.typography.pixelSubtitle, 
                  textAlign: 'center', 
                  marginBottom: 10,
                  color: pixelArt.colors.textDark 
                }}>
                  {isRegistering ? 'NOVA CONTA' : 'LOGIN'}
                </Text>

                {isRegistering && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>NOME DE TREINADOR</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: AshKetchum"
                      placeholderTextColor="#999"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>SENHA</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isPressed && pixelArt.buttons.primaryPressed
                  ]}
                  onPressIn={() => setIsPressed(true)}
                  onPressOut={() => setIsPressed(false)}
                  onPress={isRegistering ? handleRegister : handleLogin}
                  activeOpacity={1}
                >
                  <Text style={styles.loginButtonText}>
                    {isRegistering ? 'CRIAR AVENTURA' : 'ENTRAR'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Toggle Login/Register */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={handleToggleMode}
              >
                <Text style={styles.toggleButtonText}>
                  {isRegistering
                    ? 'Já tem uma conta? Voltar para Login'
                    : 'Ainda não tem conta? Criar agora'}
                </Text>
              </TouchableOpacity>

              {/* Mensagem de Feedback */}
              {message ? (
                <View style={[
                  styles.messageContainer,
                  { backgroundColor: isError ? '#ffebeb' : '#e8f5e9' }
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: isError ? pixelArt.colors.error : pixelArt.colors.success }
                  ]}>
                    {message}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>v1.0.0 Alpha • Coffeemon Studio</Text>
              {Platform.OS === 'web' && (
                <TouchableOpacity
                  style={styles.clearCacheButton}
                  onPress={clearCache}
                >
                  <Text style={[styles.footerText, { textDecorationLine: 'underline' }]}>
                    Limpar Cache
                  </Text>
                </TouchableOpacity>
              )}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}