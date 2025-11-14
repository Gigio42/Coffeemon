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
import { getBattleScenario } from '../../utils/battleUtils';
import { getEventMessage } from '../../utils/battleMessages';
import {
  canCoffeemonAttack,
  canSwitchToCoffeemon,
  canSelectInitialCoffeemon,
  canUseMove,
} from '../../utils/battleValidation';
import StatsDisplay from '../../components/Battle/StatsDisplay';
import MoveTooltip from '../../components/Battle/MoveTooltip';
import StatusEffectsDisplay from '../../components/Battle/StatusEffectsDisplay';
import CoffeemonSelectionModal from '../../components/CoffeemonSelectionModal';
import CoffeemonCard from '../../components/CoffeemonCard';
import { styles as switchModalStyles } from '../../components/Battle/SwitchModal/styles';
import { Coffeemon } from '../../types';
import BattleHUD from '../../components/Battle/BattleHUD';
import { pixelArt } from '../../theme/pixelArt';
import { styles } from './styles';
import { CoffeemonVariant, getCoffeemonImage } from '../../../assets/coffeemons';

interface BattleScreenProps {
  battleId: string;
  battleState: any;
  playerId: number;
  socket: Socket;
  onNavigateToMatchmaking: () => void;
}

interface SwitchCandidate {
  coffeemon: Coffeemon;
  index: number;
  canSwitch: boolean;
  reason?: string;
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

    const getCoffeemonImageSource = (name: string, variant: CoffeemonVariant = 'default') => {
      return getCoffeemonImage(name, variant);
    };

    const battle = useBattle({
      battleId,
      initialBattleState: initialBattleData,
      playerId,
      socket,
      onNavigateToMatchmaking,
      imageSourceGetter: getCoffeemonImageSource,
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
    playerDamage,
    opponentDamage,
    battleEnded,
    winnerId,
    showSelectionModal,
    isProcessing,
    myPlayerState,
    opponentPlayerState,
    myPendingAction,
    canAct,
    isBattleReady,
    sendAction,
    selectInitialCoffeemon,
    resolveSpriteVariant,
  } = battle;

  // Estado local para controle de tooltip de moves e modo de ação
  const [hoveredMoveId, setHoveredMoveId] = React.useState<number | null>(null);
  const [actionMode, setActionMode] = React.useState<'main' | 'attack' | 'item'>('main');
  const [isSwitchModalVisible, setSwitchModalVisible] = React.useState<boolean>(false);
  const [stuckRecoveryTimeout, setStuckRecoveryTimeout] = React.useState<NodeJS.Timeout | null>(null);

  // 🎯 OTIMISTIC UPDATE: Estado local para mostrar novo Coffeemon imediatamente
  const [optimisticActiveIndex, setOptimisticActiveIndex] = React.useState<number | null>(null);
  const [optimisticTimeout, setOptimisticTimeout] = React.useState<NodeJS.Timeout | null>(null);

  // 🎯 Memoizar fonte da imagem do jogador para otimistic updates
  const playerSprite = useMemo(() => {
    if (!myPlayerState || (optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex) === null) {
      return null;
    }

    const activeIndex = optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex!;
    const activeCoffeemon = myPlayerState.coffeemons[activeIndex];
    
    if (!activeCoffeemon) {
      console.warn('[BattleScreen] Player Coffeemon not found at index', activeIndex);
      return null;
    }

    const spriteState = resolveSpriteVariant(activeCoffeemon.name, 'back', activeCoffeemon.statusEffects);
    const imageSource = getCoffeemonImageSource(activeCoffeemon.name, spriteState.variant);

    console.log('[BattleScreen] Player sprite updated:', {
      name: activeCoffeemon.name,
      index: activeIndex,
      optimistic: optimisticActiveIndex !== null,
      variant: spriteState.variant,
      state: spriteState.state,
    });

    return {
      imageSource,
      state: spriteState.state,
      variant: spriteState.variant,
      name: activeCoffeemon.name,
      index: activeIndex,
    };
  }, [myPlayerState, optimisticActiveIndex, resolveSpriteVariant]);

  const opponentSprite = useMemo(() => {
    if (!opponentPlayerState || opponentPlayerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeCoffeemon = opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
    if (!activeCoffeemon) {
      return null;
    }

    const spriteState = resolveSpriteVariant(activeCoffeemon.name, 'default', activeCoffeemon.statusEffects);
    const imageSource = getCoffeemonImageSource(activeCoffeemon.name, spriteState.variant);

    return {
      imageSource,
      state: spriteState.state,
      variant: spriteState.variant,
      name: activeCoffeemon.name,
    };
  }, [opponentPlayerState, resolveSpriteVariant]);

  const playerHudVariant = useMemo<CoffeemonVariant | null>(() => {
    if (!myPlayerState || myPlayerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeMon = myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
    if (!activeMon) {
      return null;
    }

    return resolveSpriteVariant(activeMon.name, 'default', activeMon.statusEffects).variant;
  }, [myPlayerState, resolveSpriteVariant]);

  const opponentHudVariant = useMemo<CoffeemonVariant | null>(() => {
    if (!opponentPlayerState || opponentPlayerState.activeCoffeemonIndex === null) {
      return null;
    }

    const activeMon = opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
    if (!activeMon) {
      return null;
    }

    return resolveSpriteVariant(activeMon.name, 'default', activeMon.statusEffects).variant;
  }, [opponentPlayerState, resolveSpriteVariant]);

  const switchCandidates = useMemo<SwitchCandidate[]>(() => {
    if (!myPlayerState || !Array.isArray(myPlayerState.coffeemons)) {
      return [];
    }

    // 🎯 Usar optimisticActiveIndex se disponível
    const currentActiveIndex = optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex;

    return myPlayerState.coffeemons
      .map((mon: Coffeemon, index: number) => {
        if (!mon || index === currentActiveIndex) {
          return null;
        }

        const validation = canSwitchToCoffeemon(myPlayerState, index);
        return {
          coffeemon: mon,
          index,
          canSwitch: validation.valid,
          reason: validation.reason,
        } as SwitchCandidate;
      })
      .filter((candidate): candidate is SwitchCandidate => candidate !== null);
  }, [myPlayerState, optimisticActiveIndex]);

  const hasSwitchCandidate = switchCandidates.some((candidate) => candidate.canSwitch);

  const initialSelectionCandidates = useMemo(() => {
    if (!myPlayerState?.coffeemons || !Array.isArray(myPlayerState.coffeemons)) {
      return [];
    }

    return myPlayerState.coffeemons
      .map((mon: Coffeemon, index: number) => {
        if (!mon || !mon.name) return null;

        const validation = canSelectInitialCoffeemon(myPlayerState, index);
        return {
          coffeemon: mon,
          index,
          canSelect: validation.valid,
          reason: validation.reason,
        };
      })
      .filter((candidate): candidate is any => candidate !== null);
  }, [myPlayerState]);

  const renderSwitchCandidateCard = React.useCallback(
    (
      candidate: SwitchCandidate,
      { onSelect, isLoading }: { onSelect: () => Promise<void>; isLoading: boolean }
    ): React.ReactNode => {
      const { coffeemon, canSwitch, reason } = candidate;
      const fakePlayerCoffeemon: any = {
        id: candidate.index,
        hp: coffeemon.currentHp,
        attack: coffeemon.attack,
        defense: coffeemon.defense,
        level: 1,
        experience: 0,
        isInParty: false,
        coffeemon: {
          id: candidate.index,
          name: coffeemon.name,
          type: 'floral',
          defaultImage: undefined,
        },
        maxHp: coffeemon.maxHp,
      };

      return (
        <View>
          <CoffeemonCard
            coffeemon={fakePlayerCoffeemon}
            onToggleParty={canSwitch ? async (c) => await onSelect() : async () => {}}
            variant="large"
            isLoading={isLoading || !canSwitch}
            maxHp={coffeemon.maxHp}
            disabled={!canSwitch}
          />
          {!canSwitch && reason && (
            <Text style={[switchModalStyles.disabledText, { textAlign: 'center', color: '#ff6b6b' }]}>
              {reason}
            </Text>
          )}
        </View>
      );
    },
    []
  );

  const renderInitialSelectionCard = React.useCallback(
    (
      candidate: any,
      { onSelect, isLoading }: { onSelect: () => Promise<void>; isLoading: boolean }
    ): React.ReactNode => {
      const { coffeemon, canSelect, reason } = candidate;
      const fakePlayerCoffeemon: any = {
        id: candidate.index,
        hp: coffeemon.currentHp,
        attack: coffeemon.attack,
        defense: coffeemon.defense,
        level: 1,
        experience: 0,
        isInParty: false,
        coffeemon: {
          id: candidate.index,
          name: coffeemon.name,
          type: 'floral',
          defaultImage: undefined,
        },
        maxHp: coffeemon.maxHp,
      };

      const isFainted = coffeemon.isFainted || coffeemon.currentHp <= 0;

      return (
        <View>
          <CoffeemonCard
            coffeemon={fakePlayerCoffeemon}
            onToggleParty={canSelect ? async (c) => await onSelect() : async () => {}}
            variant="large"
            isLoading={isLoading || !canSelect}
            maxHp={coffeemon.maxHp}
            disabled={!canSelect}
          />
          {!canSelect && reason && (
            <Text style={[switchModalStyles.disabledText, { textAlign: 'center', color: '#ff6b6b' }]}>
              {reason}
            </Text>
          )}
          {isFainted && (
            <Text style={[switchModalStyles.disabledText, { textAlign: 'center', color: '#ff6b6b' }]}>
              (Derrotado)
            </Text>
          )}
        </View>
      );
    },
    []
  );

  const handleSelectSwitchCandidate = (index: number) => {
    console.log('[BattleScreen] 🔄 Switch candidate selected:', index, {
      isProcessing,
      myPendingAction,
      turnPhase: battleState?.turnPhase
    });

    // ✅ VALIDAÇÕES SIMPLES: Não permitir durante processamento ou resolução
    if (isProcessing) {
      console.warn('[BattleScreen] ❌ Cannot switch - battle is processing');
      return;
    }

    if (myPendingAction) {
      console.warn('[BattleScreen] ❌ Cannot switch - action already pending');
      return;
    }

    if (battleState?.turnPhase === 'RESOLUTION') {
      console.warn('[BattleScreen] ❌ Cannot switch - battle is in resolution phase');
      return;
    }

    console.log(`[BattleScreen] ✅ Executing switch to Coffeemon at index ${index}`);

    // 🎯 OTIMISTIC UPDATE: Atualizar UI imediatamente
    setOptimisticActiveIndex(index);

    // Limpar timeout anterior se existir
    if (optimisticTimeout) {
      clearTimeout(optimisticTimeout);
    }

    // 🔄 Timeout de segurança
    const timeout = setTimeout(() => {
      console.warn('[BattleScreen] Optimistic switch timeout - reverting');
      setOptimisticActiveIndex(null);
      setOptimisticTimeout(null);
    }, 5000);

    setOptimisticTimeout(timeout);

    // ✅ ENVIAR AÇÃO: Executar troca
    sendAction('switch', { newIndex: index });
    
    // Fechar o modal
    setSwitchModalVisible(false);
  };

  React.useEffect(() => {
    if (!myPlayerState) {
      return;
    }

    const activeIndex = optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex;
    if (activeIndex === null || activeIndex === undefined) {
      return;
    }

    const activeMon = myPlayerState.coffeemons?.[activeIndex];
    if (!activeMon) {
      return;
    }

    // REMOVER ABERTURA AUTOMÁTICA: Não abrir modal automaticamente quando desmaia
    // O jogador deve escolher manualmente usar o botão "Trocar" quando necessário

    // Apenas fechar modal se não for mais necessário (ex: batalha terminou)
    if (battleEnded) {
      setSwitchModalVisible(false);
      if (stuckRecoveryTimeout) {
        clearTimeout(stuckRecoveryTimeout);
        setStuckRecoveryTimeout(null);
      }
    }
  }, [myPlayerState, battleEnded, optimisticActiveIndex]);

  // Cleanup de timeouts quando componente desmonta ou batalha termina
  React.useEffect(() => {
    return () => {
      if (stuckRecoveryTimeout) {
        clearTimeout(stuckRecoveryTimeout);
      }
      if (optimisticTimeout) {
        clearTimeout(optimisticTimeout);
      }
    };
  }, [stuckRecoveryTimeout, optimisticTimeout]);

  React.useEffect(() => {
    if (battleEnded && stuckRecoveryTimeout) {
      clearTimeout(stuckRecoveryTimeout);
      setStuckRecoveryTimeout(null);
      setSwitchModalVisible(false);
    }
    if (battleEnded && optimisticTimeout) {
      clearTimeout(optimisticTimeout);
      setOptimisticTimeout(null);
      setOptimisticActiveIndex(null);
    }
  }, [battleEnded, stuckRecoveryTimeout, optimisticTimeout]);

  // Limpar optimisticActiveIndex quando o estado real for atualizado (melhorado para PvP)
  React.useEffect(() => {
    if (optimisticActiveIndex !== null && myPlayerState?.activeCoffeemonIndex !== null) {
      const realIndex = myPlayerState.activeCoffeemonIndex;

      // Se o estado real foi atualizado para o mesmo índice otimista, limpar
      if (optimisticActiveIndex === realIndex) {
        console.log('[BattleScreen] ✅ Clearing optimistic index - backend confirmed switch in PvP', {
          optimistic: optimisticActiveIndex,
          real: realIndex,
          turnPhase: battleState?.turnPhase
        });
        setOptimisticActiveIndex(null);
        if (optimisticTimeout) {
          clearTimeout(optimisticTimeout);
          setOptimisticTimeout(null);
        }
      } else {
        // Se o backend confirmou um índice diferente, isso pode indicar um problema
        console.warn('[BattleScreen] ⚠️ Optimistic index mismatch in PvP', {
          optimistic: optimisticActiveIndex,
          real: realIndex,
          turnPhase: battleState?.turnPhase
        });
      }
    }
  }, [myPlayerState?.activeCoffeemonIndex, optimisticActiveIndex, optimisticTimeout, battleState?.turnPhase]);

  // Selecionar cenário baseado no battleId (consistente para ambos os jogadores)
  const battleScenario = getBattleScenario(battleId);

  const renderCoffeemonSprite = (imageSource: any, isMe: boolean, key?: string) => {
    // Fallback para imagem placeholder se não houver source
    const fallbackUrl = 'https://via.placeholder.com/150/8B7355/FFFFFF?text=Coffeemon';

    return (
      <View
        key={key || 'coffeemon-sprite'}
        style={[
          styles.coffeemonSpriteContainer,
          isMe ? styles.playerSpritePosition : styles.opponentSpritePosition,
        ]}
      >
        <Image
          source={imageSource || { uri: fallbackUrl }}
          style={styles.pokemonImg}
          resizeMode="contain"
          defaultSource={{ uri: fallbackUrl }}
          onError={(error) => {
            // Silenciar erro de imagem - não causar crash
            console.log('Image not found, using placeholder:', imageSource);
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
      type MatchType = 'player' | 'opponent' | 'damage';
      type ColoredPartType = MatchType | 'default';
      interface ColoredPart {
        text: string;
        color: string;
        type: ColoredPartType;
      }

      // Se não há nomes para verificar, retornar texto normal
      if (playerCoffeemonNames.length === 0 && opponentCoffeemonNames.length === 0) {
        return [{ text, color: '#FFFFFF', type: 'default' as ColoredPartType }];
      }

      const parts: ColoredPart[] = [];
      let lastIndex = 0;
      interface MatchSegment {
        index: number;
        length: number;
        text: string;
        color: string;
        type: MatchType;
      }
      const allMatches: MatchSegment[] = [];

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

      const damagePatterns = [
        /-\d+\s*(?:HP|hp)?/g,
        /\b\d+\s+de\s+dano\b/gi,
        /\b\d+\s*dano\b/gi,
      ];

      damagePatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const matchText = match[0];
          const startIndex = match.index;
          const endIndex = startIndex + matchText.length;
          const overlaps = allMatches.some((existing) =>
            startIndex < existing.index + existing.length && existing.index < endIndex
          );

          if (!overlaps) {
            allMatches.push({
              index: startIndex,
              length: matchText.length,
              text: matchText,
              color: '#FF4B4B',
              type: 'damage',
            });
          }
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
            color: '#FFFFFF',
            type: 'default'
          });
        }
        // Adicionar nome colorido
        parts.push({
          text: match.text,
          color: match.color,
          type: match.type
        });
        lastIndex = match.index + match.length;
      });

      // Adicionar texto restante
      if (lastIndex < text.length) {
        parts.push({
          text: text.slice(lastIndex),
          color: '#FFFFFF',
          type: 'default'
        });
      }

      return parts.length > 0
        ? parts
        : [{ text, color: '#FFFFFF', type: 'default' as ColoredPartType }];
    };

    const coloredParts = renderColoredText(message);

    return (
      <View key={`log-${index}`} style={[styles.logEntryRow, { opacity }]}>
        <View style={styles.logEntryTextContainer}>
          {coloredParts.map((part, partIndex) => (
            <Text
              key={partIndex}
              style={[
                styles.logEntryText,
                { color: part.color },
                part.type === 'damage' && styles.logEntryDamageText,
              ]}
            >
              {part.text}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderMainActionButtons = () => {
    // ✅ VERIFICAR SE TROCA É NECESSÁRIA: Coffeemon ativo está fainted
    const activeIndex = optimisticActiveIndex ?? myPlayerState?.activeCoffeemonIndex;
    const activeMon = activeIndex !== null ? myPlayerState?.coffeemons?.[activeIndex] : null;
    const needsSwitch = activeMon && (activeMon.isFainted || activeMon.currentHp <= 0);

    // 🔍 DEBUG: Verificar condições dos botões
    console.log('[BattleScreen] Button conditions:', {
      canAct,
      myPendingAction,
      needsSwitch,
      hasSwitchCandidate,
      isProcessing,
      turnPhase: battleState?.turnPhase,
      activeIndex,
      activeMon: activeMon ? { name: activeMon.name, hp: activeMon.currentHp, fainted: activeMon.isFainted } : null,
      hasPendingEvents: battleState?.events && battleState.events.length > 0,
      eventsCount: battleState?.events?.length || 0,
      playerHasSelected: myPlayerState?.hasSelectedCoffeemon,
      opponentHasSelected: opponentPlayerState?.hasSelectedCoffeemon
    });

    let statusText = '';

    if (battleEnded) {
      statusText = 'BATALHA FINALIZADA!';
    } else if (isProcessing) {
      statusText = 'PROCESSANDO TURNO...';
    } else if (myPendingAction) {
      statusText = 'AGUARDANDO OPONENTE...';
    } else if (battleState?.turnPhase === 'RESOLUTION') {
      statusText = 'EXECUTANDO AÇÕES...';
    } else if (battleState?.turnPhase === 'END_OF_TURN') {
      statusText = 'FINALIZANDO TURNO...';
    } else if (battleState?.turnPhase === 'SELECTION') {
      // ✅ Durante SELECTION, verificar se já selecionou ou está esperando
      const hasSelected = myPlayerState?.hasSelectedCoffeemon;
      const opponentSelected = opponentPlayerState?.hasSelectedCoffeemon;
      
      if (!hasSelected) {
        statusText = 'ESCOLHA SEU COFFEEMON INICIAL';
      } else if (!opponentSelected) {
        statusText = 'AGUARDANDO OPONENTE ESCOLHER...';
      } else {
        statusText = 'PREPARANDO BATALHA...';
      }
    } else if (needsSwitch && canAct) {
      // ✅ SÓ MOSTRAR TROCA OBRIGATÓRIA quando for realmente o turno do jogador
      statusText = 'SEU COFFEEMON DESMAIOU! ESCOLHA TROCAR OU FUGIR.';
    } else if (actionMode === 'attack') {
      statusText = 'ESCOLHA UM ATAQUE.';
    } else if (isSwitchModalVisible) {
      statusText = 'ESCOLHA UM COFFEEMON PARA TROCAR.';
    } else if (battleState?.turnPhase === 'SUBMISSION') {
      statusText = 'ESCOLHA A SUA PRÓXIMA AÇÃO?';
    } else if (battleState?.currentPlayerId === playerId) {
      statusText = 'SEU TURNO! ESCOLHA SUA AÇÃO.';
    } else if (battleState?.currentPlayerId) {
      statusText = 'AGUARDANDO TURNO DO OPONENTE...';
    } else {
      statusText = 'AGUARDANDO TURNO...';
    }

    return (
      <>
        <View style={styles.actionPromptContainer}>
          <Text style={styles.actionPromptText}>{statusText}</Text>
        </View>
        
        <View style={styles.mainActionsGrid}>
          {/* Botão Atacar - DESABILITADO se Coffeemon estiver fainted */}
          <TouchableOpacity
            style={[
              styles.mainActionButton, 
              styles.attackActionButton, 
              (!canAct || myPendingAction || needsSwitch) && styles.actionButtonDisabled
            ]}
            onPress={() => setActionMode('attack')}
            disabled={!canAct || myPendingAction || needsSwitch}
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonIcon}>⚔️</Text>
              <Text style={styles.actionButtonText}>Atacar</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Trocar - DISPONÍVEL apenas no turno do jogador */}
          <TouchableOpacity
            style={[
              styles.mainActionButton,
              styles.specialActionButton,
              (!hasSwitchCandidate || isProcessing || myPendingAction || battleState?.turnPhase === 'RESOLUTION' || !canAct) && styles.actionButtonDisabled,
              (needsSwitch && canAct) && { borderWidth: 3, borderColor: '#FFD700' } // Destaque amarelo apenas quando for o turno E precisar trocar
            ]}
            onPress={() => setSwitchModalVisible(true)}
            disabled={!hasSwitchCandidate || isProcessing || myPendingAction || battleState?.turnPhase === 'RESOLUTION' || !canAct}
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonIcon}>🔄</Text>
              <Text style={styles.actionButtonText}>
                {(needsSwitch && canAct) ? 'OBRIGATÓRIA' : 'Trocar'}
              </Text>
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

          {/* Botão Fugir - SEMPRE DISPONÍVEL */}
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
    if (!myPlayerState || (optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex) === null) {
      return null;
    }

    const activeIndex = optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex!;
    const activeMon = myPlayerState.coffeemons?.[activeIndex];
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
          <TouchableOpacity
            style={styles.backButtonSmall}
            onPress={() => setActionMode('main')}
          >
            <Text style={styles.backButtonIcon}>◀️</Text>
          </TouchableOpacity>
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
      </>
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
        source={battleScenario} 
        style={styles.battleArena}
        resizeMode="cover"
      >
        {playerSprite && renderCoffeemonSprite(
          playerSprite.imageSource,
          true,
          `player-sprite-${playerSprite.index}-${playerSprite.state}-${playerSprite.variant}-${playerSprite.name}`
        )}
        {opponentSprite && renderCoffeemonSprite(
          opponentSprite.imageSource,
          false,
          `opponent-sprite-${opponentSprite.state}-${opponentSprite.variant}-${opponentSprite.name}`
        )}

        {myPlayerState && <BattleHUD 
          playerState={optimisticActiveIndex !== null ? {
            ...myPlayerState,
            activeCoffeemonIndex: optimisticActiveIndex
          } : myPlayerState} 
          isMe={true} 
          damage={playerDamage} 
          spriteVariant={playerHudVariant ?? 'default'}
          imageSourceGetter={getCoffeemonImageSource}
        />}
        {opponentPlayerState && <BattleHUD 
          playerState={opponentPlayerState} 
          isMe={false} 
          damage={opponentDamage}
          spriteVariant={opponentHudVariant ?? 'default'}
          imageSourceGetter={getCoffeemonImageSource}
        />}

        {/* Painel de Logs - Lado Direito com gradiente completo */}
        <View style={styles.battleLogContainer}>
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.0)',  // Totalmente transparente na esquerda
              'rgba(0, 0, 0, 0.01)', // Muito suave início
              'rgba(0, 0, 0, 0.03)', // Suave transição
              'rgba(0, 0, 0, 0.08)', // Leve
              'rgba(0, 0, 0, 0.15)', // Médio-leve
              'rgba(0, 0, 0, 0.25)', // Transição suave
              'rgba(0, 0, 0, 0.35)', // Médio
              'rgba(0, 0, 0, 0.5)',  // Médio-alto
              'rgba(0, 0, 0, 0.65)', // Mais escuro
              'rgba(0, 0, 0, 0.8)',  // Quase máximo
              'rgba(0, 0, 0, 0.9)'   // Máximo na borda direita
            ]}
            locations={[0, 0.05, 0.1, 0.15, 0.25, 0.35, 0.45, 0.6, 0.75, 0.85, 1]}
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
      </ImageBackground>

      <View style={styles.battleActionsContainer}>
        {/* Renderiza conteúdo baseado no modo de ação */}
        {actionMode === 'main' && renderMainActionButtons()}
        {actionMode === 'attack' && renderAttackButtons()}
      </View>

      <CoffeemonSelectionModal
        visible={showSelectionModal}
        availableCoffeemons={initialSelectionCandidates}
        onSelectCoffeemon={async (candidate) => {
          await selectInitialCoffeemon(candidate.index);
        }}
        onClose={() => {
          // Modal de seleção inicial não pode ser fechado
          console.log('[BattleScreen] Cannot close initial selection modal');
        }}
        renderCoffeemonCard={renderInitialSelectionCard}
        keyExtractor={(candidate) => `${candidate.coffeemon.name}-${candidate.index}`}
        title="Escolha seu Coffeemon Inicial"
        emptyMessage="Nenhum Coffeemon disponível"
      />

      <CoffeemonSelectionModal
        visible={isSwitchModalVisible}
        availableCoffeemons={switchCandidates}
        onSelectCoffeemon={async (candidate) => {
          await handleSelectSwitchCandidate(candidate.index);
        }}
        onClose={() => {
          // ✅ FECHAMENTO SIMPLES: Sempre permitir fechar o modal
          console.log('[BattleScreen] Closing switch modal');
          setSwitchModalVisible(false);
          if (stuckRecoveryTimeout) {
            clearTimeout(stuckRecoveryTimeout);
            setStuckRecoveryTimeout(null);
          }
        }}
        renderCoffeemonCard={renderSwitchCandidateCard}
        keyExtractor={(candidate) => `${candidate.coffeemon.name}-${candidate.index}`}
        title="Trocar Coffeemon"
        emptyMessage="Nenhum Coffeemon disponível para troca"
      />
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
