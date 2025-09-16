import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';

enum BattleStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

interface BattleScreenProps {
  battleState: any;
  battleId: string;
  playerId: number;
  socket: any;
  onBackToMatchmaking: () => void;
  onBattleStateUpdate: (newBattleState: any) => void;
}

export default function BattleScreen({ 
  battleState, 
  battleId, 
  playerId, 
  socket,
  onBackToMatchmaking,
  onBattleStateUpdate 
}: BattleScreenProps) {
  const [log, setLog] = useState<string[]>([]);
  const [playerImageUrl, setPlayerImageUrl] = useState<string>('');
  const [opponentImageUrl, setOpponentImageUrl] = useState<string>('');
  const [currentBattleState, setCurrentBattleState] = useState(battleState);
  const [battleEnded, setBattleEnded] = useState(false);
  const [currentActionMessage, setCurrentActionMessage] = useState<string>('Aguardando primeira ação...');
  const [pendingMessages, setPendingMessages] = useState<string[]>([]);
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Função para mostrar alert que funciona tanto no web quanto no mobile
  const showAlert = (title: string, message: string, onPress: () => void) => {
    if (Platform.OS === 'web') {
      // Para web, usar confirm do browser
      const result = window.confirm(`${title}\n\n${message}\n\nPressione OK para continuar.`);
      if (result) {
        onPress();
      }
    } else {
      // Para mobile, usar Alert nativo
      Alert.alert(title, message, [
        { 
          text: 'OK', 
          onPress: onPress
        }
      ]);
    }
  };

  // Função para processar mensagens de ação com delay
  const processActionMessages = (messages: string[]) => {
    if (messages.length === 0) return;
    
    // Filtrar apenas mensagens relevantes (ataques, efeitos, derrotas)
    const relevantMessages = messages.filter(msg => 
      msg.includes('attacks') || 
      msg.includes('deals') || 
      msg.includes('damage') ||
      msg.includes('affected by') ||
      msg.includes('fainted') ||
      msg.includes('enters the field') ||
      msg.includes('knocked out') ||
      msg.includes('switch') ||
      msg.includes('no longer affected')
    );
    
    if (relevantMessages.length === 0) return;
    
    // Adicionar mensagens ao histórico (mais recentes primeiro)
    setActionHistory(prev => [...relevantMessages.reverse(), ...prev]);
    
    // Mostrar primeira mensagem imediatamente
    setCurrentActionMessage(relevantMessages[0]);
    
    // Mostrar mensagens restantes com delay de 1000ms cada
    relevantMessages.slice(1).forEach((message, index) => {
      setTimeout(() => {
        setCurrentActionMessage(message);
      }, (index + 1) * 1000);
    });
  };

  // Setup dos eventos de batalha quando o componente monta
  useEffect(() => {
    if (socket && battleId) {
      socket.emit('joinBattle', { battleId });
      setupBattleEvents();
      
      // Se já temos battleState, atualizar imagens
      if (battleState) {
        updateCoffeemonImages(battleState);
      }
    }

    return () => {
      // Cleanup dos eventos quando o componente desmonta
      if (socket) {
        socket.off('battleUpdate');
        socket.off('battleEnd');
      }
    };
  }, []);

  // Sincronizar estado local quando prop battleState muda
  useEffect(() => {
    setCurrentBattleState(battleState);
  }, [battleState]);

  function addLog(msg: string) {
    console.log('BATTLE LOG:', msg);
    setLog((prev) => [msg, ...prev]);
  }

  function setupBattleEvents() {
    if (!socket) return;

    socket.on('battleUpdate', (data: any) => {
      console.log('BattleUpdate recebido:', {
        turn: data.battleState.turn,
        status: data.battleState.battleStatus,
        winnerId: data.battleState.winnerId,
        currentPlayerId: data.battleState.currentPlayerId,
        myPlayerId: playerId
      });
      
      // Processar eventos e extrair mensagens relevantes
      const eventMessages: string[] = [];
      
      if (data.battleState.events && data.battleState.events.length > 0) {
        data.battleState.events.forEach((event: any) => {
          addLog(event.message); // Manter log completo para debug
          eventMessages.push(event.message);
          
          if (event.type === 'AttackHit') {
            handleAttackAnimation(event, data.battleState);
          }
          
          // Verificar se algum evento indica fim de batalha
          if (event.type === 'BattleEnd' || event.message?.includes('venceu') || event.message?.includes('perdeu')) {
            console.log('Evento de fim de batalha detectado:', event);
          }
        });
        
        // Processar mensagens com delay apenas se houver eventos
        processActionMessages(eventMessages);
      }
      
      // Atualizar o estado local da batalha
      setCurrentBattleState(data.battleState);
      onBattleStateUpdate(data.battleState);
      
      updateCoffeemonImages(data.battleState);
      
      // Verificação de fim de batalha: verificar se algum jogador perdeu todos os Pokémon
      const player1AllFainted = data.battleState.player1?.coffeemons?.every((mon: any) => mon.isFainted);
      const player2AllFainted = data.battleState.player2?.coffeemons?.every((mon: any) => mon.isFainted);
      
      // Só mostrar alerta se a batalha não foi marcada como encerrada ainda
      if ((player1AllFainted || player2AllFainted) && !battleEnded) {
        console.log('Fim de batalha detectado por Pokémon derrotados:', { 
          player1AllFainted, 
          player2AllFainted,
          battleEnded,
          myPlayerId: playerId,
          player1Id: data.battleState.player1Id,
          player2Id: data.battleState.player2Id
        });
        
        setBattleEnded(true); // Marcar como encerrada para evitar execuções duplicadas
        
        // Determinar se EU sou o vencedor baseado na minha perspectiva
        let isWinner = false;
        if (playerId === data.battleState.player1Id) {
          // Eu sou player1: ganho se player2 perdeu todos e eu não perdi todos
          isWinner = player2AllFainted && !player1AllFainted;
        } else {
          // Eu sou player2: ganho se player1 perdeu todos e eu não perdi todos  
          isWinner = player1AllFainted && !player2AllFainted;
        }
        
        const title = isWinner ? '🎉 VITÓRIA!' : '😔 Derrota';
        const message = isWinner 
          ? 'Parabéns! Você derrotou todos os Pokémon do oponente!' 
          : 'Todos os seus Pokémon foram derrotados!';
        
        addLog(`Fim de batalha - ${isWinner ? 'VITÓRIA' : 'DERROTA'} (Pokémon derrotados)`);
        
        console.log('Mostrando único Alert de fim de batalha:', { title, message, isWinner, playerId });
        
        // Mostrar alert com delay para garantir que a UI está pronta
        setTimeout(() => {
          try {
            showAlert(title, message, () => {
              console.log('Alert OK pressionado - voltando para matchmaking');
              onBackToMatchmaking();
            });
          } catch (error) {
            console.error('Erro ao mostrar Alert:', error);
            // Fallback: voltar diretamente para matchmaking
            setTimeout(() => {
              console.log('Fallback - voltando para matchmaking após erro no Alert');
              onBackToMatchmaking();
            }, 1000);
          }
        }, 100);
        
        return; // Evitar verificação dupla
      }
      
      // Verificação adicional pelo status FINISHED (só se ainda não mostrou alerta)
      if (data.battleState.battleStatus === BattleStatus.FINISHED && !battleEnded) {
        console.log('Batalha finalizada pelo servidor, mas sem alerta duplicado');
        setBattleEnded(true); // Marcar como encerrada
        addLog(`Batalha finalizada pelo servidor`);
        
        // Timeout de segurança para voltar para matchmaking se não houve alerta anterior
        setTimeout(() => {
          console.log('Timeout de segurança - voltando para matchmaking');
          onBackToMatchmaking();
        }, 5000);
      }
    });
    
    socket.on('battleEnd', (data: any) => {
      if (battleEnded) {
        console.log('battleEnd ignorado - batalha já encerrada, alerta já foi mostrado');
        return;
      }
      
      console.log('battleEnd recebido mas alerta já foi tratado pelo battleUpdate');
      addLog(`Evento battleEnd recebido (sem alerta duplicado)`);
      
      // Apenas garantir que volta para matchmaking se necessário
      setTimeout(() => {
        if (!battleEnded) {
          console.log('Timeout de segurança battleEnd - voltando para matchmaking');
          onBackToMatchmaking();
        }
      }, 2000);
    });
  }

  function sendAction(actionType: string, payload: any) {
    // Não mostrar "Enviando ação" na UI, apenas no console para debug
    console.log(`Enviando ação: ${actionType}`, payload);
    if (socket) {  
      socket.emit('battleAction', { battleId, actionType, payload });
    }
  }

  // Atualiza as URLs das imagens dos Pokémon
  function updateCoffeemonImages(state: any) {
    if (!state || !playerId) return;
    
    try {
      const myPlayerState = state.player1Id === playerId ? state.player1 : state.player2;
      const opponentPlayerState = state.player1Id === playerId ? state.player2 : state.player1;
      
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
    if (!event.payload || !playerId) return;
    
    const attackedPlayerId = event.payload.playerId === state.player1Id ? state.player2Id : state.player1Id;
    const targetCoffeemonName = event.payload.targetName;
    const baseUrl = 'https://gigio42.github.io/Coffeemon/';
    
    const hurtImageUrl = `${baseUrl}${targetCoffeemonName}/hurt.png`;
    let originalImageUrl = '';
    
    if (attackedPlayerId === playerId) {
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

  // Função para renderizar os botões de ataque
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

  // Função para renderizar os botões de troca de Pokémon
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

  if (!currentBattleState || !playerId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando batalha...</Text>
        <Text>BattleState: {currentBattleState ? 'OK' : 'NULL'}</Text>
        <Text>MyPlayerId: {playerId ? playerId : 'NULL'}</Text>
      </SafeAreaView>
    );
  }

  const myPlayerState = currentBattleState.player1Id === playerId ? currentBattleState.player1 : currentBattleState.player2;
  const opponentPlayerState = currentBattleState.player1Id === playerId ? currentBattleState.player2 : currentBattleState.player1;
  const myPlayerTrueId = currentBattleState.player1Id === playerId ? currentBattleState.player1Id : currentBattleState.player2Id;
  const isMyTurn = currentBattleState.currentPlayerId === myPlayerTrueId;

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

      {/* Log da ação atual */}
      <View style={styles.actionLogContainer}>
        <Text style={styles.actionLogText}>
          {currentActionMessage}
        </Text>
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setShowHistoryPanel(!showHistoryPanel)}
        >
          <Text style={styles.expandIcon}>
            {showHistoryPanel ? '▼' : '▲'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Painel de histórico expandível */}
      {showHistoryPanel && (
        <View style={styles.historyPanel}>
          <Text style={styles.historyTitle}>Histórico da Batalha</Text>
          <ScrollView style={styles.historyScrollView} showsVerticalScrollIndicator={true}>
            {actionHistory.length === 0 ? (
              <Text style={styles.historyEmptyText}>Nenhuma ação registrada ainda</Text>
            ) : (
              actionHistory.map((action, index) => (
                <Text key={index} style={styles.historyItem}>
                  {action}
                </Text>
              ))
            )}
          </ScrollView>
        </View>
      )}

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
            onPress={onBackToMatchmaking}
          >
            <Text style={styles.runButtonText}>FUGIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f5ed',
    padding: 16,
  },
  battleContainer: {
    flex: 1,
    backgroundColor: '#f9f5ed',
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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLogText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    paddingRight: 40,
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
  expandButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  historyPanel: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  historyScrollView: {
    maxHeight: 150,
  },
  historyEmptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  historyItem: {
    fontSize: 13,
    color: '#444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 2,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
});