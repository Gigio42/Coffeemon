/**
 * ========================================
 * APP.TSX - GERENCIADOR DE NAVEGAÇÃO
 * ========================================
 * 
 * Este arquivo é APENAS responsável por:
 * 1. Gerenciar qual tela está sendo exibida (LOGIN, HOME, MATCHMAKING ou BATTLE)
 * 2. Armazenar dados compartilhados entre telas (authData, battleData)
 * 3. Fornecer callbacks para navegação entre telas
 * 
 * IMPORTANTE: Este arquivo NÃO contém lógica de negócio!
 * Toda a lógica está nas respectivas páginas:
 * - LoginScreen.tsx: Login, autenticação, verificação de auth
 * - HomeScreen.tsx: Home do sistema de pedidos, navegação para jogo
 * - MatchmakingScreen.tsx: Socket, procurar partida, logout
 * - BattleScreen.tsx: Batalha, ataques, troca de pokémon
 */

import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import BattleScreen from './screens/BattleScreen';
import { Screen, BattleState } from './types';

export default function App() {
  // ========================================
  // ESTADOS GLOBAIS (compartilhados entre telas)
  // ========================================
  
  // Controla qual tela está sendo exibida
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  
  // Dados de autenticação (token JWT e ID do jogador)
  // Usado por: HomeScreen, MatchmakingScreen e BattleScreen
  const [authData, setAuthData] = useState<{ token: string; playerId: number } | null>(null);
  
  // Dados da batalha (ID da batalha, estado e socket)
  // Usado por: BattleScreen
  const [battleData, setBattleData] = useState<{ 
    battleId: string; 
    battleState: BattleState; 
    socket: Socket 
  } | null>(null);

  // ========================================
  // RENDERIZAÇÃO BASEADA NA TELA ATUAL
  // ========================================
  
  switch (currentScreen) {
    // ====================================
    // TELA DE LOGIN
    // ====================================
    case Screen.LOGIN:
      return (
        <LoginScreen 
          // Callback chamado quando o LOGIN é bem-sucedido
          // A LoginScreen faz TODA a lógica de login internamente:
          // - Validação de campos
          // - Requisição HTTP para /auth/login
          // - Busca dados do jogador em /game/players/me
          // - Salva token e playerId no AsyncStorage
          // - Verifica se já está logado (checkAuthStatus)
          onNavigateToHome={(token: string, playerId: number) => {
            setAuthData({ token, playerId });
            setCurrentScreen(Screen.HOME);
          }}
        />
      );
      
    // ====================================
    // TELA HOME (Sistema de Pedidos)
    // ====================================
    case Screen.HOME:
      // Validação: Se não tem authData, volta pro login
      if (!authData) {
        setCurrentScreen(Screen.LOGIN);
        return null;
      }
      return (
        <HomeScreen 
          // Passa dados de autenticação para a tela
          authData={authData}
          token={authData.token}
          playerId={authData.playerId}
          
          // Callback para navegar para Matchmaking (jogo)
          onNavigateToMatchmaking={(token: string, playerId: number) => {
            setAuthData({ token, playerId });
            setCurrentScreen(Screen.MATCHMAKING);
          }}
          
          // Callback para logout
          onNavigateToLogin={() => {
            setAuthData(null);
            setBattleData(null);
            setCurrentScreen(Screen.LOGIN);
          }}
        />
      );
      
    // ====================================
    // TELA DE MATCHMAKING (Procurar Partida)
    // ====================================
    case Screen.MATCHMAKING:
      // Validação: Se não tem authData, volta pro login
      if (!authData) {
        setCurrentScreen(Screen.LOGIN);
        return null;
      }
      return (
        <MatchmakingScreen 
          // Passa dados de autenticação para a tela
          token={authData.token}
          playerId={authData.playerId}
          
          // Callback chamado quando o usuário quer VOLTAR PARA HOME
          onNavigateToHome={() => {
            setCurrentScreen(Screen.HOME);
          }}
          
          // Callback chamado quando o usuário faz LOGOUT
          // A MatchmakingScreen faz TODA a lógica de logout:
          // - Limpa AsyncStorage
          // - Desconecta socket
          onNavigateToLogin={() => {
            setAuthData(null);
            setBattleData(null);
            setCurrentScreen(Screen.LOGIN);
          }}
          
          // Callback chamado quando uma PARTIDA É ENCONTRADA
          // A MatchmakingScreen faz TODA a lógica de matchmaking:
          // - Conecta ao socket.io
          // - Envia evento "findMatch"
          // - Escuta evento "matchFound"
          onNavigateToBattle={(battleId: string, battleState: BattleState, socket: Socket) => {
            setBattleData({ battleId, battleState, socket });
            setCurrentScreen(Screen.BATTLE);
          }}
        />
      );
      
    // ====================================
    // TELA DE BATALHA
    // ====================================
    case Screen.BATTLE:
      // Validação: Se não tem battleData ou authData, volta pro login
      if (!battleData || !authData) {
        setCurrentScreen(Screen.LOGIN);
        return null;
      }
      return (
        <BattleScreen 
          // Passa dados da batalha e autenticação para a tela
          battleId={battleData.battleId}
          battleState={battleData.battleState}
          playerId={authData.playerId}
          socket={battleData.socket}
          
          // Callback chamado quando a BATALHA TERMINA ou usuário FOGE
          // A BattleScreen faz TODA a lógica da batalha:
          // - Escuta eventos "battleUpdate" e "battleEnd"
          // - Renderiza Coffeemon dos jogadores
          // - Gerencia ataques e trocas
          // - Mostra animações
          // - Exibe alerta quando batalha acaba
          onNavigateToMatchmaking={() => {
            setBattleData(null);
            setCurrentScreen(Screen.MATCHMAKING);
          }}
        />
      );
      
    // ====================================
    // FALLBACK (caso padrão)
    // ====================================
    default:
      return (
        <LoginScreen 
          onNavigateToHome={(token: string, playerId: number) => {
            setAuthData({ token, playerId });
            setCurrentScreen(Screen.HOME);
          }}
        />
      );
  }
}
