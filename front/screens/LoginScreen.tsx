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
 * 6. Navegar para tela de Home após login bem-sucedido
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
  SafeAreaView,
  Image,
  ImageBackground,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '../utils/config';

export default function LoginScreen(props: any) {
  const { onNavigateToHome } = props;
  // ========================================
  // ESTADOS LOCAIS
  // ========================================
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // ========================================
  // VERIFICAÇÃO DE AUTENTICAÇÃO AO INICIAR
  // ========================================
  // Verifica se já está autenticado ao abrir a tela
  // Se sim, navega direto para Home
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * FUNÇÃO: checkAuthStatus
   * Verifica se já existe token e playerId salvos no AsyncStorage
   * Se existir, navega automaticamente para Home
   */
  async function checkAuthStatus() {
    try {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedPlayerId = await AsyncStorage.getItem('player_id');
      
      if (storedToken && storedPlayerId) {
        onNavigateToHome(storedToken, parseInt(storedPlayerId));
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
      // Salva token somente se usuário marcou "Lembrar-me"
      if (rememberMe) {
        await AsyncStorage.setItem('jwt_token', token);
      } else {
        // Garante que não fiquem tokens antigos salvos
        await AsyncStorage.removeItem('jwt_token');
      }
      
      setLoginMessage('Usuário autenticado! Buscando dados do jogador...');
      
      // ETAPA 2: Buscar dados do jogador (Player ID)
      const playerResponse = await fetch(`${SOCKET_URL}/game/players/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!playerResponse.ok) {
        throw new Error('Perfil de jogador não encontrado para este usuário.');
      }
      
      const playerData = await playerResponse.json();
      if (rememberMe) {
        await AsyncStorage.setItem('player_id', playerData.id.toString());
      } else {
        await AsyncStorage.removeItem('player_id');
      }
      
      // ETAPA 3: Login bem-sucedido! Navegar para Home
  setLoginMessage(`Login bem-sucedido! Player ID: ${playerData.id}`);
  setTimeout(() => onNavigateToHome(token, playerData.id), 1000);
      
    } catch (error) {
      console.error('Erro de login:', error);
      const errMsg = error instanceof Error ? error.message : String(error || 'Falha na conexão com o servidor');
      setLoginMessage(`Erro: ${errMsg}`);
      await AsyncStorage.clear();
    }
  }

  return (
    <SafeAreaView nativeID="loginScreen" style={[styles.container, styles.bg, styles.loginScreen]}>
        <View nativeID="topLogoWrapper" style={[styles.topLogoWrapper, styles.topLogoWrapperId]}>
          <Image nativeID="logoImage" source={require('../assets/logo.png')} style={[styles.logo, styles.logoImage]} />
          <Text nativeID="appTitle" style={[styles.appTitle, styles.appTitleId]}>Cafémon</Text>
          <Text nativeID="welcomeTitle" style={[styles.welcomeTitle, styles.welcomeTitleId]}>BEM-VINDO DE VOLTA!</Text>
        </View>

        <View nativeID="centerWrapper" style={[styles.centerWrapper, styles.centerWrapperId]}>
          <View nativeID="cardWrapper" style={[styles.cardWrapper, styles.cardWrapperFullBleed, styles.cardWrapperId]}>
            <View nativeID="loginCard" style={[styles.card, styles.loginCard]}>
              <TextInput
                nativeID="emailInput"
                style={[styles.input, styles.emailInput]}
                placeholder="E-mail"
                placeholderTextColor="#9a9a9a"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                nativeID="passwordInput"
                style={[styles.input, styles.passwordInput]}
                placeholder="Senha"
                placeholderTextColor="#9a9a9a"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.rowBetween} nativeID="rowBetween">
                <Pressable
                  nativeID="rememberPressable"
                  style={[styles.rememberRow, styles.rememberPressable]}
                  onPress={() => setRememberMe((v) => !v)}
                >
                  <View nativeID="rememberCheckbox" style={[styles.checkBox, rememberMe && styles.checkBoxChecked, styles.rememberCheckbox]}>
                    {rememberMe ? <Text nativeID="rememberCheckIcon" style={styles.checkIcon}>✓</Text> : null}
                  </View>
                  <Text nativeID="rememberLabel" style={[styles.rememberText, styles.rememberLabel]}>Lembrar-me</Text>
                </Pressable>

                <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Fluxo de recuperação de senha não implementado ainda.') }>
                  <Text nativeID="forgotPasswordText" style={[styles.forgotText, styles.forgotPasswordText]}>Esqueceu senha?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.loginButton, styles.loginBtn]} onPress={handleLogin}>
                <Text nativeID="loginBtnText" style={[styles.loginButtonText, styles.loginBtnText]}>ENTRAR</Text>
              </TouchableOpacity>

              <View nativeID="separatorRow" style={[styles.separatorRow, styles.separatorRowId]}>
                <View nativeID="separatorLeft" style={[styles.separatorLine, styles.separatorLeft]} />
                <Text nativeID="separatorText" style={[styles.separatorText, styles.separatorTextId]}>ou</Text>
                <View nativeID="separatorRight" style={[styles.separatorLine, styles.separatorRight]} />
              </View>

              <TouchableOpacity style={[styles.socialButton, styles.googleBtn]} onPress={() => Alert.alert('Google', 'Login com Google em breve') }>
                <Text nativeID="googleBtnText" style={[styles.socialButtonText, styles.googleBtnText]}>ENTRAR COM Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, styles.facebookButton, styles.facebookBtn]} onPress={() => Alert.alert('Facebook', 'Login com Facebook em breve') }>
                <Text nativeID="facebookBtnText" style={[styles.socialButtonText, styles.facebookBtnText]}>ENTRAR COM FACEBOOK</Text>
              </TouchableOpacity>

              {/* Signup row moved inside the card */}
              <View nativeID="bottomRow" style={[styles.bottomRow, styles.bottomRowId, styles.bottomRowInCard]}>
                <Text nativeID="bottomText" style={[styles.bottomText, styles.bottomTextId]}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={() => Alert.alert('Cadastro', 'Fluxo de cadastro não implementado ainda.') }>
                  <Text nativeID="signUpText" style={[styles.signUpText, styles.signUpTextId]}>Cadastre-se!</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loginMessage ? (
              <Text nativeID="loginMessage" style={[styles.message, styles.loginMessageId, { color: loginMessage.includes('Erro') ? 'red' : 'green' }]}>
                {loginMessage}
              </Text>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  // ...existing code...
  loginButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#E2583E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bg: {
    flex: 1,
    backgroundColor: '#3b2b25',
  },
  centerWrapper: {
    flex: 1,
    // align children to the bottom so the card can sit flush against
    // the bottom edge of the screen area
    justifyContent: 'flex-end',
    alignItems: 'center',
    // internal padding for contents while the wrapper itself remains flush
    paddingHorizontal: 20,
    paddingTop: 20,
    // no extra bottom padding so the card can touch the bottom edge
    paddingBottom: 0,
    position: 'relative',
    // offset the parent's horizontal padding so this wrapper sits flush
    // against the screen edges (match container padding: 16)
    marginHorizontal: -16,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  topLogoWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  appTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'transparent',
    marginBottom: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    // remove horizontal border radius so the card visually touches sides
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 12,
    marginBottom: -15,
    paddingTop: 20,
    paddingBottom: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  // When we want the card to visually touch the left/right edges of the
  // screen while keeping its inner padding, use this style. It offsets the
  // parent horizontal paddings (container + centerWrapper) so the element
  // expands edge-to-edge and blends with the screen background.
  // Apply background color only on the wrapper so the card keeps its
  // own white background, rounded corners and shadow. The negative
  // margin compensates the parent's paddings so the wrapper reaches
  // the screen edges while the card remains centered.
  cardWrapperFullBleed: {
    maxWidth: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // offset the horizontal paddings (16 from container + 20 from
    // centerWrapper paddingHorizontal) so the card can reach the edges.
    marginHorizontal: -36,
    // offset the container's bottom padding so the card can sit flush with
    // the screen bottom
    marginBottom: -20,
  },
  bottomRowPinned: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      }
    }),
  },
  rowBetween: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxChecked: {
    backgroundColor: '#e2583e',
    borderColor: '#e2583e',
  },
  checkIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  rememberText: {
    color: '#666',
    fontSize: 14,
  },
  forgotText: {
    color: '#c66',
    fontSize: 14,
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#999',
  },
  socialButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#2f2f2f',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: '#1f2933',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  bottomText: {
    color: '#666',
  },
  signUpText: {
    color: '#e2583e',
    fontWeight: '700',
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  /* Element-specific aliases (placeholders for easy per-element styling) */
  loginScreen: {},
  topLogoWrapperId: {},
  logoImage: {},
  appTitleId: {},
  welcomeTitleId: {},
  centerWrapperId: {},
  cardWrapperId: {},
  loginCard: {},
  emailInput: {},
  passwordInput: {},
  rememberPressable: {},
  rememberCheckbox: {},
  rememberLabel: {},
  forgotPasswordText: {},
  loginBtn: {},
  loginBtnText: {},
  separatorRowId: {},
  separatorLeft: {},
  separatorRight: {},
  separatorTextId: {},
  googleBtn: {},
  googleBtnText: {},
  facebookBtn: {},
  facebookBtnText: {},
  bottomRowId: {},
  bottomTextId: {},
  signUpTextId: {},
  loginMessageId: {},
  bottomRowInCard: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
});
