import React, { useMemo } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Socket } from 'socket.io-client';
import { useBattleAnimations } from '../../hooks/useBattleAnimations';
import { useBattle } from '../../hooks/useBattle';
import { getCoffeemonImageUrl } from '../../utils/battleUtils';
import { getEventMessage } from '../../utils/battleMessages';
import { getServerUrl } from '../../utils/config'; 
import {
  canCoffeemonAttack,
  canSwitchToCoffeemon,
  canSelectInitialCoffeemon,
  canUseMove,
} from '../../utils/battleValidation';
import StatusEffectsDisplay from '../../components/Battle/StatusEffectsDisplay';
import StatsDisplay from '../../components/Battle/StatsDisplay';
import MoveTooltip from '../../components/Battle/MoveTooltip';
import { Coffeemon } from '../../types';
import BattleHUD from '../../components/Battle/BattleHUD';
import { pixelArt } from '../../theme/pixelArt';
import { styles } from './styles';

// Cenários disponíveis
const SCENARIOS = [
  require('../../../assets/scenarios/city.png'),
  require('../../../assets/scenarios/field.png'),
  require('../../../assets/scenarios/forest.png'),
];

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
  // Validação inicial
  if (!battleId || !initialBattleData || !playerId || !socket) {
    console.error('Invalid battle props:', { battleId, initialBattleData, playerId, socket: !!socket });
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao iniciar batalha</Text>
          <TouchableOpacity onPress={onNavigateToMatchmaking} style={styles.returnButton}>
            <Text style={styles.returnButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  try {
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
    myPlayerState,
    opponentPlayerState,
    myPendingAction,
    canAct,
    isBattleReady,
    sendAction,
    selectInitialCoffeemon,
  } = battle;

  // Estado local para controle de tooltip de moves e modo de ação
  const [hoveredMoveId, setHoveredMoveId] = React.useState<number | null>(null);
  const [actionMode, setActionMode] = React.useState<'main' | 'attack' | 'switch' | 'item'>('main');
  const [serverUrl, setServerUrl] = React.useState<string>('');

  // Selecionar cenário aleatório (mantém o mesmo durante toda a batalha)
  const randomScenario = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * SCENARIOS.length);
    return SCENARIOS[randomIndex];
  }, [battleId]); // Muda apenas quando a batalha muda

  React.useEffect(() => {
    const loadServerUrl = async () => {
      const url = await getServerUrl();
      setServerUrl(url);
    };
    loadServerUrl();
  }, []);

  const getCoffeemonImageUrlLocal = (name: string, variant: 'default' | 'back' = 'default'): string => {
    if (!serverUrl) return '';
    const baseName = name.split(' (Lvl')[0];
    return `${serverUrl}/imgs/${baseName}/${variant}.png`;
  };

  const renderCoffeemonSprite = (imageUrl: string, isMe: boolean) => {
    // Fallback para imagem placeholder se não houver URL
    const fallbackUrl = 'https://via.placeholder.com/150/8B7355/FFFFFF?text=Coffeemon';
    const finalUrl = imageUrl || fallbackUrl;

    return (
      <View
        style={[
          styles.coffeemonSpriteContainer,
          isMe ? styles.playerSpritePosition : styles.opponentSpritePosition,
        ]}
      >
        <Image
          source={{ uri: finalUrl }}
          style={styles.pokemonImg}
          resizeMode="contain"
          defaultSource={{ uri: fallbackUrl }}
          onError={(error) => {
            // Silenciar erro de imagem - não causar crash
            console.log('Image not found, using placeholder:', finalUrl);
          }}
        />
      </View>
    );
  };

  const renderLogEntry = (message: string, index: number, totalMessages: number, myPlayerState: any, opponentPlayerState: any) => {
    if (!message) {
      return null;
    }

    // Inverter: logs mais recentes (index menor) têm opacidade total, mais antigos têm menos
    const opacity = Math.max(0.3, Math.min(1, 1 - (index * 0.1)));

    // Identificar nomes de Coffeemons do player e oponente
    const playerCoffeemonNames = myPlayerState?.coffeemons?.map((mon: any) => mon?.name).filter(Boolean) || [];
    const opponentCoffeemonNames = opponentPlayerState?.coffeemons?.map((mon: any) => mon?.name).filter(Boolean) || [];

    // Função para renderizar texto com cores
    const renderColoredText = (text: string) => {
      // Se não há nomes para verificar, retornar texto normal
      if (playerCoffeemonNames.length === 0 && opponentCoffeemonNames.length === 0) {
        return [{ text, color: '#FFFFFF' }];
      }

      const parts = [];
      let lastIndex = 0;
      const allMatches: Array<{
        index: number;
        length: number;
        text: string;
        color: string;
        type: string;
      }> = [];

      // Coletar todas as correspondências primeiro
      playerCoffeemonNames.forEach((name: string) => {
        const regex = new RegExp(`\\b${name}\\b`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          allMatches.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
            color: '#61D26A', // Verde para player
            type: 'player'
          });
        }
      });

      opponentCoffeemonNames.forEach((name: string) => {
        const regex = new RegExp(`\\b${name}\\b`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          allMatches.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
            color: '#FF5A5F', // Vermelho para oponente
            type: 'opponent'
          });
        }
      });

      // Ordenar por posição
      allMatches.sort((a, b) => a.index - b.index);

      // Construir partes
      allMatches.forEach((match) => {
        // Adicionar texto antes da correspondência
        if (match.index > lastIndex) {
          parts.push({
            text: text.slice(lastIndex, match.index),
            color: '#FFFFFF'
          });
        }
        // Adicionar nome colorido
        parts.push({
          text: match.text,
          color: match.color
        });
        lastIndex = match.index + match.length;
      });

      // Adicionar texto restante
      if (lastIndex < text.length) {
        parts.push({
          text: text.slice(lastIndex),
          color: '#FFFFFF'
        });
      }

      return parts.length > 0 ? parts : [{ text, color: '#FFFFFF' }];
    };

    const coloredParts = renderColoredText(message);

    return (
      <View key={`log-${index}`} style={[styles.logEntryRow, { opacity }]}>
        <View style={styles.logEntryTextContainer}>
          {coloredParts.map((part, partIndex) => (
            <Text key={partIndex} style={[styles.logEntryText, { color: part.color }]}>
              {part.text}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderMainActionButtons = () => {
    const statusText = battleEnded
      ? 'BATALHA FINALIZADA!'
      : isProcessing
      ? 'PROCESSANDO...'
      : myPendingAction
      ? 'AGUARDANDO OPONENTE...'
      : canAct
      ? 'ESCOLHA A SUA PRÓXIMA AÇÃO?'
      : 'RESOLVENDO TURNO...';

    return (
      <>
        <View style={styles.actionPromptContainer}>
          <Text style={styles.actionPromptText}>{statusText}</Text>
        </View>
        
        <View style={styles.mainActionsGrid}>
          {/* Botão Atacar */}
          <TouchableOpacity
            style={[
              styles.mainActionButton, 
              styles.attackActionButton, 
              (!canAct || myPendingAction) && styles.actionButtonDisabled
            ]}
            onPress={() => setActionMode('attack')}
            disabled={!canAct || myPendingAction}
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonIcon}>⚔️</Text>
              <Text style={styles.actionButtonText}>Atacar</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Habilidade Especial (Trocar) */}
          <TouchableOpacity
            style={[
              styles.mainActionButton, 
              styles.specialActionButton, 
              (!canAct || myPendingAction) && styles.actionButtonDisabled
            ]}
            onPress={() => setActionMode('switch')}
            disabled={!canAct || myPendingAction}
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonIcon}>🔄</Text>
              <Text style={styles.actionButtonText}>Trocar</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Item (Desabilitado) */}
          <TouchableOpacity
            style={[styles.mainActionButton, styles.itemActionButton, styles.actionButtonDisabled]}
            disabled
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonIcon}>🧪</Text>
              <Text style={styles.actionButtonText}>Item</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Fugir */}
          <TouchableOpacity
            style={[styles.mainActionButton, styles.fleeActionButton]}
            onPress={onNavigateToMatchmaking}
            disabled={battleEnded}
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonIcon}>🏃</Text>
              <Text style={styles.actionButtonText}>Fugir</Text>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderAttackButtons = () => {
    if (!myPlayerState || myPlayerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeMon = myPlayerState.coffeemons?.[myPlayerState.activeCoffeemonIndex];
    if (!activeMon || !activeMon.moves) return null;

    // ✅ VALIDAÇÃO: Verificar se Coffeemon pode atacar
    const attackValidation = canCoffeemonAttack(myPlayerState);
    const canAttack = canAct && attackValidation.valid;

    const moveIcons: { [key: string]: string } = {
      floral: '🍇',
      sweet: '🔥',
      fruity: '🍋',
      nutty: '🌰',
      roasted: '🔥',
      spicy: '🌶️',
      sour: '🍃',
    };

    return (
      <>
        <View style={styles.actionPromptContainer}>
          <Text style={styles.actionPromptText}>Escolha um ataque:</Text>
        </View>

        <View style={styles.attacksGrid}>
          {activeMon.moves.map((move: any) => {
            // ✅ VALIDAÇÃO: Verificar se pode usar este movimento específico
            const moveValidation = canUseMove(myPlayerState, move.id);
            const canUseThisMove = canAttack && !myPendingAction && moveValidation.valid;
            const icon = moveIcons[move.type] || '⚔️';
            
            return (
              <View key={move.id} style={{ width: '48%', position: 'relative' }}>
                <TouchableOpacity
                  style={[styles.attackButton, !canUseThisMove && styles.attackButtonDisabled]}
                  onPress={() => {
                    if (canUseThisMove) {
                      sendAction('attack', { moveId: move.id });
                      setActionMode('main');
                    } else if (myPendingAction) {
                      console.log('Você já submeteu uma ação neste turno!');
                    } else if (!attackValidation.valid) {
                      console.log('Ataque bloqueado:', attackValidation.reason);
                    }
                  }}
                  onPressIn={() => setHoveredMoveId(move.id)}
                  onPressOut={() => setHoveredMoveId(null)}
                  disabled={!canUseThisMove}
                >
                  <View style={styles.attackButtonContent}>
                    <Text style={styles.attackTypeIcon}>{icon}</Text>
                    <Text style={styles.attackButtonText}>{move.name}</Text>
                    <Text style={styles.movePowerBadge}>PWR: {move.power}</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Tooltip do move */}
                <MoveTooltip move={move} visible={hoveredMoveId === move.id} />
              </View>
            );
          })}
        </View>

        {/* Botão Voltar */}
        <TouchableOpacity
          style={[styles.mainActionButton, styles.fleeActionButton, { width: '100%', marginTop: pixelArt.spacing.md }]}
          onPress={() => setActionMode('main')}
        >
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonIcon}>◀️</Text>
            <Text style={styles.actionButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderPokemonSwitchButtons = () => {
    if (!myPlayerState || !myPlayerState.coffeemons || !Array.isArray(myPlayerState.coffeemons)) {
      return null;
    }

    // ✅ VALIDAÇÃO: Filtrar apenas Coffeemons válidos para troca
    const availablePokemon = myPlayerState.coffeemons.filter(
      (mon: any, idx: number) => {
        // Não é o ativo
        if (idx === myPlayerState.activeCoffeemonIndex) return false;
        // Não está derrotado
        if (mon.isFainted || mon.currentHp <= 0) return false;
        return true;
      }
    );

    return (
      <>
        <View style={styles.actionPromptContainer}>
          <Text style={styles.actionPromptText}>Escolha um Coffeemon:</Text>
        </View>

        <View style={styles.switchGrid}>
          {availablePokemon.slice(0, 4).map((mon: any, idx: number) => {
            const imageUrl = getCoffeemonImageUrlLocal(mon.name, 'default');
            const hpPercent = (mon.currentHp / mon.maxHp) * 100;
            const originalIndex = myPlayerState.coffeemons.findIndex((m: any) => m === mon);
            
            // ✅ VALIDAÇÃO: Verificar se pode trocar para este Coffeemon
            const switchValidation = canSwitchToCoffeemon(myPlayerState, originalIndex);
            const canSwitchToThis = canAct && !myPendingAction && switchValidation.valid;

            return (
              <TouchableOpacity
                key={idx}
                style={[styles.switchButton, !canSwitchToThis && styles.switchButtonDisabled]}
                onPress={() => {
                  if (canSwitchToThis) {
                    sendAction('switch', { newIndex: originalIndex });
                    setActionMode('main');
                  } else if (myPendingAction) {
                    console.log('Você já submeteu uma ação neste turno!');
                  } else {
                    console.log('Troca bloqueada:', switchValidation.reason);
                  }
                }}
                disabled={!canSwitchToThis}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.switchButtonImage}
                  resizeMode="contain"
                  onError={() => console.log('Image not found:', mon.name)}
                />
                <Text style={styles.switchButtonName}>{mon.name}</Text>
                
                {/* HP Bar */}
                <View style={styles.switchButtonHpBar}>
                  <View style={[styles.switchButtonHpFill, { width: `${hpPercent}%` }]} />
                </View>
                <Text style={styles.switchButtonHpText}>
                  {mon.currentHp}/{mon.maxHp}
                </Text>
                
                {/* Status Effects (se houver) */}
                {mon.statusEffects && mon.statusEffects.length > 0 && (
                  <StatusEffectsDisplay statusEffects={mon.statusEffects} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botão Voltar */}
        <TouchableOpacity
          style={[styles.mainActionButton, styles.fleeActionButton, { width: '100%', marginTop: pixelArt.spacing.md }]}
          onPress={() => setActionMode('main')}
        >
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonIcon}>◀️</Text>
            <Text style={styles.actionButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderPopupMessage = () => {
    if (!popupMessage) return null;
    
    return (
      <View style={styles.popupContainer}>
        <Text style={styles.popupText}>{popupMessage}</Text>
      </View>
    );
  };

  if (!battleState || !playerId || !isBattleReady) {
    return (
      <SafeAreaView style={styles.battleContainer} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.loadingText}>⚔️ Preparando Batalha...</Text>
          <Text style={styles.loadingSubtext}>Aguarde enquanto carregamos os Coffeemons</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.battleContainer} edges={['left', 'right', 'bottom']}>
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

      <ImageBackground 
        source={randomScenario} 
        style={styles.battleArena}
        resizeMode="cover"
      >
        {playerImageUrl && renderCoffeemonSprite(playerImageUrl, true)}
        {opponentImageUrl && renderCoffeemonSprite(opponentImageUrl, false)}

        {myPlayerState && <BattleHUD playerState={myPlayerState} isMe={true} />}
        {opponentPlayerState && <BattleHUD playerState={opponentPlayerState} isMe={false} />}

        {/* Painel de Logs - Lado Direito com gradiente completo */}
        <View style={styles.battleLogContainer}>
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.0)', // Totalmente transparente na esquerda
              'rgba(0, 0, 0, 0.02)', // Muito muito leve
              'rgba(0, 0, 0, 0.08)', // Muito leve
              'rgba(0, 0, 0, 0.15)', // Leve
              'rgba(0, 0, 0, 0.3)', // Médio-leve
              'rgba(0, 0, 0, 0.5)', // Médio
              'rgba(0, 0, 0, 0.7)', // Médio-alto
              'rgba(0, 0, 0, 0.9)'  // Máximo na borda direita
            ]}
            locations={[0, 0.02, 0.08, 0.2, 0.35, 0.5, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logGradient}
          >
            <ScrollView
              style={styles.logScrollView}
              contentContainerStyle={styles.logScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {log.length === 0 && (
                <Text style={styles.logEmptyState}>Aguardando primeira ação...</Text>
              )}
              {log.slice().reverse().map((message, index) => renderLogEntry(message, index, log.length, myPlayerState, opponentPlayerState))}
            </ScrollView>
          </LinearGradient>
        </View>

        {renderPopupMessage()}
      </ImageBackground>

      <View style={styles.battleActionsContainer}>
        {/* Renderiza conteúdo baseado no modo de ação */}
        {actionMode === 'main' && renderMainActionButtons()}
        {actionMode === 'attack' && renderAttackButtons()}
        {actionMode === 'switch' && renderPokemonSwitchButtons()}
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
                {myPlayerState?.coffeemons && Array.isArray(myPlayerState.coffeemons) ? (
                  myPlayerState.coffeemons.map((mon: Coffeemon, index: number) => {
                    if (!mon || !mon.name) return null;
                    const imageUrl = getCoffeemonImageUrlLocal(mon.name, 'default');
                    
                    // ✅ VALIDAÇÃO: Verificar se pode selecionar este Coffeemon
                    const selectionValidation = canSelectInitialCoffeemon(myPlayerState, index);
                    const canSelect = selectionValidation.valid;
                    const isFainted = mon.isFainted || mon.currentHp <= 0;
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.teamCard, !canSelect && styles.teamCardDisabled]}
                        onPress={() => {
                          if (canSelect) {
                            selectInitialCoffeemon(index);
                          } else {
                            console.log('Seleção bloqueada:', selectionValidation.reason);
                          }
                        }}
                        disabled={!canSelect}
                      >
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.teamCardImage}
                          resizeMode="contain"
                          onError={() => console.log('Image not found:', mon.name)}
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
                  })
                ) : (
                  <Text style={styles.loadingSubtext}>Carregando equipe...</Text>
                )}
              </View>

              <View style={styles.teamColumn}>
                <Text style={styles.teamColumnTitle}>Equipe do Oponente</Text>
                {opponentPlayerState?.coffeemons && Array.isArray(opponentPlayerState.coffeemons) ? (
                  opponentPlayerState.coffeemons.map((mon: Coffeemon, index: number) => {
                    if (!mon || !mon.name) return null;
                    const imageUrl = getCoffeemonImageUrlLocal(mon.name, 'default');
                    return (
                      <View key={index} style={[styles.teamCard, styles.teamCardOpponent]}>
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.teamCardImage}
                          resizeMode="contain"
                          onError={() => console.log('Image not found:', mon.name)}
                        />
                        <View style={styles.teamCardInfo}>
                          <Text style={styles.teamCardName}>{mon.name}</Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.loadingSubtext}>Carregando equipe...</Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
  } catch (error) {
    console.error('Error rendering Battle screen:', error);
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro durante a batalha</Text>
          <Text style={styles.errorSubtext}>{error instanceof Error ? error.message : 'Erro desconhecido'}</Text>
          <TouchableOpacity onPress={onNavigateToMatchmaking} style={styles.returnButton}>
            <Text style={styles.returnButtonText}>Voltar ao Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
