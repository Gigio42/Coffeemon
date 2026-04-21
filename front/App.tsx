import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Socket } from 'socket.io-client';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import * as NavigationBar from 'expo-navigation-bar';

import LoginScreen from './src/screens/Login';
import EcommerceScreen from './src/screens/Ecommerce';
import MatchmakingScreen from './src/screens/Matchmaking';
import BattleScreen from './src/screens/Battle';
import { clearActiveBattleStorage } from './src/hooks/useMatchmaking';
import ErrorBoundary from './src/components/ErrorBoundary';
import { Screen, BattleState } from './src/types';
import { MainNavScreen } from './src/screens/MainNav';
import { ThemeProvider } from './src/theme/ThemeContext';
import { clearAuthData } from './src/api/authService';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PressStart2P_400Regular,
  });

  useEffect(() => {
    const configureImmersiveMode = async () => {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
      } catch (e) {
        console.log("Erro ao configurar modo imersivo:", e);
      }
    };
    configureImmersiveMode();
  }, []);

  // App começa no ecommerce — login só é necessário para o jogo
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ECOMMERCE);

  const [authData, setAuthData] = useState<{ token: string; playerId: number; userId: number; isGuest?: boolean } | null>(null);

  const decodeIsGuest = (token: string): boolean => {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64))?.isGuest === true;
    } catch { return false; }
  };

  const [battleData, setBattleData] = useState<{
    battleId: string;
    battleState: BattleState;
    socket: Socket
  } | null>(null);

  const handleLogout = async () => {
    await clearAuthData();
    setAuthData(null);
    setBattleData(null);
    setCurrentScreen(Screen.ECOMMERCE);
  };

  const getStatusBarConfig = () => ({ style: "light" as const, backgroundColor: "#0F1419" });
  const statusBarConfig = getStatusBarConfig();

  const renderScreen = () => {
    switch (currentScreen) {

    // ====================================
    // TELA DE E-COMMERCE (Loja) — pública, não requer login
    // ====================================
    case Screen.ECOMMERCE:
      return (
        <EcommerceScreen
          token={authData?.token}
          userId={authData?.userId}

          // Botão central "Jogar": se logado vai direto ao jogo, se não vai ao login
          onNavigateToGame={() => {
            if (authData) {
              setCurrentScreen(Screen.MATCHMAKING);
            } else {
              setCurrentScreen(Screen.LOGIN);
            }
          }}

          onLogout={() => {
            void handleLogout();
          }}
        />
      );

    // ====================================
    // TELA DE LOGIN — apenas para entrar no jogo
    // ====================================
    case Screen.LOGIN:
      return (
        <LoginScreen
          // Após login/registro/demo → vai direto ao jogo
          onNavigateToMatchmaking={(token, playerId, userId) => {
            setAuthData({ token, playerId, userId, isGuest: decodeIsGuest(token) });
            setCurrentScreen(Screen.MATCHMAKING);
          }}
          // Botão "← Loja" para voltar sem fazer login
          onBackToStore={() => setCurrentScreen(Screen.ECOMMERCE)}
        />
      );

    // ====================================
    // TELA DE MATCHMAKING (Jogo) — requer login
    // ====================================
    case Screen.MATCHMAKING:
      if (!authData) {
        setCurrentScreen(Screen.LOGIN);
        return null;
      }
      return (
        <MainNavScreen
          token={authData.token}
          playerId={authData.playerId}
          userId={authData.userId}
          isGuest={authData.isGuest}

          onNavigateToLogin={() => {
            void handleLogout();
          }}
          onNavigateToLoginScreen={() => {
            setCurrentScreen(Screen.LOGIN);
          }}

          onNavigateToBattle={(battleId, battleState, socket) => {
            setBattleData({ battleId, battleState, socket });
            setCurrentScreen(Screen.BATTLE);
          }}

          onNavigateToEcommerce={() => {
            setCurrentScreen(Screen.ECOMMERCE);
          }}

          MatchmakingScreen={MatchmakingScreen}
        />
      );

    // ====================================
    // TELA DE BATALHA — requer login + batalha ativa
    // ====================================
    case Screen.BATTLE:
      if (!battleData || !authData) {
        setCurrentScreen(Screen.MATCHMAKING);
        return null;
      }
      return (
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Battle screen crashed:', error, errorInfo);
          }}
          onReset={() => {
            battleData.socket.disconnect();
            setBattleData(null);
            setCurrentScreen(Screen.MATCHMAKING);
          }}
        >
          <BattleScreen
            battleId={battleData.battleId}
            battleState={battleData.battleState}
            playerId={authData.playerId}
            token={authData.token}
            socket={battleData.socket}

            onNavigateToMatchmaking={(keepActiveBattle) => {
              if (!keepActiveBattle) void clearActiveBattleStorage();
              battleData.socket.disconnect();
              setBattleData(null);
              setCurrentScreen(Screen.MATCHMAKING);
            }}
          />
        </ErrorBoundary>
      );

    default:
      return null;
    }
  };

  if (fontError) {
    console.error('Failed to load Press Start 2P font', fontError);
  }

  if (!fontsLoaded) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0d0d' }}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <StatusBar
              style={statusBarConfig.style}
              backgroundColor={statusBarConfig.backgroundColor}
              translucent={false}
            />
            {renderScreen()}
          </View>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
