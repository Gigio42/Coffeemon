/**
 * ========================================
 * BATTLE SCREEN - TELA DE BATALHA
 * ========================================
 * 
 * RESPONSABILIDADES DESTA TELA:
 * 1. Escutar eventos de batalha via Socket.IO ("battleUpdate", "battleEnd")
 * 2. Renderizar Coffeemon do jogador e do oponente
 * 3. Exibir HP bars e informações dos Coffeemon
 * 4. Gerenciar ações do jogador (ataques e trocas)
 * 5. Mostrar animações de dano
 * 6. Exibir alerta quando batalha termina
 * 7. Navegar para tela de Matchmaking quando batalha acaba ou jogador foge
 * 
 * IMPORTANTE: Esta tela NÃO depende do App.tsx para lógica de batalha!
 */

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  Alert 
} from 'react-native';
import { Socket } from 'socket.io-client';
import { BattleState, BattleStatus, PlayerState, Coffeemon } from '../types';
import { BASE_IMAGE_URL } from '../utils/config';

interface BattleScreenProps {
  battleId: string;                          // ID único da batalha
  battleState: BattleState;                  // Estado inicial da batalha
  playerId: number;                          // ID do jogador
  socket: Socket;                            // Socket.IO já conectado
  onNavigateToMatchmaking: () => void;       // Callback para voltar ao matchmaking
}

export default function BattleScreen({ 
  battleId, 
  battleState: initialBattleState, 
  playerId, 
  socket,
  onNavigateToMatchmaking 
}: BattleScreenProps) {
  // ========================================
  // ESTADOS LOCAIS
  // ========================================
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);
  const [log, setLog] = useState<string[]>([]);
  const [playerImageUrl, setPlayerImageUrl] = useState<string>('');
  const [opponentImageUrl, setOpponentImageUrl] = useState<string>('');
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);

  // ========================================
  // SETUP DOS EVENTOS DE BATALHA AO INICIAR
  // ========================================
  useEffect(() => {
    setupBattleEvents();
    socket.emit('joinBattle', { battleId });
    updateCoffeemonImages(initialBattleState);
    
    // Cleanup: remove listeners quando componente é desmontado
    return () => {
      socket.off('battleUpdate');
      socket.off('battleEnd');
    };
  }, []);

  /**
   * FUNÇÃO: setupBattleEvents
   * Configura os listeners de eventos Socket.IO:
   * - "battleUpdate": Atualização do estado da batalha a cada turno
   * - "battleEnd": Batalha terminou
   */
  function setupBattleEvents() {
    // Evento: Atualização da batalha (novo turno, ataque, etc)
    socket.on('battleUpdate', (data: any) => {
      addLog(`--- Turno ${data.battleState.turn} ---`);
      setBattleState(data.battleState);
      updateCoffeemonImages(data.battleState);
      
      // Processar eventos do turno (ataques, dano, etc)
      if (data.battleState.events && data.battleState.events.length > 0) {
        data.battleState.events.forEach((event: any) => {
          addLog(event.message);
          if (event.type === 'AttackHit') {
            handleAttackAnimation(event, data.battleState);
          }
        });
      }
      
      // Verificar se batalha terminou
      if (data.battleState.battleStatus === BattleStatus.FINISHED) {
        handleBattleEnd(data.battleState.winnerId);
      }
    });
    
    // Evento: Batalha terminou (evento separado do backend)
    socket.on('battleEnd', (data: any) => {
      console.log('Received battleEnd event:', data);
      handleBattleEnd(data.winnerId);
    });

    // Evento: Erro na batalha
    socket.on('battleError', (data: any) => {
      console.error('Battle error:', data);
      addLog(`Erro: ${data.message}`);
      Alert.alert('Erro na Batalha', data.message);
    });
  }

  /**
   * FUNÇÃO: handleBattleEnd
   * Mostra alerta de fim de jogo e navega para Matchmaking AUTOMATICAMENTE
   * após 3 segundos (não depende do clique do usuário)
   */
  function handleBattleEnd(winnerIdParam: number) {
    console.log('handleBattleEnd called with winnerId:', winnerIdParam);
    
    // Evita processar múltiplas vezes
    if (battleEnded) {
      console.log('Battle already ended, ignoring duplicate call');
      return;
    }

    setBattleEnded(true);
    setWinnerId(winnerIdParam);
    
    const message = `A batalha terminou! Vencedor: Jogador ${winnerIdParam}`;
    addLog(message);
    
    // Mostra alerta (mas não depende dele para navegar)
    Alert.alert('Fim de Jogo', message, [
      { text: 'OK', onPress: () => {
        console.log('User clicked OK on alert');
        onNavigateToMatchmaking();
      }}
    ]);

    // NAVEGAÇÃO AUTOMÁTICA: Volta ao matchmaking após 3 segundos
    // independente se o usuário clicou no alerta ou não
    setTimeout(() => {
      console.log('Auto-navigating back to matchmaking after 3 seconds');
      onNavigateToMatchmaking();
    }, 3000);
  }

  /**
   * FUNÇÃO: addLog
   * Adiciona mensagem ao log da batalha
   */
  /**
   * FUNÇÃO: addLog
   * Adiciona mensagem ao log da batalha
   */
  function addLog(msg: string) {
    console.log('LOG:', msg);
    setLog((prev) => [...prev, msg]);
  }

  /**
   * FUNÇÃO: sendAction
   * Envia uma ação do jogador para o servidor:
   * - "attack": Ataque com um golpe
   * - "switch": Troca de Coffeemon
   */
  function sendAction(actionType: string, payload: any) {
    addLog(`Enviando ação: ${actionType}`);
    socket.emit('battleAction', { battleId, actionType, payload });
  }

  /**
   * FUNÇÃO: updateCoffeemonImages
   * Atualiza as imagens dos Coffeemon baseado no estado da batalha
   * Define qual sprite usar (default, back, hurt, etc)
   */
  function updateCoffeemonImages(state: BattleState) {
    if (!state || !playerId) return;
    
    try {
      const myPlayerState = state.player1Id === playerId ? state.player1 : state.player2;
      const opponentPlayerState = state.player1Id === playerId ? state.player2 : state.player1;
      
      if (myPlayerState && myPlayerState.coffeemons && myPlayerState.coffeemons.length > 0) {
        const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
        if (myActiveMon && myActiveMon.name) {
          setPlayerImageUrl(`${BASE_IMAGE_URL}${myActiveMon.name}/back.png`);
        }
      }
      
      if (opponentPlayerState && opponentPlayerState.coffeemons && opponentPlayerState.coffeemons.length > 0) {
        const opponentActiveMon = opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
        if (opponentActiveMon && opponentActiveMon.name) {
          setOpponentImageUrl(`${BASE_IMAGE_URL}${opponentActiveMon.name}/default.png`);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar imagens dos Coffeemon:', error);
    }
  }

  function handleAttackAnimation(event: any, state: BattleState) {
    if (!event.payload || !playerId) return;
    
    const attackedPlayerId = event.payload.playerId === state.player1Id ? state.player2Id : state.player1Id;
    const targetCoffeemonName = event.payload.targetName;
    
    const hurtImageUrl = `${BASE_IMAGE_URL}${targetCoffeemonName}/hurt.png`;
    let originalImageUrl = '';
    
    if (attackedPlayerId === playerId) {
      originalImageUrl = `${BASE_IMAGE_URL}${targetCoffeemonName}/back.png`;
      setPlayerImageUrl(hurtImageUrl);
      setTimeout(() => setPlayerImageUrl(originalImageUrl), 500);
    } else {
      originalImageUrl = `${BASE_IMAGE_URL}${targetCoffeemonName}/default.png`;
      setOpponentImageUrl(hurtImageUrl);
      setTimeout(() => setOpponentImageUrl(originalImageUrl), 500);
    }
  }

  function renderCoffeemonDisplay(playerState: PlayerState | null, isMe: boolean) {
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
    const imageUrl = isMe ? playerImageUrl : opponentImageUrl;
    const fallbackUrl = 'https://via.placeholder.com/150?text=Image+Not+Found';
    
    return (
      <View style={[styles.coffeemonDisplay, isMe ? styles.playerPosition : styles.opponentPosition]}>
        <Image 
          source={{ uri: imageUrl || fallbackUrl }} 
          style={styles.pokemonImg}
          onError={() => {
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

  function renderAttackButtons(playerState: PlayerState | null, canAct: boolean) {
    if (!playerState || !playerState.coffeemons || playerState.coffeemons.length === 0) {
      return <Text>Aguardando dados do jogador...</Text>;
    }

    const activeMon = playerState.coffeemons[playerState.activeCoffeemonIndex];
    if (!activeMon) {
      return <Text>Nenhum Coffeemon ativo</Text>;
    }

    return (
      <View style={styles.attacksGrid}>
        {activeMon.moves.map((move, idx) => (
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

  function renderPokemonSwitchButtons(playerState: PlayerState | null, canAct: boolean) {
    if (!playerState || !playerState.coffeemons) {
      return null;
    }

    const availablePokemon = playerState.coffeemons.filter(
      (mon, idx) => idx !== playerState.activeCoffeemonIndex && !mon.isFainted
    );

    return (
      <View style={styles.switchGrid}>
        {availablePokemon.slice(0, 4).map((mon, idx) => {
          const imageUrl = `${BASE_IMAGE_URL}${mon.name}/default.png`;
          const hpPercent = (mon.currentHp / mon.maxHp) * 100;
          
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.switchButton,
                !canAct && styles.switchButtonDisabled
              ]}
              onPress={() => {
                const originalIndex = playerState.coffeemons.findIndex((m) => m === mon);
                canAct && sendAction('switch', { newIndex: originalIndex });
              }}
              disabled={!canAct}
            >
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.switchButtonImage}
                resizeMode="contain"
              />
              <Text style={styles.switchButtonName}>{mon.name.toUpperCase()}</Text>
              <View style={styles.switchButtonHpBar}>
                <View style={[
                  styles.switchButtonHpFill,
                  { width: `${hpPercent}%` }
                ]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  if (!battleState || !playerId) {
    return (
      <SafeAreaView style={styles.battleContainer}>
        <Text>Carregando batalha...</Text>
      </SafeAreaView>
    );
  }

  const myPlayerState = battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
  const opponentPlayerState = battleState.player1Id === playerId ? battleState.player2 : battleState.player1;
  const myPlayerTrueId = battleState.player1Id === playerId ? battleState.player1Id : battleState.player2Id;
  const isMyTurn = battleState.currentPlayerId === myPlayerTrueId;

  return (
    <SafeAreaView style={styles.battleContainer}>
      {/* Overlay de Fim de Batalha */}
      {battleEnded && (
        <View style={styles.battleEndOverlay}>
          <View style={styles.battleEndCard}>
            <Text style={styles.battleEndTitle}>🏆 BATALHA TERMINOU! 🏆</Text>
            <Text style={styles.battleEndWinner}>
              Vencedor: Jogador {winnerId}
            </Text>
            <Text style={styles.battleEndSubtext}>
              Voltando ao matchmaking em 3 segundos...
            </Text>
            <TouchableOpacity 
              style={styles.battleEndButton}
              onPress={onNavigateToMatchmaking}
            >
              <Text style={styles.battleEndButtonText}>VOLTAR AGORA</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
          {battleEnded ? 'BATALHA FINALIZADA!' : (isMyTurn ? 'SUA VEZ DE JOGAR!' : 'TURNO DO OPONENTE...')}
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
            onPress={onNavigateToMatchmaking}
          >
            <Text style={styles.runButtonText}>FUGIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  switchButtonDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  switchButtonImage: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  switchButtonName: {
    color: '#333',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  switchButtonHpBar: {
    width: '90%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  switchButtonHpFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
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
  // Estilos do Overlay de Fim de Batalha
  battleEndOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleEndCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  battleEndTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  battleEndWinner: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  battleEndSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  battleEndButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    minWidth: 200,
  },
  battleEndButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
