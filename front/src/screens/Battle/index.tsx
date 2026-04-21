import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useMatchChat } from "../../hooks/useMatchChat";
import { MatchChatMessage } from "../../types/social";
import { Coffeemon } from "../../types";
import { getBattleScenario } from "../../utils/battleUtils";
import {
  canCoffeemonAttack,
  canSelectInitialCoffeemon,
  canSwitchToCoffeemon,
  canUseMove,
} from "../../utils/battleValidation";
import { styles } from "./styles";

// ─── Match Chat Modal ─────────────────────────────────────────────────────────

const CHAT_ICON = require("../../../assets/iconsv2/chat.png");

function MatchChatModal({
  visible,
  messages,
  playerId,
  onSend,
  onClose,
}: {
  visible: boolean;
  messages: MatchChatMessage[];
  playerId: number;
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  React.useEffect(() => {
    if (visible && messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [visible, messages.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Toque fora fecha */}
      <Pressable style={chatModalStyles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={chatModalStyles.sheetWrapper}
        >
          {/* Impede que cliques no painel fechem o modal */}
          <Pressable style={chatModalStyles.sheet} onPress={(e) => e.stopPropagation()}>
            {/* Handle + header */}
            <View style={chatModalStyles.handle} />
            <View style={chatModalStyles.header}>
              <TouchableOpacity style={chatModalStyles.backBtn} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={chatModalStyles.backBtnText}>←</Text>
              </TouchableOpacity>
              <Text style={chatModalStyles.headerTitle}>Chat da Partida</Text>
            </View>

            {/* Messages */}
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(_, i) => i.toString()}
              style={chatModalStyles.list}
              contentContainerStyle={chatModalStyles.listContent}
              ListEmptyComponent={
                <Text style={chatModalStyles.empty}>
                  Nenhuma mensagem ainda.{"\n"}Diga algo ao seu oponente!
                </Text>
              }
              renderItem={({ item }) => {
                const isMine = item.senderId === playerId;
                return (
                  <View style={[chatModalStyles.bubble, isMine ? chatModalStyles.bubbleMine : chatModalStyles.bubbleTheirs]}>
                    {!isMine && (
                      <Text style={chatModalStyles.bubbleSender}>{item.senderUsername}</Text>
                    )}
                    <Text style={[chatModalStyles.bubbleText, isMine && chatModalStyles.bubbleTextMine]}>
                      {item.content}
                    </Text>
                  </View>
                );
              }}
            />

            {/* Input */}
            <View style={chatModalStyles.inputRow}>
              <TextInput
                style={chatModalStyles.input}
                value={text}
                onChangeText={setText}
                placeholder="Mensagem..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                maxLength={200}
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
                autoFocus={visible}
              />
              <TouchableOpacity
                style={[chatModalStyles.sendBtn, !text.trim() && { opacity: 0.4 }]}
                onPress={handleSend}
                disabled={!text.trim()}
              >
                <Text style={chatModalStyles.sendBtnText}>↑</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const chatModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#0F0A19",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: "rgba(108,63,212,0.4)",
    height: 380,
    overflow: "hidden",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
    gap: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: "#6C3FD4",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  list: { flex: 1 },
  listContent: { padding: 12, gap: 6, flexGrow: 1, justifyContent: "flex-end" },
  empty: {
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 32,
  },
  bubble: {
    maxWidth: "76%",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  bubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#6C3FD4",
    borderBottomRightRadius: 3,
  },
  bubbleTheirs: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderBottomLeftRadius: 3,
  },
  bubbleSender: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 3,
  },
  bubbleText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    lineHeight: 19,
  },
  bubbleTextMine: { color: "#fff" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(108,63,212,0.4)",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6C3FD4",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});

interface BattleScreenProps {
  battleId: string;
  battleState: any;
  playerId: number;
  token: string;
  socket: Socket;
  onNavigateToMatchmaking: (keepActiveBattle?: boolean) => void;
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
            onPress={() => onNavigateToMatchmaking()}
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
    opponentDisconnected,
    disconnectCountdown,
    isReconnecting,
    reconnectCountdown,
  } = battle;

  // Estado local para controle de modo de ação
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

  // 💬 CHAT EM PARTIDA (somente PvP, não bot)
  const isBotBattle = !!initialBattleData?.isBotBattle;
  const [chatOpen, setChatOpen] = useState(false);
  const matchChat = useMatchChat({ socket, playerId, enabled: !isBotBattle });

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

  // 📝 Detectar novas mensagens e bloquear ações
  React.useEffect(() => {
    if (log.length > lastProcessedLogLength) {
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
        setHasUnreadMessages(false);
        setLastProcessedLogLength(log.length);
      }
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
            onPress={canSwitch ? () => onSelect() : undefined}
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
            onPress={canSelect ? () => onSelect() : undefined}
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
    if (isProcessing) return;
    if (myPendingAction) return;

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
    const loadItems = async () => {
      try {
        if (token) {
          const playerItems = await getPlayerItems(token);
          setItems(playerItems);
        }
      } catch (error) {
        console.error("[BattleScreen] Error loading items:", error);
      }
    };

    loadItems();
  }, [token]);

  // 💼 Funções de manipulação de itens
  const handleSelectItem = (item: Item) => {
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
          onError={() => {
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

  const renderMainActionButtons = () => {
    // ✅ VERIFICAR SE TROCA É NECESSÁRIA: Coffeemon ativo está fainted
    const activeIndex =
      optimisticActiveIndex ?? myPlayerState?.activeCoffeemonIndex;
    const activeMon =
      activeIndex !== null ? myPlayerState?.coffeemons?.[activeIndex] : null;
    const needsSwitch =
      activeMon && (activeMon.isFainted || activeMon.currentHp <= 0);

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
            onPress={() => onNavigateToMatchmaking()}
            disabled={battleEnded}
          >
            <Image
              source={getBattleIcon("run")}
              style={styles.actionButtonIconImage}
            />
          </TouchableOpacity>

          {/* Botão Chat - só PvP */}
          {!isBotBattle && (
            <TouchableOpacity
              style={[styles.mainActionButton, styles.chatActionButton]}
              onPress={() => {
                setChatOpen(true);
                matchChat.markRead();
              }}
              activeOpacity={0.8}
            >
              <Image
                source={CHAT_ICON}
                style={styles.actionButtonIconImage}
              />
              {matchChat.unreadCount > 0 && (
                <View style={styles.chatUnreadBadge}>
                  <Text style={styles.chatUnreadBadgeText}>
                    {matchChat.unreadCount > 9 ? "9+" : matchChat.unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
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
          selectInitialCoffeemon(candidate.index);
        }}
        onClose={() => {}}
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

      {/* Modal de chat em partida (somente PvP) */}
      <MatchChatModal
        visible={chatOpen}
        messages={matchChat.messages}
        playerId={playerId}
        onSend={matchChat.send}
        onClose={() => {
          setChatOpen(false);
          matchChat.onClose();
        }}
      />

      {/* Overlay: oponente desconectado */}
      {opponentDisconnected && !battleEnded && (
        <View style={battleOverlayStyles.backdrop}>
          <View style={battleOverlayStyles.card}>
            <Text style={battleOverlayStyles.icon}>⚠️</Text>
            <Text style={battleOverlayStyles.title}>Oponente desconectou</Text>
            <Text style={battleOverlayStyles.subtitle}>
              Aguardando reconexão...
            </Text>
            {disconnectCountdown !== null && (
              <View style={battleOverlayStyles.countdownRow}>
                <Text style={battleOverlayStyles.countdownLabel}>A partida encerra em</Text>
                <Text style={battleOverlayStyles.countdownNumber}>{disconnectCountdown}s</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Overlay: próprio socket reconectando */}
      {isReconnecting && (
        <View style={battleOverlayStyles.backdrop}>
          <View style={battleOverlayStyles.card}>
            {reconnectCountdown != null && reconnectCountdown > 0 ? (
              <View style={battleOverlayStyles.countdownRing}>
                <Text style={battleOverlayStyles.countdownNumber}>{reconnectCountdown}</Text>
              </View>
            ) : (
              <Text style={battleOverlayStyles.icon}>🔄</Text>
            )}
            <Text style={battleOverlayStyles.title}>Reconectando...</Text>
            <Text style={battleOverlayStyles.subtitle}>
              {reconnectCountdown != null && reconnectCountdown > 0
                ? `Você tem ${reconnectCountdown}s para voltar`
                : 'Tentando reconectar...'}
            </Text>
            {reconnectCountdown != null && reconnectCountdown <= 15 && (
              <TouchableOpacity
                style={battleOverlayStyles.exitBtn}
                onPress={() => onNavigateToMatchmaking(true)}
                activeOpacity={0.8}
              >
                <Text style={battleOverlayStyles.exitBtnText}>Ir para o lobby</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const battleOverlayStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: '#1E1A14',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8A26B',
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: 'center',
    gap: 8,
    minWidth: 220,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    color: '#F5E6C8',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A89070',
    fontSize: 13,
    textAlign: 'center',
  },
  countdownRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#C8A26B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  exitBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(200,162,107,0.15)',
    borderWidth: 1,
    borderColor: '#C8A26B',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  exitBtnText: {
    color: '#C8A26B',
    fontSize: 14,
    fontWeight: '700',
  },
  countdownRow: {
    marginTop: 8,
    alignItems: 'center',
    gap: 2,
  },
  countdownLabel: {
    color: '#A89070',
    fontSize: 12,
  },
  countdownNumber: {
    color: '#F5E6C8',
    fontSize: 26,
    fontWeight: '800',
  },
});
