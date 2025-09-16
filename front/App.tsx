import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import BattleScreen from './screens/BattleScreen';

enum Screen {
  LOGIN = 'LOGIN',
  MATCHMAKING = 'MATCHMAKING',
  BATTLE = 'BATTLE'
}

export default function App() {
  // Estados básicos de navegação
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [token, setToken] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [customServerUrl, setCustomServerUrl] = useState('');
  
  // Estados da Batalha
  const [battleState, setBattleState] = useState<any>(null);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);

  // Verificação de autenticação na inicialização
  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedPlayerId = await AsyncStorage.getItem('player_id');
      
      if (storedToken && storedPlayerId) {
        setToken(storedToken);
        setPlayerId(parseInt(storedPlayerId));
        setCurrentScreen(Screen.MATCHMAKING);
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      await AsyncStorage.clear();
    }
  }

  // Callback do login bem-sucedido
  function handleLoginSuccess(newToken: string, newPlayerId: number) {
    setToken(newToken);
    setPlayerId(newPlayerId);
    setCurrentScreen(Screen.MATCHMAKING);
  }

  // Callback quando partida é encontrada
  function handleMatchFound(newBattleId: string, newBattleState: any, newSocket: any) {
    setBattleId(newBattleId);
    setBattleState(newBattleState);
    setSocket(newSocket);
    setCurrentScreen(Screen.BATTLE);
  }

  // Callback de logout
  async function handleLogout() {
    await AsyncStorage.clear();
    setToken(null);
    setPlayerId(null);
    setBattleState(null);
    setBattleId(null);
    setCurrentScreen(Screen.LOGIN);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }

  // Callback para voltar ao matchmaking
  function handleBackToMatchmaking() {
    setBattleState(null);
    setBattleId(null);
    setCurrentScreen(Screen.MATCHMAKING);
  }

  // Callback para atualizar o estado da batalha
  function handleBattleStateUpdate(newBattleState: any) {
    setBattleState(newBattleState);
  }

  // Renderização baseada na tela atual
  switch (currentScreen) {
    case Screen.LOGIN:
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      
    case Screen.MATCHMAKING:
      if (!token || !playerId) {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      }
      return (
        <MatchmakingScreen
          token={token}
          playerId={playerId}
          customServerUrl={customServerUrl}
          onMatchFound={handleMatchFound}
          onLogout={handleLogout}
        />
      );
      
    case Screen.BATTLE:
      if (!battleState || !battleId || !playerId || !socket) {
        setCurrentScreen(Screen.MATCHMAKING);
        return (
          <MatchmakingScreen
            token={token!}
            playerId={playerId!}
            customServerUrl={customServerUrl}
            onMatchFound={handleMatchFound}
            onLogout={handleLogout}
          />
        );
      }
      return (
        <BattleScreen
          battleState={battleState}
          battleId={battleId}
          playerId={playerId}
          socket={socket}
          onBackToMatchmaking={handleBackToMatchmaking}
          onBattleStateUpdate={handleBattleStateUpdate}
        />
      );
      
    default:
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }
}