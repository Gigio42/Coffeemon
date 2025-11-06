import React, { useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Socket } from 'socket.io-client';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useBattleAnimations } from '../../hooks/useBattleAnimations';
import { useBattle } from '../../hooks/useBattle';
import { getBaseName, getScenarioImage } from '../../utils/battleUtils';
import { BASE_IMAGE_URL } from '../../utils/config';
import { Coffeemon } from '../../types';
import BattleHUD from '../../components/Battle/BattleHUD';
import BattleLog from '../../components/Battle/BattleLog';
import SelectionModal from '../../components/Battle/SelectionModal';
import { styles } from './styles';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

interface BattleScreenProps {
  battleId: string;
  battleState: any;
  playerId: number;
  socket: Socket;
  onNavigateToMatchmaking: () => void;
}

export default function BattleScreen({
  battleId,
  battleState: initialBattleData,
  playerId,
  socket,
  onNavigateToMatchmaking,
}: BattleScreenProps) {
  const logScrollRef = useRef<ScrollView>(null);

  const animations = useBattleAnimations();
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
  } = animations;

  const battle = useBattle({
    battleId,
    initialBattleState: initialBattleData,
    playerId,
    socket,
    onNavigateToMatchmaking,
    animationHandlers: {
      playLunge,
      playShake,
      playCritShake,
      playFaint,
      playSwitchIn,
      reset: resetAnimations,
    },
  });

  const {
    battleState,
    log,
    playerImageUrl,
    opponentImageUrl,
    battleEnded,
    winnerId,
    showSelectionModal,
    isProcessing,
    popupMessage,
    popupOpacity,
    myPlayerState,
    opponentPlayerState,
    myPendingAction,
    canAct,
    sendAction,
    selectInitialCoffeemon,
  } = battle;

  const popupStyle = useAnimatedStyle(() => {
    return {
      opacity: popupOpacity.value,
      transform: [{ scale: popupOpacity.value * 0.9 + 0.1 }],
    };
  });

  const renderCoffeemonSprite = (imageUrl: string, isMe: boolean) => {
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
        />
      </AnimatedView>
    );
  };

  const renderAttackButtons = () => {
    if (!myPlayerState || myPlayerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
    if (!activeMon) return null;

    return (
      <View style={styles.attacksGrid}>
        {activeMon.moves.map((move: any) => (
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
  };

  const renderPokemonSwitchButtons = () => {
    if (!myPlayerState || !myPlayerState.coffeemons) {
      return null;
    }

    const availablePokemon = myPlayerState.coffeemons.filter(
      (mon: any, idx: number) => idx !== myPlayerState.activeCoffeemonIndex && !mon.isFainted
    );

    return (
      <View style={styles.switchGrid}>
        {availablePokemon.slice(0, 4).map((mon: any, idx: number) => {
          const imageUrl = `${BASE_IMAGE_URL}${getBaseName(mon.name)}/default.png`;
          const hpPercent = (mon.currentHp / mon.maxHp) * 100;

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.switchButton, !canAct && styles.switchButtonDisabled]}
              onPress={() => {
                const originalIndex = myPlayerState.coffeemons.findIndex((m: any) => m === mon);
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
  };

  const renderGamifiedLog = () => {
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
  };

  const renderPopupMessage = () => {
    return (
      <AnimatedView style={[styles.popupContainer, popupStyle]}>
        <Text style={styles.popupText}>{popupMessage}</Text>
      </AnimatedView>
    );
  };

  if (!battleState || !playerId) {
    return (
      <SafeAreaView style={styles.battleContainer}>
        <Text>Carregando batalha...</Text>
      </SafeAreaView>
    );
  }

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

        <BattleHUD playerState={myPlayerState} isMe={true} />
        <BattleHUD playerState={opponentPlayerState} isMe={false} />

        {renderPopupMessage()}
      </AnimatedImageBackground>

      <View style={styles.battleActionsContainer}>
        {renderGamifiedLog()}

        <View style={styles.attacksContainer}>{renderAttackButtons()}</View>

        <View style={styles.pokemonSwitchContainer}>{renderPokemonSwitchButtons()}</View>

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
