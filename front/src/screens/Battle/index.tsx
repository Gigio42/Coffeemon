import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Socket } from "socket.io-client";
import {
  CoffeemonVariant,
  getCoffeemonImage,
} from "../../../assets/coffeemons";
import { getBattleIcon } from "../../../assets/iconsv2";
import {
  Item,
  getItemColor,
  getItemIcon,
  getPlayerItems,
} from "../../api/itemsService";
import BattleHUD from "../../components/Battle/BattleHUD";
import { styles as switchModalStyles } from "../../components/Battle/SwitchModal/styles";
import CoffeemonCard from "../../components/CoffeemonCard";
import CoffeemonSelectionModal from "../../components/CoffeemonSelectionModal";
import ItemSelectionModal from "../../components/ItemSelectionModal";
import ItemTargetModal from "../../components/ItemTargetModal";
import MoveDetailsModal from "../../components/MoveDetailsModal/index";
import VictoryModal from "../../components/Battle/VictoryModal";
import { useBattle } from "../../hooks/useBattle";
import { useBattleAnimations } from "../../hooks/useBattleAnimations";
import { Coffeemon } from "../../types";
import { getBattleScenario } from "../../utils/battleUtils";
import {
  canCoffeemonAttack,
  canSelectInitialCoffeemon,
  canSwitchToCoffeemon,
  canUseMove,
} from "../../utils/battleValidation";
import { styles } from "./styles";

interface BattleScreenProps {
  battleId: string;
  battleState: any;
  playerId: number;
  token: string;
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
  token,
  socket,
  onNavigateToMatchmaking,
}: BattleScreenProps) {
  // Validação inicial
  if (!battleId || !initialBattleData || !playerId || !socket) {
    console.error("Invalid battle props:", {
      battleId,
      initialBattleData,
      playerId,
      socket: !!socket,
    });
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao iniciar batalha</Text>
          <TouchableOpacity
            onPress={onNavigateToMatchmaking}
            style={styles.returnButton}
          >
            <Text style={styles.returnButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  const getCoffeemonImageSource = (
    name: string,
    variant: CoffeemonVariant = "default"
  ) => {
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
    battleRewards,
    showVictoryModal,
    setShowVictoryModal,
  } = battle;

  // Estado local para controle de tooltip de moves e modo de ação
  const [hoveredMoveId, setHoveredMoveId] = React.useState<number | null>(null);
  const [actionMode, setActionMode] = React.useState<
    "main" | "attack" | "item"
  >("main");
  const [isSwitchModalVisible, setSwitchModalVisible] =
    React.useState<boolean>(false);
  const [stuckRecoveryTimeout, setStuckRecoveryTimeout] =
    React.useState<NodeJS.Timeout | null>(null);

  // 📝 SISTEMA DE TEXTO INTERATIVO COM TYPEWRITER
  const [currentMessageIndex, setCurrentMessageIndex] =
    React.useState<number>(0);
  const [displayedText, setDisplayedText] = React.useState<string>("");
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [hasUnreadMessages, setHasUnreadMessages] = React.useState<boolean>(false);
  const [lastProcessedLogLength, setLastProcessedLogLength] = React.useState<number>(0);

  // 🎯 OTIMISTIC UPDATE: Estado local para mostrar novo Coffeemon imediatamente
  const [optimisticActiveIndex, setOptimisticActiveIndex] = React.useState<
    number | null
  >(null);
  const [optimisticTimeout, setOptimisticTimeout] =
    React.useState<NodeJS.Timeout | null>(null);

  // 💼 SISTEMA DE ITENS
  const [items, setItems] = React.useState<Item[]>([]);
  const [isItemModalVisible, setItemModalVisible] =
    React.useState<boolean>(false);
  const [isItemTargetModalVisible, setItemTargetModalVisible] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  
  // 🎯 SISTEMA DE DETALHES DE MOVES
  const [selectedMoveForDetails, setSelectedMoveForDetails] = React.useState<any>(null);
  const [showMoveDetails, setShowMoveDetails] = React.useState<boolean>(false);

  // Debug: Log quando o modal muda
  React.useEffect(() => {
    console.log(
      "[BattleScreen] isItemModalVisible changed to:",
      isItemModalVisible
    );
  }, [isItemModalVisible]);

  React.useEffect(() => {
    console.log(
      "[BattleScreen] isItemTargetModalVisible changed to:",
      isItemTargetModalVisible
    );
  }, [isItemTargetModalVisible]);

  React.useEffect(() => {
    console.log("[BattleScreen] items state changed, count:", items.length);
    console.log("[BattleScreen] items:", items);
  }, [items]);

  // 📝 Detectar novas mensagens e bloquear ações
  React.useEffect(() => {
    if (log.length > lastProcessedLogLength) {
      console.log("[BattleScreen] New messages detected:", log.length - lastProcessedLogLength);
      setHasUnreadMessages(true);
      // Não atualiza lastProcessedLogLength aqui - só quando ler todas
    }
  }, [log.length, lastProcessedLogLength]);

  // 📝 Efeito Typewriter - Anima o texto sendo digitado
  React.useEffect(() => {
    if (log.length === 0) {
      setDisplayedText("");
      setCurrentMessageIndex(0);
      setHasUnreadMessages(false);
      setLastProcessedLogLength(0);
      return;
    }

    const currentMessage = log[currentMessageIndex] || "";
    console.log("[BattleScreen] Current message from log:", currentMessage);

    // O log já vem com as mensagens processadas do useBattle
    const fullMessage = currentMessage;

    if (displayedText.length < fullMessage.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText(fullMessage.slice(0, displayedText.length + 1));
      }, 20); // Velocidade de digitação: 20ms por caractere (mais rápido)

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      // Não avança automaticamente - jogador precisa clicar
    }
  }, [log, currentMessageIndex, displayedText]);

  // Limpar timeout quando componente desmontar
  // Função para avançar/voltar mensagens ao clicar
  const handleTextBoxClick = () => {
    if (isTyping) {
      // Se ainda está digitando, completa a mensagem imediatamente
      const currentMessage = log[currentMessageIndex] || "";
      setDisplayedText(currentMessage);
      setIsTyping(false);
    } else {
      // Se já terminou de digitar, avança manualmente para a próxima
      if (currentMessageIndex < log.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
        setDisplayedText("");
      } else {
        // Chegou na última mensagem - marca como lido
        console.log("[BattleScreen] All messages read, unlocking actions");
        setHasUnreadMessages(false);
        setLastProcessedLogLength(log.length);
      }
    }
  };

  // Função para skip rápido - ir direto para última mensagem
  const handleSkipToEnd = () => {
    if (log.length > 0) {
      const lastIndex = log.length - 1;
      setCurrentMessageIndex(lastIndex);
      setDisplayedText(log[lastIndex]);
      setIsTyping(false);
      setHasUnreadMessages(false);
      setLastProcessedLogLength(log.length);
      console.log("[BattleScreen] Skipped to last message");
    }
  };

  React.useEffect(() => {
    // Apenas ajusta o índice se estiver fora dos limites
    if (log.length > 0 && currentMessageIndex >= log.length) {
      setCurrentMessageIndex(log.length - 1);
      setDisplayedText("");
    }
    // Não pula automaticamente para novas mensagens - jogador controla
  }, [log.length, currentMessageIndex]);

  // 🏆 Mostrar modal de vitória quando batalha terminar E jogador ler última mensagem
  React.useEffect(() => {
    if (battleEnded && !hasUnreadMessages && !showVictoryModal) {
      console.log('✅ [BattleScreen] Battle ended and all messages read - showing victory modal');
      // Pequeno delay para garantir que animações e rewards chegaram
      const timer = setTimeout(() => {
        setShowVictoryModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [battleEnded, hasUnreadMessages, showVictoryModal, setShowVictoryModal]);

  // Função para voltar mensagem anterior
  const handlePreviousMessage = (e: any) => {
    e.stopPropagation();

    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
      setDisplayedText("");
    }
  };

  // Função para próxima mensagem
  const handleNextMessage = (e: any) => {
    e.stopPropagation();

    if (currentMessageIndex < log.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
      setDisplayedText("");
    }
  };

  // 🎯 Memoizar fonte da imagem do jogador para otimistic updates
  const playerSprite = useMemo(() => {
    if (
      !myPlayerState ||
      (optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex) === null
    ) {
      return null;
    }

    const activeIndex =
      optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex!;
    const activeCoffeemon = myPlayerState.coffeemons[activeIndex];

    if (!activeCoffeemon) {
      console.warn(
        "[BattleScreen] Player Coffeemon not found at index",
        activeIndex
      );
      return null;
    }

    const spriteState = resolveSpriteVariant(
      activeCoffeemon.name,
      "back",
      activeCoffeemon.statusEffects
    );
    const imageSource = getCoffeemonImageSource(
      activeCoffeemon.name,
      spriteState.variant
    );

    console.log("[BattleScreen] Player sprite updated:", {
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
    if (
      !opponentPlayerState ||
      opponentPlayerState.activeCoffeemonIndex === null
    ) {
      return null;
    }

    const activeCoffeemon =
      opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
    if (!activeCoffeemon) {
      return null;
    }

    // Se o Coffeemon está fainted, usar variante sleeping
    const isFainted = activeCoffeemon.isFainted || activeCoffeemon.currentHp <= 0;
    
    const spriteState = resolveSpriteVariant(
      activeCoffeemon.name,
      isFainted ? "sleeping" : "default",
      activeCoffeemon.statusEffects
    );
    const imageSource = getCoffeemonImageSource(
      activeCoffeemon.name,
      spriteState.variant
    );

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

    const activeMon =
      myPlayerState.coffeemons[myPlayerState.activeCoffeemonIndex];
    if (!activeMon) {
      return null;
    }

    return resolveSpriteVariant(
      activeMon.name,
      "default",
      activeMon.statusEffects
    ).variant;
  }, [myPlayerState, resolveSpriteVariant]);

  const opponentHudVariant = useMemo<CoffeemonVariant | null>(() => {
    if (
      !opponentPlayerState ||
      opponentPlayerState.activeCoffeemonIndex === null
    ) {
      return null;
    }

    const activeMon =
      opponentPlayerState.coffeemons[opponentPlayerState.activeCoffeemonIndex];
    if (!activeMon) {
      return null;
    }

    return resolveSpriteVariant(
      activeMon.name,
      "default",
      activeMon.statusEffects
    ).variant;
  }, [opponentPlayerState, resolveSpriteVariant]);

  const switchCandidates = useMemo<SwitchCandidate[]>(() => {
    if (!myPlayerState || !Array.isArray(myPlayerState.coffeemons)) {
      return [];
    }

    // 🎯 Usar optimisticActiveIndex se disponível
    const currentActiveIndex =
      optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex;

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

  const hasSwitchCandidate = switchCandidates.some(
    (candidate) => candidate.canSwitch
  );

  const initialSelectionCandidates = useMemo(() => {
    if (
      !myPlayerState?.coffeemons ||
      !Array.isArray(myPlayerState.coffeemons)
    ) {
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
      {
        onSelect,
        isLoading,
      }: { onSelect: () => Promise<void>; isLoading: boolean }
    ): React.ReactNode => {
      const { coffeemon, canSwitch, reason } = candidate;
      const fakePlayerCoffeemon: any = {
        id: candidate.index,
        hp: coffeemon.currentHp,
        attack: coffeemon.attack,
        defense: coffeemon.defense,
        level: coffeemon.level,
        experience: 0,
        isInParty: false,
        coffeemon: {
          id: candidate.index,
          name: coffeemon.name,
          types: coffeemon.types || ["roasted"],
          defaultImage: undefined,
        },
        maxHp: coffeemon.maxHp,
      };

      return (
        <View>
          <CoffeemonCard
            coffeemon={fakePlayerCoffeemon}
            onPress={canSwitch ? async (c) => await onSelect() : undefined}
            variant="large"
            isLoading={isLoading || !canSwitch}
            disabled={!canSwitch}
            showPartyIndicator={false}
          />
          {!canSwitch && reason && (
            <Text
              style={[
                switchModalStyles.disabledText,
                { textAlign: "center", color: "#ff6b6b" },
              ]}
            >
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
      {
        onSelect,
        isLoading,
      }: { onSelect: () => Promise<void>; isLoading: boolean }
    ): React.ReactNode => {
      const { coffeemon, canSelect, reason } = candidate;
      const fakePlayerCoffeemon: any = {
        id: candidate.index,
        hp: coffeemon.currentHp,
        attack: coffeemon.attack,
        defense: coffeemon.defense,
        level: coffeemon.level,
        experience: 0,
        isInParty: false,
        coffeemon: {
          id: candidate.index,
          name: coffeemon.name,
          types: coffeemon.types || ["roasted"],
          defaultImage: undefined,
        },
        maxHp: coffeemon.maxHp,
      };

      const isFainted = coffeemon.isFainted || coffeemon.currentHp <= 0;

      return (
        <View>
          <CoffeemonCard
            coffeemon={fakePlayerCoffeemon}
            onPress={canSelect ? async (c) => await onSelect() : undefined}
            variant="large"
            isLoading={isLoading || !canSelect}
            disabled={!canSelect}
            showPartyIndicator={false}
          />
          {!canSelect && reason && (
            <Text
              style={[
                switchModalStyles.disabledText,
                { textAlign: "center", color: "#ff6b6b" },
              ]}
            >
              {reason}
            </Text>
          )}
          {isFainted && (
            <Text
              style={[
                switchModalStyles.disabledText,
                { textAlign: "center", color: "#ff6b6b" },
              ]}
            >
              (Derrotado)
            </Text>
          )}
        </View>
      );
    },
    []
  );

  const handleSelectSwitchCandidate = (index: number) => {
    console.log("[BattleScreen] 🔄 Switch candidate selected:", index, {
      isProcessing,
      myPendingAction,
      turnPhase: battleState?.turnPhase,
    });

    // ✅ VALIDAÇÕES SIMPLES: Não permitir durante processamento ou resolução
    if (isProcessing) {
      console.warn("[BattleScreen] ❌ Cannot switch - battle is processing");
      return;
    }

    if (myPendingAction) {
      console.warn("[BattleScreen] ❌ Cannot switch - action already pending");
      return;
    }

    if (battleState?.turnPhase === "RESOLUTION") {
      console.warn(
        "[BattleScreen] ❌ Cannot switch - battle is in resolution phase"
      );
      return;
    }

    console.log(
      `[BattleScreen] ✅ Executing switch to Coffeemon at index ${index}`
    );

    // 🎯 OTIMISTIC UPDATE: Atualizar UI imediatamente
    setOptimisticActiveIndex(index);

    // Limpar timeout anterior se existir
    if (optimisticTimeout) {
      clearTimeout(optimisticTimeout);
    }

    // 🔄 Timeout de segurança
    const timeout = setTimeout(() => {
      console.warn("[BattleScreen] Optimistic switch timeout - reverting");
      setOptimisticActiveIndex(null);
      setOptimisticTimeout(null);
    }, 5000);

    setOptimisticTimeout(timeout);

    // ✅ ENVIAR AÇÃO: Executar troca
    sendAction("switch", { newIndex: index });

    // Fechar o modal
    setSwitchModalVisible(false);
  };

  React.useEffect(() => {
    if (!myPlayerState) {
      return;
    }

    const activeIndex =
      optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex;
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
    if (
      optimisticActiveIndex !== null &&
      myPlayerState?.activeCoffeemonIndex !== null
    ) {
      const realIndex = myPlayerState.activeCoffeemonIndex;

      // Se o estado real foi atualizado para o mesmo índice otimista, limpar
      if (optimisticActiveIndex === realIndex) {
        console.log(
          "[BattleScreen] ✅ Clearing optimistic index - backend confirmed switch in PvP",
          {
            optimistic: optimisticActiveIndex,
            real: realIndex,
            turnPhase: battleState?.turnPhase,
          }
        );
        setOptimisticActiveIndex(null);
        if (optimisticTimeout) {
          clearTimeout(optimisticTimeout);
          setOptimisticTimeout(null);
        }
      } else {
        // Se o backend confirmou um índice diferente, isso pode indicar um problema
        console.warn("[BattleScreen] ⚠️ Optimistic index mismatch in PvP", {
          optimistic: optimisticActiveIndex,
          real: realIndex,
          turnPhase: battleState?.turnPhase,
        });
      }
    }
  }, [
    myPlayerState?.activeCoffeemonIndex,
    optimisticActiveIndex,
    optimisticTimeout,
    battleState?.turnPhase,
  ]);

  // 💼 Carregar itens disponíveis ao iniciar a batalha
  React.useEffect(() => {
    console.log("[BattleScreen] useEffect for loading items triggered");

    const loadItems = async () => {
      console.log("[BattleScreen] loadItems function started");
      try {
        console.log(
          "[BattleScreen] Token from props:",
          token ? "Token exists" : "No token"
        );

        if (token) {
          console.log("[BattleScreen] Calling getPlayerItems...");
          const playerItems = await getPlayerItems(token);
          console.log("[BattleScreen] Player items received:", playerItems);
          setItems(playerItems);
          console.log(
            "[BattleScreen] Player items loaded:",
            playerItems.length,
            "items"
          );
          playerItems.forEach((item) => {
            console.log(`[BattleScreen]   - ${item.name}: ${item.quantity}x`);
          });
        } else {
          console.warn("[BattleScreen] No token provided in props!");
        }
      } catch (error) {
        console.error("[BattleScreen] Error loading items:", error);
        console.error(
          "[BattleScreen] Error details:",
          JSON.stringify(error, null, 2)
        );
      }
    };

    loadItems();
  }, [token]);

  // 💼 Funções de manipulação de itens
  const handleSelectItem = (item: Item) => {
    console.log("[BattleScreen] Item selected:", item.id);
    setSelectedItem(item);
    setItemModalVisible(false);
    setItemTargetModalVisible(true);
  };

  const handleSelectItemTarget = (targetIndex: number) => {
    if (!selectedItem) return;

    console.log(
      "[BattleScreen] Using item:",
      selectedItem.id,
      "on Coffeemon at index:",
      targetIndex
    );

    // 📦 Atualizar quantidade do item localmente
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem.id
          ? { ...item, quantity: Math.max(0, (item.quantity || 0) - 1) }
          : item
      )
    );

    // Enviar ação ao backend
    sendAction("use_item", {
      itemId: selectedItem.id,
      targetCoffeemonIndex: targetIndex,
    });

    // Fechar modais e voltar ao menu principal
    setItemTargetModalVisible(false);
    setSelectedItem(null);
    setActionMode("main");
  };

  const handleCloseItemModals = () => {
    setItemModalVisible(false);
    setItemTargetModalVisible(false);
    setSelectedItem(null);
  };

  // Selecionar cenário baseado no battleId (consistente para ambos os jogadores)
  const battleScenario = getBattleScenario(battleId);

  const renderCoffeemonSprite = (
    imageSource: any,
    isMe: boolean,
    key?: string
  ) => {
    // Fallback para imagem placeholder se não houver source
    const fallbackUrl =
      "https://via.placeholder.com/150/8B7355/FFFFFF?text=Coffeemon";

    // Determinar se o Coffeemon está fainted
    const activeIndex = isMe 
      ? (optimisticActiveIndex ?? myPlayerState?.activeCoffeemonIndex)
      : opponentPlayerState?.activeCoffeemonIndex;
    
    const activeMon = isMe
      ? (activeIndex !== null && myPlayerState?.coffeemons?.[activeIndex])
      : (activeIndex !== null && opponentPlayerState?.coffeemons?.[activeIndex]);
    
    const isFainted = activeMon && (activeMon.isFainted || activeMon.currentHp <= 0);

    // Determinar qual estilo de animação usar
    const animStyle = isMe ? playerAnimStyle : opponentAnimStyle;

    return (
      <Animated.View
        key={key || "coffeemon-sprite"}
        style={[
          styles.coffeemonSpriteContainer,
          isMe ? styles.playerSpritePosition : styles.opponentSpritePosition,
          animStyle,
        ]}
      >
        <Animated.Image
          source={imageSource || { uri: fallbackUrl }}
          style={[
            styles.pokemonImg,
          ]}
          resizeMode="contain"
          defaultSource={{ uri: fallbackUrl }}
          onError={(error) => {
            // Silenciar erro de imagem - não causar crash
            console.log("Image not found, using placeholder:", imageSource);
          }}
        />
        {/* Overlay cinza forte para simular grayscale quando fainted */}
        {isFainted && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#555555',
              opacity: 0.7,
              mixBlendMode: 'color' as any,
            }}
          />
        )}
      </Animated.View>
    );
  };

  const renderLogEntry = (
    message: string,
    index: number,
    totalMessages: number,
    myPlayerState: any,
    opponentPlayerState: any
  ) => {
    if (!message) {
      return null;
    }

    // Inverter: logs mais recentes (index menor) têm opacidade total, mais antigos têm menos
    const opacity = Math.max(0.3, Math.min(1, 1 - index * 0.1));

    // Identificar nomes de Coffeemons do player e oponente
    const playerCoffeemonNames =
      myPlayerState?.coffeemons?.map((mon: any) => mon?.name).filter(Boolean) ||
      [];
    const opponentCoffeemonNames =
      opponentPlayerState?.coffeemons
        ?.map((mon: any) => mon?.name)
        .filter(Boolean) || [];

    // Função para renderizar texto com cores
    const renderColoredText = (text: string) => {
      type MatchType = "player" | "opponent" | "damage";
      type ColoredPartType = MatchType | "default";
      interface ColoredPart {
        text: string;
        color: string;
        type: ColoredPartType;
      }

      // Se não há nomes para verificar, retornar texto normal
      if (
        playerCoffeemonNames.length === 0 &&
        opponentCoffeemonNames.length === 0
      ) {
        return [{ text, color: "#FFFFFF", type: "default" as ColoredPartType }];
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
        const regex = new RegExp(`\\b${name}\\b`, "gi");
        let match;
        while ((match = regex.exec(text)) !== null) {
          allMatches.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
            color: "#61D26A", // Verde para player
            type: "player",
          });
        }
      });

      opponentCoffeemonNames.forEach((name: string) => {
        const regex = new RegExp(`\\b${name}\\b`, "gi");
        let match;
        while ((match = regex.exec(text)) !== null) {
          allMatches.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
            color: "#FF5A5F", // Vermelho para oponente
            type: "opponent",
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
          const overlaps = allMatches.some(
            (existing) =>
              startIndex < existing.index + existing.length &&
              existing.index < endIndex
          );

          if (!overlaps) {
            allMatches.push({
              index: startIndex,
              length: matchText.length,
              text: matchText,
              color: "#FF4B4B",
              type: "damage",
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
            color: "#FFFFFF",
            type: "default",
          });
        }
        // Adicionar nome colorido
        parts.push({
          text: match.text,
          color: match.color,
          type: match.type,
        });
        lastIndex = match.index + match.length;
      });

      // Adicionar texto restante
      if (lastIndex < text.length) {
        parts.push({
          text: text.slice(lastIndex),
          color: "#FFFFFF",
          type: "default",
        });
      }

      return parts.length > 0
        ? parts
        : [{ text, color: "#FFFFFF", type: "default" as ColoredPartType }];
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
                part.type === "damage" && styles.logEntryDamageText,
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
    const activeIndex =
      optimisticActiveIndex ?? myPlayerState?.activeCoffeemonIndex;
    const activeMon =
      activeIndex !== null ? myPlayerState?.coffeemons?.[activeIndex] : null;
    const needsSwitch =
      activeMon && (activeMon.isFainted || activeMon.currentHp <= 0);

    // 🔍 DEBUG: Verificar condições dos botões
    console.log("[BattleScreen] Button conditions:", {
      canAct,
      myPendingAction,
      needsSwitch,
      hasSwitchCandidate,
      isProcessing,
      turnPhase: battleState?.turnPhase,
      activeIndex,
      activeMon: activeMon
        ? {
            name: activeMon.name,
            hp: activeMon.currentHp,
            fainted: activeMon.isFainted,
          }
        : null,
      hasPendingEvents: battleState?.events && battleState.events.length > 0,
      eventsCount: battleState?.events?.length || 0,
      playerHasSelected: myPlayerState?.hasSelectedCoffeemon,
      opponentHasSelected: opponentPlayerState?.hasSelectedCoffeemon,
    });

    let statusText = "";

    if (battleEnded) {
      statusText = "BATALHA FINALIZADA!";
    } else if (isProcessing) {
      statusText = "PROCESSANDO TURNO...";
    } else if (myPendingAction) {
      statusText = "AGUARDANDO OPONENTE...";
    } else if (battleState?.turnPhase === "RESOLUTION") {
      statusText = "EXECUTANDO AÇÕES...";
    } else if (battleState?.turnPhase === "END_OF_TURN") {
      statusText = "FINALIZANDO TURNO...";
    } else if (battleState?.turnPhase === "SELECTION") {
      // ✅ Durante SELECTION, verificar se já selecionou ou está esperando
      const hasSelected = myPlayerState?.hasSelectedCoffeemon;
      const opponentSelected = opponentPlayerState?.hasSelectedCoffeemon;

      if (!hasSelected) {
        statusText = "ESCOLHA SEU COFFEEMON INICIAL";
      } else if (!opponentSelected) {
        statusText = "AGUARDANDO OPONENTE ESCOLHER...";
      } else {
        statusText = "PREPARANDO BATALHA...";
      }
    } else if (needsSwitch && canAct) {
      // ✅ SÓ MOSTRAR TROCA OBRIGATÓRIA quando for realmente o turno do jogador
      statusText = "SEU COFFEEMON DESMAIOU! ESCOLHA TROCAR OU FUGIR.";
    } else if (actionMode === "attack") {
      statusText = "ESCOLHA UM ATAQUE.";
    } else if (isSwitchModalVisible) {
      statusText = "ESCOLHA UM COFFEEMON PARA TROCAR.";
    } else if (battleState?.turnPhase === "SUBMISSION") {
      statusText = "ESCOLHA A SUA PRÓXIMA AÇÃO?";
    } else if (battleState?.currentPlayerId === playerId) {
      statusText = "SEU TURNO! ESCOLHA SUA AÇÃO.";
    } else if (battleState?.currentPlayerId) {
      statusText = "AGUARDANDO TURNO DO OPONENTE...";
    } else {
      statusText = "AGUARDANDO TURNO...";
    }

    return (
      <>
        <View style={styles.actionPromptContainer}>
          <Text style={styles.actionPromptText}>{statusText}</Text>
        </View>

        <View style={styles.mainActionsGrid}>
          {/* Botão Atacar - DESABILITADO se tiver mensagens não lidas, Coffeemon estiver fainted ou pendente */}
          <TouchableOpacity
            style={[
              styles.mainActionButton,
              styles.attackActionButton,
              (!canAct || myPendingAction || needsSwitch || hasUnreadMessages) &&
                styles.actionButtonDisabled,
            ]}
            onPress={() => {
              if (!hasUnreadMessages) {
                setActionMode("attack");
              }
            }}
            disabled={!canAct || myPendingAction || needsSwitch || hasUnreadMessages}
          >
            <Image
              source={getBattleIcon("attack")}
              style={styles.actionButtonIconImage}
            />
          </TouchableOpacity>

          {/* Botão Trocar - DISPONÍVEL apenas no turno do jogador, bloqueado se tiver mensagens */}
          <TouchableOpacity
            style={[
              styles.mainActionButton,
              styles.specialActionButton,
              (!hasSwitchCandidate ||
                isProcessing ||
                myPendingAction ||
                hasUnreadMessages ||
                battleState?.turnPhase === "RESOLUTION" ||
                !canAct) &&
                styles.actionButtonDisabled,
              needsSwitch &&
                canAct &&
                !hasUnreadMessages && { borderWidth: 6, borderColor: "#FFD700" }, // Destaque amarelo apenas quando for o turno E precisar trocar
            ]}
            onPress={() => {
              if (!hasUnreadMessages) {
                setSwitchModalVisible(true);
              }
            }}
            disabled={
              !hasSwitchCandidate ||
              isProcessing ||
              myPendingAction ||
              hasUnreadMessages ||
              battleState?.turnPhase === "RESOLUTION" ||
              !canAct
            }
          >
            <Image
              source={getBattleIcon("switch")}
              style={styles.actionButtonIconImage}
            />
          </TouchableOpacity>

          {/* Botão Item - HABILITADO se tiver itens e puder agir, bloqueado se tiver mensagens */}
          <TouchableOpacity
            style={[
              styles.mainActionButton,
              styles.itemActionButton,
              (!canAct || myPendingAction || items.length === 0 || hasUnreadMessages) &&
                styles.actionButtonDisabled,
            ]}
            onPress={() => {
              if (!hasUnreadMessages) {
                console.log("[BattleScreen] Item button pressed!");
                setItemModalVisible(true);
              }
            }}
            disabled={!canAct || myPendingAction || items.length === 0 || hasUnreadMessages}
          >
            <Image
              source={getBattleIcon("item")}
              style={styles.actionButtonIconImage}
            />
          </TouchableOpacity>

          {/* Botão Fugir - SEMPRE DISPONÍVEL, NUNCA BLOQUEADO */}
          <TouchableOpacity
            style={[
              styles.mainActionButton, 
              styles.fleeActionButton,
              battleEnded && styles.actionButtonDisabled,
            ]}
            onPress={onNavigateToMatchmaking}
            disabled={battleEnded}
          >
            <Image
              source={getBattleIcon("run")}
              style={styles.actionButtonIconImage}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderAttackButtons = () => {
    if (
      !myPlayerState ||
      (optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex) === null
    ) {
      return null;
    }

    const activeIndex =
      optimisticActiveIndex ?? myPlayerState.activeCoffeemonIndex!;
    const activeMon = myPlayerState.coffeemons?.[activeIndex];
    if (!activeMon || !activeMon.moves) return null;

    // ✅ VALIDAÇÃO: Verificar se Coffeemon pode atacar
    const attackValidation = canCoffeemonAttack(myPlayerState);
    const canAttack = canAct && attackValidation.valid;

    // Sistema de cores por tipo elemental (inspirado em Pokémon)
    const typeColors: {
      [key: string]: { primary: string; secondary: string; icon: string };
    } = {
      floral: { primary: "#E91E63", secondary: "#F48FB1", icon: "🌸" },
      sweet: { primary: "#FF6F91", secondary: "#FFB3C1", icon: "🍬" },
      fruity: { primary: "#FFC107", secondary: "#FFE082", icon: "🍋" },
      nutty: { primary: "#8D6E63", secondary: "#BCAAA4", icon: "🌰" },
      roasted: { primary: "#FF5722", secondary: "#FF8A65", icon: "🔥" },
      spicy: { primary: "#F44336", secondary: "#E57373", icon: "🌶️" },
      sour: { primary: "#4CAF50", secondary: "#81C784", icon: "🍃" },
    };

    return (
      <>
        {/* Área clicável para voltar */}
        <TouchableOpacity 
          style={styles.attackBackdrop}
          activeOpacity={1}
          onPress={() => setActionMode("main")}
        >
          <View style={styles.actionPromptContainer}>
            <TouchableOpacity
              style={styles.backButtonSmall}
              onPress={() => setActionMode("main")}
            >
              <Text style={styles.backButtonIcon}>◀️</Text>
            </TouchableOpacity>
            <Text style={styles.actionPromptText}>Escolha um ataque:</Text>
          </View>

          <View style={styles.attacksGrid} onStartShouldSetResponder={() => true}>
            {/* Sistema de 4 slots fixos */}
            {[0, 1, 2, 3].map((slotIndex) => {
              const move = activeMon.moves[slotIndex];

              // Se não há move neste slot, renderiza placeholder pontilhado
              if (!move) {
                return (
                  <View key={`empty-${slotIndex}`} style={styles.emptySlot}>
                    <Text style={styles.emptySlotText}>- - -</Text>
                  </View>
                );
              }

              // ✅ VALIDAÇÃO: Verificar se pode usar este movimento específico
              const moveValidation = canUseMove(myPlayerState, move.id);
              const canUseThisMove =
                canAttack && !myPendingAction && moveValidation.valid;

              const moveType = (move as any).elementalType || "roasted";
              const typeStyle = typeColors[moveType] || typeColors.roasted;

              return (
                <TouchableOpacity
                  key={move.id}
                  style={[
                    styles.attackButtonCompact,
                    !canUseThisMove && styles.attackButtonDisabled,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (canUseThisMove) {
                      sendAction("attack", { moveId: move.id });
                      setActionMode("main");
                    } else if (myPendingAction) {
                      console.log("Você já submeteu uma ação neste turno!");
                    } else if (!attackValidation.valid) {
                      console.log("Ataque bloqueado:", attackValidation.reason);
                    }
                  }}
                  disabled={!canUseThisMove}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[typeStyle.primary, typeStyle.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.attackButtonContent}
                  >
                    {/* Ícone do tipo grande e centralizado */}
                    <Text style={styles.attackTypeEmojiLarge}>
                      {typeStyle.icon}
                    </Text>
                    
                    {/* Nome do Move */}
                    <Text style={styles.attackButtonNameCompact} numberOfLines={2}>
                      {move.name}
                    </Text>
                    
                    {/* Botão de informação */}
                    <TouchableOpacity
                      style={styles.infoButtonBattle}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedMoveForDetails(move);
                        setShowMoveDetails(true);
                      }}
                    >
                      <Text style={styles.infoIconBattle}>ⓘ</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderItemButtons = () => {
    const playerInventory = myPlayerState?.inventory || {};

    return (
      <>
        <View style={styles.actionPromptContainer}>
          <TouchableOpacity
            style={styles.backButtonSmall}
            onPress={() => setActionMode("main")}
          >
            <Text style={styles.backButtonIcon}>◀️</Text>
          </TouchableOpacity>
          <Text style={styles.actionPromptText}>Escolha um item:</Text>
        </View>

        <ScrollView
          style={styles.itemsScrollView}
          contentContainerStyle={styles.itemsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => {
            const quantity = playerInventory[item.id] || 0;
            const hasItem = quantity > 0;
            const icon = getItemIcon(item.id);
            const effectType = item.effects[0]?.type || "heal";
            const color = getItemColor(effectType);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemButton,
                  { borderColor: color },
                  !hasItem && styles.itemButtonDisabled,
                ]}
                onPress={() => hasItem && handleSelectItem(item)}
                disabled={!hasItem}
              >
                <View style={styles.itemButtonContent}>
                  <Text style={styles.itemIcon}>{icon}</Text>
                  <View style={styles.itemTextContainer}>
                    <Text
                      style={[
                        styles.itemName,
                        !hasItem && styles.itemNameDisabled,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.itemDescription,
                        !hasItem && styles.itemDescriptionDisabled,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  {hasItem ? (
                    <View
                      style={[
                        styles.itemQuantityBadge,
                        { backgroundColor: color },
                      ]}
                    >
                      <Text style={styles.itemQuantityText}>x{quantity}</Text>
                    </View>
                  ) : (
                    <View style={styles.itemOutOfStockBadge}>
                      <Text style={styles.itemOutOfStockText}>0</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </>
    );
  };

  if (!battleState || !playerId || !isBattleReady) {
    return (
      <SafeAreaView
        style={[
          styles.battleContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
        edges={["left", "right", "bottom"]}
      >
        <View style={[styles.errorContainer, { maxWidth: "90%", padding: 20 }]}>
          <Text style={styles.loadingText}>⚔️ Preparando Batalha...</Text>
          <Text style={styles.loadingSubtext}>
            Aguarde enquanto carregamos os Coffeemons
          </Text>

          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ color: "#666", marginBottom: 10 }}>
              Status do Carregamento:
            </Text>
            <Text>
              • Battle State: {battleState ? "✅ Pronto" : "⏳ Carregando..."}
            </Text>
            <Text>
              • Player ID: {playerId ? `✅ ${playerId}` : "❌ Não definido"}
            </Text>
            <Text>
              • Batalha Pronta: {isBattleReady ? "✅ Sim" : "⏳ Aguardando..."}
            </Text>

            {!battleState && (
              <Text
                style={{ color: "#e74c3c", marginTop: 15, textAlign: "center" }}
              >
                Verificando estado da batalha...
              </Text>
            )}

            {!isBattleReady && battleState && (
              <Text
                style={{ color: "#f39c12", marginTop: 15, textAlign: "center" }}
              >
                Aguardando início da batalha...
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.battleContainer}
      edges={["left", "right", "bottom"]}
    >
      {/* Victory/Defeat Modal */}
      <VictoryModal
        visible={showVictoryModal}
        isVictory={winnerId === playerId}
        playerId={playerId}
        winnerId={winnerId || 0}
        rewards={battleRewards}
        onClose={() => {
          setShowVictoryModal(false);
          onNavigateToMatchmaking();
        }}
      />

      <TouchableOpacity
        activeOpacity={1}
        onPress={hasUnreadMessages ? handleTextBoxClick : undefined}
        style={styles.battleArena}
        disabled={!hasUnreadMessages}
      >
        <Animated.View style={[{ flex: 1 }, arenaWobble]} pointerEvents="box-none">
          <ImageBackground
            source={battleScenario}
            style={styles.battleArenaBackground}
            resizeMode="cover"
          >
            {playerSprite &&
              renderCoffeemonSprite(
                playerSprite.imageSource,
                true,
                `player-sprite-${playerSprite.index}-${playerSprite.state}-${playerSprite.variant}-${playerSprite.name}`
            )}
          {opponentSprite &&
            renderCoffeemonSprite(
              opponentSprite.imageSource,
              false,
              `opponent-sprite-${opponentSprite.state}-${opponentSprite.variant}-${opponentSprite.name}`
            )}

        {myPlayerState && (
          <BattleHUD
            playerState={
              optimisticActiveIndex !== null
                ? {
                    ...myPlayerState,
                    activeCoffeemonIndex: optimisticActiveIndex,
                  }
                : myPlayerState
            }
            isMe={true}
            damage={playerDamage}
            spriteVariant={playerHudVariant ?? "default"}
            imageSourceGetter={getCoffeemonImageSource}
            playerName={
              battleState?.player1Id === playerId
                ? battleState?.player1Info?.username
                : battleState?.player2Info?.username
            }
          />
        )}
        {opponentPlayerState && (
          <BattleHUD
            playerState={opponentPlayerState}
            isMe={false}
            damage={opponentDamage}
            spriteVariant={opponentHudVariant ?? "default"}
            imageSourceGetter={getCoffeemonImageSource}
            playerName={
              battleState?.player1Id === playerId
                ? battleState?.player2Info?.username
                : battleState?.player1Info?.username
            }
          />
        )}

        {/* Text Box Interativo - Topo da Tela */}
        {log.length > 0 && (
          <View pointerEvents={hasUnreadMessages ? "auto" : "box-none"}>
            <TouchableOpacity
              style={[
                styles.battleTextBox,
                hasUnreadMessages && styles.battleTextBoxUnread,
              ]}
              onPress={handleTextBoxClick}
              activeOpacity={0.8}
            >
            <View style={styles.textBoxContent}>
              <Text style={styles.textBoxMessage}>
                {displayedText}
              {isTyping && <Text style={styles.textBoxIndicator}>▮</Text>}
              </Text>
            </View>

            {/* Contador com setas integradas */}
            <View style={styles.textBoxCounterContainer}>
              <TouchableOpacity
                onPress={handlePreviousMessage}
                disabled={currentMessageIndex === 0}
                style={styles.textBoxNavButton}
              >
                <Text
                  style={[
                    styles.textBoxNavArrow,
                    currentMessageIndex === 0 && styles.textBoxNavArrowDisabled,
                  ]}
                >
                  ◂
                </Text>
              </TouchableOpacity>

              <Text style={[
                styles.textBoxCounter,
                hasUnreadMessages && styles.textBoxCounterUnread,
              ]}>
                {currentMessageIndex + 1}/{log.length}
              </Text>

              <TouchableOpacity
                onPress={handleNextMessage}
                disabled={currentMessageIndex === log.length - 1}
                style={styles.textBoxNavButton}
              >
                <Text
                  style={[
                    styles.textBoxNavArrow,
                    currentMessageIndex === log.length - 1 &&
                      styles.textBoxNavArrowDisabled,
                  ]}
                >
                  ▸
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          </View>
        )}
        </ImageBackground>
        </Animated.View>
      </TouchableOpacity>

      <View 
        style={styles.battleActionsContainer}
        pointerEvents={hasUnreadMessages ? "none" : "auto"}
      >
        {/* Renderiza conteúdo baseado no modo de ação */}
        {actionMode === "main" && renderMainActionButtons()}
        {actionMode === "attack" && renderAttackButtons()}
        {actionMode === "item" && renderItemButtons()}
      </View>

      <CoffeemonSelectionModal
        visible={showSelectionModal}
        availableCoffeemons={initialSelectionCandidates}
        onSelectCoffeemon={async (candidate) => {
          await selectInitialCoffeemon(candidate.index);
        }}
        onClose={() => {
          // Modal de seleção inicial não pode ser fechado
          console.log("[BattleScreen] Cannot close initial selection modal");
        }}
        renderCoffeemonCard={renderInitialSelectionCard}
        keyExtractor={(candidate) =>
          `${candidate.coffeemon.name}-${candidate.index}`
        }
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
          console.log("[BattleScreen] Closing switch modal");
          setSwitchModalVisible(false);
          if (stuckRecoveryTimeout) {
            clearTimeout(stuckRecoveryTimeout);
            setStuckRecoveryTimeout(null);
          }
        }}
        renderCoffeemonCard={renderSwitchCandidateCard}
        keyExtractor={(candidate) =>
          `${candidate.coffeemon.name}-${candidate.index}`
        }
        title="Trocar Coffeemon"
        emptyMessage="Nenhum Coffeemon disponível para troca"
      />

      {/* Modal de Detalhes de Moves */}
      <MoveDetailsModal
        visible={showMoveDetails}
        move={selectedMoveForDetails}
        onClose={() => {
          setShowMoveDetails(false);
          setSelectedMoveForDetails(null);
        }}
      />

      {/* Modais de Itens */}
      <ItemSelectionModal
        visible={isItemModalVisible}
        items={items}
        onSelectItem={handleSelectItem}
        onClose={handleCloseItemModals}
      />

      <ItemTargetModal
        visible={isItemTargetModalVisible}
        selectedItem={selectedItem}
        coffeemons={myPlayerState?.coffeemons || []}
        onSelectTarget={handleSelectItemTarget}
        onClose={handleCloseItemModals}
      />
    </SafeAreaView>
  );
}
