import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Linking,
  StyleSheet,
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
  onBackToStore?: () => void;
}

export default function LoginScreen({
  onNavigateToMatchmaking,
  onBackToStore,
}: LoginScreenProps) {
  const [configVisible, setConfigVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isGuestPressed, setIsGuestPressed] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    termsAccepted,
    setTermsAccepted,
    message,
    isRegistering,
    setIsRegistering,
    handleLogin,
    handleRegister,
    handleGuest,
    clearCache,
  } = useAuth({ onSuccess: onNavigateToMatchmaking });

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername('');
    setEmail('');
    setPassword('');
    setTermsAccepted(false);
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

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Barra superior — padrão espresso */}
        <View style={styles.topBar}>
          {onBackToStore ? (
            <TouchableOpacity style={styles.topBarButton} onPress={onBackToStore} activeOpacity={0.75}>
              <Image source={require('../../../assets/iconsv2/back.png')} style={styles.topBarIcon} resizeMode="contain" />
              <Text style={styles.topBarButtonText}>Loja</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.topBarPlaceholder} />
          )}

          <TouchableOpacity style={styles.topBarButton} onPress={() => setConfigVisible(true)} activeOpacity={0.75}>
            <Image source={require('../../../assets/iconsv2/global-network.png')} style={styles.topBarIcon} resizeMode="contain" />
            <Text style={styles.topBarButtonText}>Servidor</Text>
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

                {isRegistering && (
                  <TouchableOpacity
                    style={loginStyles.termsRow}
                    onPress={() => setTermsAccepted(!termsAccepted)}
                    activeOpacity={0.8}
                  >
                    <View style={[loginStyles.checkbox, termsAccepted && loginStyles.checkboxChecked]}>
                      {termsAccepted && <Text style={loginStyles.checkmark}>✓</Text>}
                    </View>
                    <Text style={loginStyles.termsText}>
                      Li e aceito os{' '}
                      <Text
                        style={loginStyles.termsLink}
                        onPress={(e) => {
                          e.stopPropagation();
                          Linking.openURL('https://gigio42.github.io/Coffeemon/termos/');
                        }}
                      >
                        Termos de Uso
                      </Text>
                      {' '}e a{' '}
                      <Text
                        style={loginStyles.termsLink}
                        onPress={(e) => {
                          e.stopPropagation();
                          Linking.openURL('https://gigio42.github.io/Coffeemon/privacidade/');
                        }}
                      >
                        Política de Privacidade
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isPressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }
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

              {/* Botão Guest */}
              {!isRegistering && (
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isGuestPressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                    { marginTop: 8, backgroundColor: '#5D4037' }
                  ]}
                  onPressIn={() => setIsGuestPressed(true)}
                  onPressOut={() => setIsGuestPressed(false)}
                  onPress={handleGuest}
                  activeOpacity={1}
                >
                  <Text style={styles.loginButtonText}>☕ JOGAR SEM CONTA</Text>
                </TouchableOpacity>
              )}

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

const loginStyles = StyleSheet.create({
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8B4513',
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#8B4513',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: '#5C2E0A',
    lineHeight: 17,
  },
  termsLink: {
    color: '#8B4513',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
});