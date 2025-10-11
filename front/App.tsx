import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const SOCKET_URL = getServerUrl();

enum Screen {
  LOGIN = 'LOGIN',
  MATCHMAKING = 'MATCHMAKING',
  BATTLE = 'BATTLE'
}

enum BattleStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export default function App() {
  // Estados básicos
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [token, setToken] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<number | null>(null);
  const [socket, setSocket] = useState<any>(null);
  
  // Estados da Batalha
  const [battleState, setBattleState] = useState<any>(null);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  
  // Estados do Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [customServerUrl, setCustomServerUrl] = useState('');
  const [showServerConfig, setShowServerConfig] = useState(false);
  
  // Estados do Matchmaking
  const [matchStatus, setMatchStatus] = useState<string>('');
  
  // Estados das imagens dos Pokémon (para animações)
  const [playerImageUrl, setPlayerImageUrl] = useState<string>('');
  const [opponentImageUrl, setOpponentImageUrl] = useState<string>('');

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
        setMyPlayerId(parseInt(storedPlayerId));
        setCurrentScreen(Screen.MATCHMAKING);
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      await AsyncStorage.clear();
    }
  }

  // Função de Login
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
      setToken(token);
      
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
      setMyPlayerId(playerData.id);
      
      setLoginMessage(`Login bem-sucedido! Player ID: ${playerData.id}`);
      setTimeout(() => setCurrentScreen(Screen.MATCHMAKING), 1000);
      
    } catch (error: any) {
      console.error('Erro de login:', error);
      setLoginMessage(`Erro: ${error.message || 'Falha na conexão com o servidor'}`);
      await AsyncStorage.clear();
    }
  }

  // Função de Logout
  async function handleLogout() {
    await AsyncStorage.clear();
    setToken(null);
    setMyPlayerId(null);
    setBattleState(null);
    setBattleId(null);
    setLog([]);
    setCurrentScreen(Screen.LOGIN);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }

  // Setup do Socket para Matchmaking
  useEffect(() => {
    console.log('useEffect triggered - currentScreen:', currentScreen, 'token:', !!token, 'myPlayerId:', myPlayerId, 'socket:', !!socket);
    if ((currentScreen === Screen.MATCHMAKING || currentScreen === Screen.BATTLE) && token && myPlayerId && !socket) {
      console.log('Setting up socket...');
      setupSocket(token, myPlayerId);
    }
  }, [currentScreen, token, myPlayerId, socket]);

  function setupSocket(t: string, pid: number) {
    console.log('Setting up socket with token:', t, 'playerId:', pid);
    const serverUrl = customServerUrl.trim() || SOCKET_URL;
    const s = io(serverUrl, {
      extraHeaders: { Authorization: `Bearer ${t}` },
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
      setBattleId(data.battleId);
      setBattleState(data.battleState);
      
      // Só tenta atualizar imagens se o battleState estiver completo
      if (data.battleState && data.battleState.player1 && data.battleState.player2) {
        updateCoffeemonImages(data.battleState);
      } else {
        console.log('BattleState incomplete, skipping image update');
      }
      
      console.log('About to change screen to BATTLE');
      
      // Pequeno delay para garantir que os estados sejam atualizados
      setTimeout(() => {
        setCurrentScreen(Screen.BATTLE);
        console.log('Screen changed to BATTLE');
      }, 100);
    });

    setupBattleEvents(s);
  }

  function setupBattleEvents(s: any) {
    s.on('battleUpdate', (data: any) => {
      addLog(`--- Turno ${data.battleState.turn} ---`);
      setBattleState(data.battleState);
      updateCoffeemonImages(data.battleState);
      
      if (data.battleState.events && data.battleState.events.length > 0) {
        data.battleState.events.forEach((event: any) => {
          addLog(event.message);
          if (event.type === 'AttackHit') {
            handleAttackAnimation(event, data.battleState);
          }
        });
      }
      
      if (data.battleState.battleStatus === BattleStatus.FINISHED) {
        const message = `A batalha terminou! Vencedor: Jogador ${data.battleState.winnerId}`;
        addLog(message);
        Alert.alert('Fim de Jogo', message, [
          { text: 'OK', onPress: () => setCurrentScreen(Screen.MATCHMAKING) }
        ]);
      }
    });
    
    s.on('battleEnd', (data: any) => {
      const message = `A batalha terminou! Vencedor: Jogador ${data.winnerId}`;
      addLog(message);
      Alert.alert('Fim de Jogo', message, [
        { text: 'OK', onPress: () => setCurrentScreen(Screen.MATCHMAKING) }
      ]);
    });
  }

  function findMatch() {
    addLog('Enviando evento "findMatch"...');
    setMatchStatus('Procurando...');
    if (socket) {
      socket.emit('findMatch');
    }
  }

  // Setup da Batalha quando entrar na tela
  useEffect(() => {
    if (currentScreen === Screen.BATTLE && battleId && socket) {
      socket.emit('joinBattle', { battleId });
    }
  }, [currentScreen, battleId, socket]);

  function addLog(msg: string) {
    console.log('LOG:', msg);
    setLog((prev) => [msg, ...prev]);
  }

  function sendAction(actionType: string, payload: any) {
    addLog(`Enviando ação: ${actionType}`);
    if (socket) {
      socket.emit('battleAction', { battleId, actionType, payload });
    }
  }

  // Atualiza as URLs das imagens dos Pokémon
  function updateCoffeemonImages(state: any) {
    if (!state || !myPlayerId) return;
    
    try {
      const myPlayerState = state.player1Id === myPlayerId ? state.player1 : state.player2;
      const opponentPlayerState = state.player1Id === myPlayerId ? state.player2 : state.player1;
      
      const baseUrl = 'https://gigio42.github.io/Coffeemon/';
      
      if (myPlayerState && myPlayerState.coffeemons && myPlayerState.coffeemons.length > 0) {
        const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
        if (myActiveMon && myActiveMon.name) {
          setPlayerImageUrl(`${baseUrl}${myActiveMon.name}/back.png`);
        }
      }
      
      if (opponentPlayerState && opponentPlayerState.coffeemons && opponentPlayerState.coffeemons.length > 0) {
        const opponentActiveMon = opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
        if (opponentActiveMon && opponentActiveMon.name) {
          setOpponentImageUrl(`${baseUrl}${opponentActiveMon.name}/default.png`);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar imagens dos Coffeemon:', error);
      addLog('Erro ao carregar imagens dos Pokémon');
    }
  }

  // Lida com animação de ataque (mostrar imagem hurt)
  function handleAttackAnimation(event: any, state: any) {
    if (!event.payload || !myPlayerId) return;
    
    const attackedPlayerId = event.payload.playerId === state.player1Id ? state.player2Id : state.player1Id;
    const targetCoffeemonName = event.payload.targetName;
    const baseUrl = 'https://gigio42.github.io/Coffeemon/';
    
    const hurtImageUrl = `${baseUrl}${targetCoffeemonName}/hurt.png`;
    let originalImageUrl = '';
    
    if (attackedPlayerId === myPlayerId) {
      // Meu Pokémon foi atacado
      originalImageUrl = `${baseUrl}${targetCoffeemonName}/back.png`;
      setPlayerImageUrl(hurtImageUrl);
      setTimeout(() => setPlayerImageUrl(originalImageUrl), 500);
    } else {
      // Pokémon do oponente foi atacado
      originalImageUrl = `${baseUrl}${targetCoffeemonName}/default.png`;
      setOpponentImageUrl(hurtImageUrl);
      setTimeout(() => setOpponentImageUrl(originalImageUrl), 500);
    }
  }

  // Renderização dos status dos jogadores e Pokémon
  function renderCoffeemonDisplay(playerState: any, isMe: boolean) {
    if (!playerState || !playerState.coffeemons || playerState.coffeemons.length === 0) {
      return (
        <View style={[styles.coffeemonDisplay, isMe ? styles.playerPosition : styles.opponentPosition]}>
          <Text style={styles.pokemonName}>Aguardando Coffeemon...</Text>
        </View>
      );
    }
    
    const activeMon = playerState.coffeemons[playerState.activeCoffeemonIndex];
    if (!activeMon) {
      return (
        <View style={[styles.coffeemonDisplay, isMe ? styles.playerPosition : styles.opponentPosition]}>
          <Text style={styles.pokemonName}>Coffeemon não encontrado</Text>
        </View>
      );
    }
    
    const hpPercent = (activeMon.currentHp / activeMon.maxHp) * 100;
    
    // Usar as URLs de imagem controladas por estado para animações
    const imageUrl = isMe ? playerImageUrl : opponentImageUrl;
    const fallbackUrl = 'https://via.placeholder.com/150?text=Image+Not+Found';
    
    return (
      <View style={[styles.coffeemonDisplay, isMe ? styles.playerPosition : styles.opponentPosition]}>
        <Image 
          source={{ uri: imageUrl || fallbackUrl }} 
          style={styles.pokemonImg}
          onError={() => {
            // Fallback se a imagem não carregar
            if (isMe) {
              setPlayerImageUrl(fallbackUrl);
            } else {
              setOpponentImageUrl(fallbackUrl);
            }
          }}
        />
        <Text style={styles.pokemonName}>
          {activeMon.name} {activeMon.isFainted ? '(Derrotado)' : ''}
        </Text>
        <View style={styles.hpBarContainer}>
          <View style={[
            styles.hpBar, 
            { 
              width: `${hpPercent}%`, 
              backgroundColor: isMe ? '#3498db' : '#e74c3c' 
            }
          ]}>
            <Text style={styles.hpText}>{activeMon.currentHp}/{activeMon.maxHp}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Renderização dos botões de golpes e troca
  function renderActions(playerState: any, isMe: boolean, canControl: boolean) {
    if (!playerState || !playerState.coffeemons || playerState.coffeemons.length === 0) {
      return (
        <Text style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Aguardando Coffeemon do jogador...
        </Text>
      );
    }
    
    const activeMon = playerState.coffeemons[playerState.activeCoffeemonIndex];
    if (!activeMon) {
      return (
        <Text style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Coffeemon não encontrado
        </Text>
      );
    }
    return (
      <>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Golpes</Text>
        <View style={styles.movesGrid}>
          <View style={styles.movesRow}>
            {activeMon.moves.slice(0, 2).map((move: any, idx: number) => (
              <TouchableOpacity
                key={move.id}
                style={[styles.moveBtn, idx === 0 ? styles.fireMove : null, (!canControl || !activeMon.canAct) && styles.disabledBtn]}
                onPress={() => canControl && activeMon.canAct && sendAction('attack', { moveId: move.id })}
                disabled={!canControl || !activeMon.canAct}
              >
                <Text style={styles.moveText}>{move.name} <Text style={styles.movePp}>{move.power}</Text></Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.movesRow}>
            {activeMon.moves.slice(2, 4).map((move: any, idx: number) => (
              <TouchableOpacity
                key={move.id}
                style={[styles.moveBtn, (!canControl || !activeMon.canAct) && styles.disabledBtn]}
                onPress={() => canControl && activeMon.canAct && sendAction('attack', { moveId: move.id })}
                disabled={!canControl || !activeMon.canAct}
              >
                <Text style={styles.moveText}>{move.name} <Text style={styles.movePp}>{move.power}</Text></Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>Equipe</Text>
        <View style={styles.movesRow}>
          {playerState.coffeemons.map((mon: any, idx: number) => {
            if (idx === playerState.activeCoffeemonIndex) return null;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.actionBtn, (mon.isFainted || !canControl) && styles.disabledBtn]}
                onPress={() => canControl && !mon.isFainted && sendAction('switch', { newIndex: idx })}
                disabled={mon.isFainted || !canControl}
              >
                <Text style={styles.actionText}>{mon.name} ({mon.currentHp}/{mon.maxHp})</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  }

  // Função para renderizar os botões de ataque no novo layout
  function renderAttackButtons(playerState: any, canAct: boolean) {
    if (!playerState || !playerState.coffeemons || playerState.coffeemons.length === 0) {
      return <Text>Aguardando dados do jogador...</Text>;
    }

    const activeMon = playerState.coffeemons[playerState.activeCoffeemonIndex];
    if (!activeMon) {
      return <Text>Nenhum Coffeemon ativo</Text>;
    }

    return (
      <View style={styles.attacksGrid}>
        {activeMon.moves.map((move: any, idx: number) => (
          <TouchableOpacity
            key={move.id}
            style={[
              styles.attackButton,
              idx === 0 ? styles.fireAttackButton : styles.normalAttackButton,
              !canAct && styles.attackButtonDisabled
            ]}
            onPress={() => canAct && sendAction('attack', { moveId: move.id })}
            disabled={!canAct}
          >
            <View style={styles.attackButtonContent}>
              <View style={[styles.attackTypeIcon, idx === 0 ? styles.fireTypeIcon : styles.normalTypeIcon]} />
              <Text style={styles.attackButtonText}>{move.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Função para renderizar os botões de troca de Pokémon no novo layout
  function renderPokemonSwitchButtons(playerState: any, canAct: boolean) {
    if (!playerState || !playerState.coffeemons) {
      return null;
    }

    const availablePokemon = playerState.coffeemons.filter(
      (mon: any, idx: number) => idx !== playerState.activeCoffeemonIndex && !mon.isFainted
    );

    return (
      <View style={styles.switchGrid}>
        {availablePokemon.slice(0, 4).map((mon: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.switchButton,
              !canAct && styles.switchButtonDisabled
            ]}
            onPress={() => {
              const originalIndex = playerState.coffeemons.findIndex((m: any) => m === mon);
              canAct && sendAction('switch', { newIndex: originalIndex });
            }}
            disabled={!canAct}
          >
            <Text style={styles.switchButtonName}>{mon.name.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // Renderizar tela de Login
  function renderLoginScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Login</Text>
          <Text style={[styles.message, { color: '#666', fontSize: 12 }]}>
            Servidor: {customServerUrl.trim() || SOCKET_URL}
          </Text>
          
          <TouchableOpacity 
            style={styles.configButton}
            onPress={() => setShowServerConfig(!showServerConfig)}
          >
            <Text style={styles.configButtonText}>
              {showServerConfig ? 'Ocultar' : 'Configurar'} Servidor
            </Text>
          </TouchableOpacity>
          
          {showServerConfig && (
            <TextInput
              style={styles.input}
              placeholder="URL do Servidor (ex: http://192.168.1.100:3000)"
              value={customServerUrl}
              onChangeText={setCustomServerUrl}
              autoCapitalize="none"
            />
          )}
          
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

  // Renderizar tela de Matchmaking
  function renderMatchmakingScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.matchmakingContainer}>
          <Text style={styles.matchTitle}>Procurar Partida</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>User ID: {myPlayerId}</Text>
            <Text style={styles.infoText}>Socket ID: {socket?.id || 'Desconectado'}</Text>
            <Text style={styles.infoText}>Status: {matchStatus || 'Conectado'}</Text>
          </View>
          
          <TouchableOpacity style={styles.findMatchButton} onPress={findMatch}>
            <Text style={styles.findMatchButtonText}>Procurar Partida</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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

  // Renderizar tela de Batalha
  function renderBattleScreen() {
    console.log('Rendering battle screen. BattleState:', battleState, 'MyPlayerId:', myPlayerId);
    
    if (!battleState || !myPlayerId) {
      return (
        <SafeAreaView style={styles.container}>
          <Text>Carregando batalha...</Text>
          <Text>BattleState: {battleState ? 'OK' : 'NULL'}</Text>
          <Text>MyPlayerId: {myPlayerId ? myPlayerId : 'NULL'}</Text>
        </SafeAreaView>
      );
    }

    const myPlayerState = battleState.player1Id === myPlayerId ? battleState.player1 : battleState.player2;
    const opponentPlayerState = battleState.player1Id === myPlayerId ? battleState.player2 : battleState.player1;
    const myPlayerTrueId = battleState.player1Id === myPlayerId ? battleState.player1Id : battleState.player2Id;
    const opponentPlayerTrueId = battleState.player1Id === myPlayerId ? battleState.player2Id : battleState.player1Id;
    const isMyTurn = battleState.currentPlayerId === myPlayerTrueId;

    return (
      <SafeAreaView style={styles.battleContainer}>
        {/* Nome do oponente */}
        <View style={styles.opponentNameContainer}>
          <Text style={styles.opponentNameText}>Nome do oponente NV.</Text>
        </View>

        {/* Área da Batalha com Pokémon */}
        <View style={styles.battleArena}>
          {renderCoffeemonDisplay(myPlayerState, true)}
          {renderCoffeemonDisplay(opponentPlayerState, false)}
        </View>

        {/* Log do turno atual */}
        <View style={[
          styles.turnLogContainer,
          isMyTurn ? styles.myTurnContainer : styles.opponentTurnContainer
        ]}>
          <Text style={styles.turnLogText}>
            {isMyTurn ? 'SUA VEZ DE JOGAR!' : 'TURNO DO OPONENTE...'}
          </Text>
        </View>

        {/* Log da última ação */}
        <View style={styles.actionLogContainer}>
          <Text style={styles.actionLogText}>
            {log.length > 0 ? log[log.length - 1] : 'Aguardando primeira ação...'}
          </Text>
        </View>

        {/* Área de ações do jogador */}
        <View style={styles.battleActionsContainer}>
          {/* Ataques do Pokémon ativo */}
          <View style={styles.attacksContainer}>
            {renderAttackButtons(myPlayerState, isMyTurn)}
          </View>

          {/* Pokémon disponíveis para troca */}
          <View style={styles.pokemonSwitchContainer}>
            {renderPokemonSwitchButtons(myPlayerState, isMyTurn)}
          </View>

          {/* Botões Mochila e Fugir */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.bagButton} disabled>
              <Text style={styles.bagButtonText}>MOCHILA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.runButton} 
              onPress={() => setCurrentScreen(Screen.MATCHMAKING)}
            >
              <Text style={styles.runButtonText}>FUGIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Renderização principal baseada na tela atual
  switch (currentScreen) {
    case Screen.LOGIN:
      return renderLoginScreen();
    case Screen.MATCHMAKING:
      return renderMatchmakingScreen();
    case Screen.BATTLE:
      return renderBattleScreen();
    default:
      return renderLoginScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f5ed',
    padding: 16,
  },
  battleArena: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#a2e2b9',
    borderRadius: 15,
    marginVertical: 16,
  },
  coffeemonDisplay: {
    position: 'absolute',
    alignItems: 'center',
    padding: 15,
    minWidth: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  playerPosition: {
    bottom: 20,
    left: 20,
  },
  opponentPosition: {
    top: 20,
    right: 20,
  },
  pokemonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  hpBarContainer: {
    width: '100%',
    height: 22,
    backgroundColor: '#ccc',
    borderRadius: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#999',
  },
  hpBar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  hpText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pokemonImg: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  currentPlayerHighlight: {
    borderWidth: 2,
    borderColor: '#2ecc71',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  logContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 16,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  movesGrid: {
    marginVertical: 8,
  },
  movesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moveBtn: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  fireMove: {
    backgroundColor: '#e05a3c',
  },
  disabledBtn: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  moveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  movePp: {
    fontWeight: 'normal',
    fontSize: 12,
  },
  actionBtn: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 4,
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
    color: '#333',
  },
  playerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 8,
    color: '#3498db',
  },
  opponentTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 8,
    color: '#e74c3c',
  },
  // Estilos do Login
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
  configButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  configButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  // Estilos do Matchmaking
  matchmakingContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  findMatchButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  findMatchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    maxWidth: 300,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Novos estilos para o layout da batalha
  battleContainer: {
    flex: 1,
    backgroundColor: '#f9f5ed',
  },
  opponentNameContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  opponentNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  turnLogContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
  },
  myTurnContainer: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  opponentTurnContainer: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
  },
  turnLogText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  actionLogContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    minHeight: 50,
    justifyContent: 'center',
  },
  actionLogText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  battleActionsContainer: {
    backgroundColor: '#e8e8e8',
    padding: 16,
    flex: 1,
  },
  attacksContainer: {
    marginBottom: 16,
  },
  attacksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  attackButton: {
    width: '48%',
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 60,
  },
  fireAttackButton: {
    backgroundColor: '#4CAF50',
  },
  normalAttackButton: {
    backgroundColor: '#4CAF50',
  },
  attackButtonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  attackButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attackTypeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  fireTypeIcon: {
    backgroundColor: '#FF6B6B',
  },
  normalTypeIcon: {
    backgroundColor: '#74C0FC',
  },
  attackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  pokemonSwitchContainer: {
    marginBottom: 16,
  },
  switchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  switchButton: {
    width: '48%',
    backgroundColor: '#666',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  switchButtonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  switchButtonName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  bagButton: {
    width: '48%',
    backgroundColor: '#666',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  bagButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  runButton: {
    width: '48%',
    backgroundColor: '#666',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
