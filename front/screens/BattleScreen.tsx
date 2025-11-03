import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Socket } from 'socket.io-client';
import { BattleState, BattleStatus, PlayerState, Coffeemon } from '../types';

interface BattleEvent {
  type: string;
  message: string;
  payload?: any;
}
import { BASE_IMAGE_URL } from '../utils/config';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scenarioImages = {
  default: require('../assets/scenarios/field.png'),
  forest: require('../assets/scenarios/forest.png'),
  city: require('../assets/scenarios/city.png'),
};

type ScenarioName = keyof typeof scenarioImages;

function getScenarioImage(scenarioName?: ScenarioName) {
  if (scenarioName && scenarioImages[scenarioName]) {
    return scenarioImages[scenarioName];
  }
  return scenarioImages.default;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

interface BattleScreenProps {
  battleId: string;
  battleState: any;
  playerId: number;
  socket: Socket;
  onNavigateToMatchmaking: () => void;
}

function useBattleAnimations() {
  const playerPosition = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
  };
  const opponentPosition = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
  };
  const arenaShake = {
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
  };

  const playerAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: playerPosition.translateX.value },
      { translateY: playerPosition.translateY.value },
    ],
    opacity: playerPosition.opacity.value,
  }));

  const opponentAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: opponentPosition.translateX.value },
      { translateY: opponentPosition.translateY.value },
    ],
    opacity: opponentPosition.opacity.value,
  }));

  const arenaWobble = useAnimatedStyle(() => ({
    transform: [
      { translateX: arenaShake.translateX.value },
      { translateY: arenaShake.translateY.value },
    ],
  }));

  const playLunge = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    const distance = isPlayer ? 40 : -40;
    return new Promise((resolve) => {
      anim.translateX.value = withSequence(
        withTiming(distance, { duration: 150 }),
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) resolve(true);
        })
      );
    });
  };

  const playShake = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    return new Promise((resolve) => {
      anim.translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 }, (finished) => {
          if (finished) resolve(true);
        })
      );
    });
  };

  const playCritShake = () => {
    return new Promise((resolve) => {
      arenaShake.translateX.value = withSequence(
        withTiming(-15, { duration: 60 }),
        withTiming(15, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(0, { duration: 60 }, (finished) => {
          if (finished) resolve(true);
        })
      );
    });
  };

  const playFaint = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    return new Promise((resolve) => {
      anim.translateY.value = withTiming(50, { duration: 500 });
      anim.opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) resolve(true);
      });
    });
  };

  const playSwitchIn = (isPlayer: boolean) => {
    const anim = isPlayer ? playerPosition : opponentPosition;
    anim.translateY.value = 0;
    anim.opacity.value = 0;
    return new Promise((resolve) => {
      anim.opacity.value = withTiming(1, { duration: 300 }, (finished) => {
        if (finished) resolve(true);
      });
    });
  };

  const reset = () => {
    playerPosition.translateX.value = 0;
    playerPosition.translateY.value = 0;
    playerPosition.opacity.value = 1;
    opponentPosition.translateX.value = 0;
    opponentPosition.translateY.value = 0;
    opponentPosition.opacity.value = 1;
  };

  return {
    playerAnimStyle,
    opponentAnimStyle,
    arenaWobble,
    playLunge,
    playShake,
    playCritShake,
    playFaint,
    playSwitchIn,
    reset,
  };
}

const AnimatedHealthBar = React.memo(
  ({ currentHp, maxHp }: { currentHp: number; maxHp: number }) => {
    const hp = useSharedValue(currentHp);
    const hpPercent = useSharedValue((currentHp / maxHp) * 100);

    useEffect(() => {
      hp.value = withTiming(currentHp, { duration: 400 });
      hpPercent.value = withTiming(maxHp > 0 ? (currentHp / maxHp) * 100 : 0, {
        duration: 400,
      });
    }, [currentHp, maxHp]);

    const animatedHpBar = useAnimatedStyle(() => {
      const width = Math.max(0, hpPercent.value);
      const color = interpolateColor(
        width,
        [0, 20, 50, 100],
        ['#e74c3c', '#e74c3c', '#f1c40f', '#2ecc71']
      );
      return {
        width: `${width}%`,
        backgroundColor: color,
      };
    });

    return (
      <View style={styles.hudHpBarContainer}>
        <View style={styles.hudHpBarBackground}>
          <AnimatedView style={[styles.hudHpBarFill, animatedHpBar]} />
        </View>
        <Text style={styles.hudHpText}>
          {Math.floor(hp.value)}/{maxHp}
        </Text>
      </View>
    );
  }
);

export default function BattleScreen({
  battleId,
  battleState: initialBattleData,
  playerId,
  socket,
  onNavigateToMatchmaking,
}: BattleScreenProps) {
  const extractedBattleState = initialBattleData?.battleState || initialBattleData;
  const [battleState, setBattleState] = useState<BattleState>(extractedBattleState);
  const [log, setLog] = useState<string[]>([]);
  const [playerImageUrl, setPlayerImageUrl] = useState<string>('');
  const [opponentImageUrl, setOpponentImageUrl] = useState<string>('');
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const logScrollRef = useRef<ScrollView>(null);
  const battleStateRef = useRef<BattleState>(battleState);
  const popupOpacity = useSharedValue(0);

  const {
    playerAnimStyle,
    opponentAnimStyle,
    arenaWobble,
    playLunge,
    playShake,
    playCritShake,
    playFaint,
    playSwitchIn,
    reset: resetAnimations,
  } = useBattleAnimations();

  useEffect(() => {
    battleStateRef.current = battleState;
  }, [battleState]);

  useEffect(() => {
    setupBattleEvents();
    socket.emit('joinBattle', { battleId });
    updateCoffeemonImages(extractedBattleState);
    if (extractedBattleState.turnPhase === 'SELECTION') {
      const myState =
        extractedBattleState.player1Id === playerId
          ? extractedBattleState.player1
          : extractedBattleState.player2;
      if (myState && !myState.hasSelectedCoffeemon) {
        setShowSelectionModal(true);
      }
    }

    return () => {
      socket.off('battleUpdate');
      socket.off('battleEnd');
      socket.off('battleError');
      socket.off('opponentDisconnected');
      socket.off('playerReconnected');
      socket.off('battleCancelled');
    };
  }, []);

  const getBaseName = (name: string) => {
    if (!name) return '';
    return name.split(' (Lvl')[0];
  };

  const addLog = (msg: string) => {
    if (msg) {
      setLog((prev) => [...prev, msg]);
    }
  };

  const showPopup = (message: string) => {
    return new Promise((resolve) => {
      if (!message) {
        resolve(true);
        return;
      }
      setPopupMessage(message);
      popupOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(
          1200,
          withTiming(0, { duration: 200 }, (finished) => {
            if (finished) {
              setPopupMessage(null);
              resolve(true);
            }
          })
        )
      );
    });
  };

  const playAnimationForEvent = async (event: BattleEvent, fullState: BattleState) => {
    const payload = event.payload || {};
    const myPlayerState =
      fullState.player1Id === playerId ? fullState.player1 : fullState.player2;
    const isPlayerAttacker = payload.playerId === playerId;

    const activeMonName =
      myPlayerState && myPlayerState.activeCoffeemonIndex !== null
        ? getBaseName(myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex].name)
        : '';

    const isPlayerTarget = payload.targetName === activeMonName;

    switch (event.type) {
      case 'ATTACK_HIT':
        await playLunge(isPlayerAttacker);
        await playShake(!isPlayerAttacker);
        break;
      case 'ATTACK_CRIT':
        await playLunge(isPlayerAttacker);
        await playCritShake();
        await playShake(!isPlayerAttacker);
        break;
      case 'ATTACK_MISS':
      case 'ATTACK_BLOCKED':
        await playLunge(isPlayerAttacker);
        break;
      case 'COFFEEMON_FAINTED':
        await playFaint(isPlayerTarget);
        break;
      case 'SWITCH_SUCCESS':
        resetAnimations();
        await playSwitchIn(payload.playerId === playerId);
        break;
      case 'STATUS_DAMAGE':
        await playShake(isPlayerTarget);
        break;
      default:
        await new Promise((r) => setTimeout(r, 200));
        break;
    }
  };

  const processEventSequence = async (events: BattleEvent[], fullState: BattleState) => {
    for (const event of events) {
      addLog(event.message);
      const animationPromise = playAnimationForEvent(event, fullState);
      const popupPromise = showPopup(event.message);

      await Promise.all([animationPromise, popupPromise]);
    }
  };

  function setupBattleEvents() {
    socket.on('battleUpdate', async (data: any) => {
      console.log('Received battleUpdate:', data);
      if (!data || !data.battleState) {
        console.error('Invalid battleUpdate data');
        return;
      }

      setIsProcessing(true);
      const newBattleState = data.battleState;

      await processEventSequence(newBattleState.events || [], newBattleState);

      setBattleState(newBattleState);
      updateCoffeemonImages(newBattleState);

      if (newBattleState.turnPhase === 'SELECTION') {
        const myState =
          newBattleState.player1Id === playerId ? newBattleState.player1 : newBattleState.player2;
        if (myState && !myState.hasSelectedCoffeemon) {
          setShowSelectionModal(true);
        } else {
          setShowSelectionModal(false);
          if (!isProcessing) addLog('Aguardando oponente selecionar Coffeemon...');
        }
      } else {
        setShowSelectionModal(false);
      }

      if (newBattleState.battleStatus === BattleStatus.FINISHED) {
        handleBattleEnd(newBattleState.winnerId);
      }

      setIsProcessing(false);
    });

    socket.on('battleEnd', (data: any) => {
      console.log('Received battleEnd event:', data);
      handleBattleEnd(data.winnerId);
    });

    socket.on('battleError', (data: any) => {
      console.error('Battle error:', data.message);
      addLog(`Erro: ${data.message}`);
    });

    socket.on('opponentDisconnected', (data: any) => {
      addLog('Oponente desconectou da batalha');
    });

    socket.on('playerReconnected', (data: any) => {
      addLog('Oponente reconectou à batalha');
    });

    socket.on('battleCancelled', (data: any) => {
      addLog('Batalha cancelada pelo servidor');
      onNavigateToMatchmaking();
    });
  }

  function handleBattleEnd(winnerIdParam: number) {
    if (battleEnded || battleStateRef.current.battleStatus === BattleStatus.FINISHED) {
      return;
    }

    setBattleEnded(true);
    setWinnerId(winnerIdParam);
    addLog(`A batalha terminou! Vencedor: Jogador ${winnerIdParam}`);

    setTimeout(() => {
      onNavigateToMatchmaking();
    }, 4000);
  }

  function sendAction(actionType: string, payload: any) {
    socket.emit('battleAction', { battleId, actionType, payload });
  }

  function selectInitialCoffeemon(coffeemonIndex: number) {
    socket.emit('selectInitialCoffeemon', {
      battleId,
      coffeemonIndex,
    });
    setShowSelectionModal(false);
  }

  function updateCoffeemonImages(state: BattleState) {
    if (!state || !playerId) return;

    try {
      const myPlayerState = state.player1Id === playerId ? state.player1 : state.player2;
      const opponentPlayerState =
        state.player1Id === playerId ? state.player2 : state.player1;

      if (myPlayerState && myPlayerState.activeCoffeemonIndex !== null) {
        const myActiveMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
        if (myActiveMon && myActiveMon.name) {
          setPlayerImageUrl(`${BASE_IMAGE_URL}${getBaseName(myActiveMon.name)}/back.png`);
        }
      } else {
        setPlayerImageUrl('');
      }

      if (opponentPlayerState && opponentPlayerState.activeCoffeemonIndex !== null) {
        const opponentActiveMon =
          opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
        if (opponentActiveMon && opponentActiveMon.name) {
          setOpponentImageUrl(
            `${BASE_IMAGE_URL}${getBaseName(opponentActiveMon.name)}/default.png`
          );
        }
      } else {
        setOpponentImageUrl('');
      }
    } catch (error) {
      console.error('Erro ao atualizar imagens dos Coffeemon:', error);
    }
  }

  function renderCoffeemonSprite(imageUrl: string, isMe: boolean) {
    const animationStyle = isMe ? playerAnimStyle : opponentAnimStyle;
    const fallbackUrl = 'https://via.placeholder.com/150?text=Image+Not+Found';

    return (
      <AnimatedView
        style={[
          styles.coffeemonSpriteContainer,
          isMe ? styles.playerSpritePosition : styles.opponentSpritePosition,
          animationStyle,
        ]}
      >
        <AnimatedImage
          source={{ uri: imageUrl || fallbackUrl }}
          style={styles.pokemonImg}
          onError={() => {
            if (isMe) setPlayerImageUrl(fallbackUrl);
            else setOpponentImageUrl(fallbackUrl);
          }}
        />
      </AnimatedView>
    );
  }

  function renderHud(playerState: PlayerState | null, isMe: boolean) {
    const activeMon =
      playerState && playerState.activeCoffeemonIndex !== null
        ? playerState.coffeemons[playerState.activeCoffeemonIndex]
        : null;

    const containerStyle = isMe ? styles.playerHudContainer : styles.opponentHudContainer;

    if (!activeMon) {
      return <View style={[styles.hudInfoBox, containerStyle, { opacity: 0 }]} />;
    }

    return (
      <View style={[styles.hudInfoBox, containerStyle]}>
        <Text style={styles.hudName}>{activeMon.name}</Text>
        <AnimatedHealthBar currentHp={activeMon.currentHp} maxHp={activeMon.maxHp} />
      </View>
    );
  }

  function renderAttackButtons(playerState: PlayerState | null, canAct: boolean) {
    if (!playerState || playerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeMon = playerState.coffeemons[playerState.activeCoffeemonIndex];
    if (!activeMon) return null;

    return (
      <View style={styles.attacksGrid}>
        {activeMon.moves.map((move, idx) => (
          <TouchableOpacity
            key={move.id}
            style={[styles.attackButton, !canAct && styles.attackButtonDisabled]}
            onPress={() => canAct && sendAction('attack', { moveId: move.id })}
            disabled={!canAct}
          >
            <View style={styles.attackButtonContent}>
              <View style={[styles.attackTypeIcon]} />
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
          const imageUrl = `${BASE_IMAGE_URL}${getBaseName(mon.name)}/default.png`;
          const hpPercent = (mon.currentHp / mon.maxHp) * 100;

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.switchButton, !canAct && styles.switchButtonDisabled]}
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
                <View style={[styles.switchButtonHpFill, { width: `${hpPercent}%` }]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function renderGamifiedLog(canAct: boolean, myPendingAction: any) {
    const statusText = battleEnded
      ? 'BATALHA FINALIZADA!'
      : isProcessing
      ? 'PROCESSANDO...'
      : myPendingAction
      ? 'AGUARDANDO OPONENTE...'
      : canAct
      ? 'SUA VEZ DE JOGAR!'
      : 'RESOLVENDO TURNO...';

    const statusStyle = canAct
      ? styles.logStatusTurn
      : isProcessing
      ? styles.logStatusResolving
      : myPendingAction || battleEnded
      ? styles.logStatusWait
      : styles.logStatusResolving;

    return (
      <View style={styles.gamifiedLogContainer}>
        <Text style={[styles.logStatusText, statusStyle]}>{statusText}</Text>
        <View style={styles.logSeparator} />
        <ScrollView
          ref={logScrollRef}
          style={styles.logScrollView}
          onContentSizeChange={() => logScrollRef.current?.scrollToEnd({ animated: true })}
          persistentScrollbar={true}
        >
          {log.length === 0 && <Text style={styles.logText}>Aguardando primeira ação...</Text>}
          {log.slice(-4).map((msg, index) => (
            <Text key={index} style={styles.logText}>
              {`> ${msg}`}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  }

  function renderPopupMessage() {
    const popupStyle = useAnimatedStyle(() => {
      return {
        opacity: popupOpacity.value,
        transform: [{ scale: popupOpacity.value * 0.9 + 0.1 }],
      };
    });

    return (
      <AnimatedView style={[styles.popupContainer, popupStyle]}>
        <Text style={styles.popupText}>{popupMessage}</Text>
      </AnimatedView>
    );
  }

  if (!battleState || !playerId) {
    return (
      <SafeAreaView style={styles.battleContainer}>
        <Text>Carregando batalha...</Text>
      </SafeAreaView>
    );
  }

  const myPlayerState =
    battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
  const opponentPlayerState =
    battleState.player1Id === playerId ? battleState.player2 : battleState.player1;

  const myPendingAction = battleState.pendingActions?.[playerId];
  const canAct =
    !battleEnded &&
    !isProcessing &&
    !myPendingAction &&
    battleState.turnPhase === 'SUBMISSION';

  return (
    <SafeAreaView style={styles.battleContainer}>
      {battleEnded && (
        <View style={styles.battleEndOverlay}>
          <View style={styles.battleEndCard}>
            <Text style={styles.battleEndTitle}>🏆 BATALHA TERMINOU! 🏆</Text>
            <Text style={styles.battleEndWinner}>
              Vencedor: {winnerId === playerId ? 'VOCÊ' : 'Oponente'}
            </Text>
            <Text style={styles.battleEndSubtext}>Voltando ao matchmaking...</Text>
            <TouchableOpacity style={styles.battleEndButton} onPress={onNavigateToMatchmaking}>
              <Text style={styles.battleEndButtonText}>VOLTAR AGORA</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <AnimatedImageBackground
        source={getScenarioImage('default')}
        style={[styles.battleArena, arenaWobble]}
        resizeMode="cover"
      >
        {renderCoffeemonSprite(playerImageUrl, true)}
        {renderCoffeemonSprite(opponentImageUrl, false)}

        {renderHud(myPlayerState, true)}
        {renderHud(opponentPlayerState, false)}

        {renderPopupMessage()}
      </AnimatedImageBackground>

      <View style={styles.battleActionsContainer}>
        {renderGamifiedLog(canAct, myPendingAction)}

        <View style={styles.attacksContainer}>
          {renderAttackButtons(myPlayerState, canAct)}
        </View>

        <View style={styles.pokemonSwitchContainer}>
          {renderPokemonSwitchButtons(myPlayerState, canAct)}
        </View>

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.bagButton} disabled>
            <Text style={styles.bagButtonText}>MOCHILA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.runButton}
            onPress={onNavigateToMatchmaking}
            disabled={battleEnded}
          >
            <Text style={styles.runButtonText}>FUGIR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showSelectionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha seu Coffeemon Inicial</Text>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.teamColumn}>
                <Text style={styles.teamColumnTitle}>Sua Equipe</Text>
                {myPlayerState?.coffeemons?.map((mon: Coffeemon, index: number) => {
                  const imageUrl = `${BASE_IMAGE_URL}${getBaseName(mon.name)}/default.png`;
                  const isFainted = mon.isFainted || mon.currentHp <= 0;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.teamCard, isFainted && styles.teamCardDisabled]}
                      onPress={() => !isFainted && selectInitialCoffeemon(index)}
                      disabled={isFainted}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.teamCardImage}
                        resizeMode="contain"
                      />
                      <View style={styles.teamCardInfo}>
                        <Text style={styles.teamCardName}>{mon.name}</Text>
                        <Text style={styles.teamCardHp}>
                          HP: {mon.currentHp}/{mon.maxHp}
                          {isFainted && ' (Derrotado)'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.teamColumn}>
                <Text style={styles.teamColumnTitle}>Equipe do Oponente</Text>
                {opponentPlayerState?.coffeemons?.map((mon: Coffeemon, index: number) => {
                  const imageUrl = `${BASE_IMAGE_URL}${getBaseName(mon.name)}/default.png`;
                  return (
                    <View key={index} style={[styles.teamCard, styles.teamCardOpponent]}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.teamCardImage}
                        resizeMode="contain"
                      />
                      <View style={styles.teamCardInfo}>
                        <Text style={styles.teamCardName}>{mon.name}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  battleContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  battleArena: {
    position: 'relative',
    width: '100%',
    flex: 1.1,
    overflow: 'hidden',
  },
  coffeemonSpriteContainer: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerSpritePosition: {
    bottom: '5%',
    right: '5%',
  },
  opponentSpritePosition: {
    top: '10%',
    left: '5%',
  },
  pokemonImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  hudInfoBox: {
    position: 'absolute',
    width: '45%',
    padding: 8,
    backgroundColor: 'rgba(40, 40, 40, 0.85)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  playerHudContainer: {
    top: '5%',
    right: '5%',
  },
  opponentHudContainer: {
    bottom: '5%',
    left: '5%',
  },
  hudName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  hudHpBarContainer: {
    width: '100%',
  },
  hudHpBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#111',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  hudHpBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  hudHpText: {
    position: 'absolute',
    right: 6,
    top: -2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  popupContainer: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  popupText: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
  },
  gamifiedLogContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 12,
    minHeight: 110,
    maxHeight: 110,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  logStatusTurn: {
    color: '#2ecc71',
  },
  logStatusWait: {
    color: '#f39c12',
  },
  logStatusResolving: {
    color: '#e74c3c',
  },
  logSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
  },
  logScrollView: {
    flex: 1,
  },
  logText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  battleActionsContainer: {
    backgroundColor: '#3b3b3b',
    padding: 16,
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: '#555',
    minHeight: 400,
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
    backgroundColor: '#FF6B6B',
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
    backgroundColor: '#e74c3c',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 500,
  },
  teamColumn: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  teamColumnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
  },
  teamCardOpponent: {
    backgroundColor: '#f8f9fa',
  },
  teamCardImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  teamCardInfo: {
    flex: 1,
  },
  teamCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teamCardHp: {
    fontSize: 14,
    color: '#666',
  },
});