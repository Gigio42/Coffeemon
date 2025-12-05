import React, { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Socket } from "socket.io-client";
import {
  CoffeemonVariant,
  getCoffeemonImage,
} from "../../../assets/coffeemons";
import {
  Item,
  getPlayerItems,
} from "../../api/itemsService";
import BattleHUD from "../../components/Battle/BattleHUD";
import BattleEndOverlay from "../../components/Battle/BattleEndOverlay";
import BattleSprite from "../../components/Battle/BattleSprite";
import BattleTextBox from "../../components/Battle/BattleTextBox";
import { styles as switchModalStyles } from "../../components/Battle/SwitchModal/styles";
import CoffeemonCard from "../../components/CoffeemonCard";
import CoffeemonSelectionModal from "../../components/CoffeemonSelectionModal";
import ItemSelectionModal from "../../components/ItemSelectionModal";
import ItemTargetModal from "../../components/ItemTargetModal";
import { useBattle } from "../../hooks/useBattle";
import { useBattleAnimations } from "../../hooks/useBattleAnimations";
import { useBattleItems } from "../../hooks/useBattleItems";
import { useBattleSprites } from "../../hooks/useBattleSprites";
import { useTypewriter } from "../../hooks/useTypewriter";
import { Coffeemon, Move } from "../../types";
import { getBattleScenario } from "../../utils/battleUtils";
import {
  canSelectInitialCoffeemon,
  canSwitchToCoffeemon,
  canUseMove,
} from "../../utils/battleValidation";
import { SwitchCandidate } from "./battleHelpers";
import { styles } from "./styles";

interface BattleScreenProps {
  battleId: string;
  battleState: any;
  playerId: number;
  token: string;
  socket: Socket;
  onNavigateToMatchmaking: () => void;
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
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao iniciar batalha</Text>
          <TouchableOpacity onPress={onNavigateToMatchmaking} style={styles.returnButton}>
            <Text style={styles.returnButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Hooks de animação
  const animations = useBattleAnimations();
  const { playerAnimStyle, opponentAnimStyle, playLunge, playShake, playCritShake, playFaint, playSwitchIn, reset: resetAnimations } = animations;

  // Helper para obter imagem
  const getCoffeemonImageSource = (name: string, variant: CoffeemonVariant = "default") => {
    return getCoffeemonImage(name, variant);
  };

  // Hook principal de batalha
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

  // Estado local
  const [actionMode, setActionMode] = useState<"main" | "attack" | "item">("main");
  const [isSwitchModalVisible, setSwitchModalVisible] = useState(false);
  const [optimisticActiveIndex, setOptimisticActiveIndex] = useState<number | null>(null);
  const [isItemModalVisible, setItemModalVisible] = useState(false);
  const [isItemTargetModalVisible, setItemTargetModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Hook de typewriter para mensagens
  const typewriter = useTypewriter(log);
  const { currentMessageIndex, displayedText, isTyping, skipTyping, goToPrevious, goToNext } = typewriter;

  // Hook de items
  const { items, playerItems, reloadItems } = useBattleItems(playerId, token);

  // Hook de sprites
  const sprites = useBattleSprites(
    myPlayerState,
    opponentPlayerState,
    optimisticActiveIndex,
    resolveSpriteVariant,
    getCoffeemonImageSource
  );
  const { playerSprite, opponentSprite, playerHudVariant, opponentHudVariant } = sprites;

  const battleScenario = getBattleScenario(battleId);

  // Lógica de candidatos para troca
  const switchCandidates = useMemo<SwitchCandidate[]>(() => {
    if (!myPlayerState || !Array.isArray(myPlayerState.coffeemons)) {
      return [];
    }

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

  // Handlers
  const handleAttack = (moveIndex: number) => {
    const activeIndex = myPlayerState?.activeCoffeemonIndex;
    if (activeIndex === null || activeIndex === undefined) return;

    const activeMon = myPlayerState.coffeemons[activeIndex];
    if (!activeMon) return;

    const move = activeMon.moves[moveIndex];
    if (!move) return;

    sendAction("move", { moveIndex });
    setActionMode("main");
  };

  const handleSwitch = (index: number) => {
    if (isProcessing || myPendingAction) return;

    setOptimisticActiveIndex(index);
    sendAction("switch", { newIndex: index });
    setSwitchModalVisible(false);

    // Reset otimista após 5 segundos
    setTimeout(() => setOptimisticActiveIndex(null), 5000);
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setItemModalVisible(false);
    setItemTargetModalVisible(true);
  };

  const handleSelectItemTarget = (targetIndex: number) => {
    if (!selectedItem) return;

    sendAction("useItem", {
      itemId: selectedItem.id,
      targetIndex,
    });

    setItemTargetModalVisible(false);
    setSelectedItem(null);
    reloadItems();
  };

  const handleCloseItemModals = () => {
    setItemModalVisible(false);
    setItemTargetModalVisible(false);
    setSelectedItem(null);
  };

  // Render helpers
  const renderSwitchCandidateCard = (
    candidate: SwitchCandidate,
    { onSelect, isLoading }: { onSelect: () => Promise<void>; isLoading: boolean }
  ) => {
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
        types: coffeemon.types || ["roasted"],
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
          disabled={!canSwitch}
        />
        {!canSwitch && reason && (
          <Text style={[switchModalStyles.disabledText, { textAlign: "center", color: "#ff6b6b" }]}>
            {reason}
          </Text>
        )}
      </View>
    );
  };

  const renderInitialSelectionCard = (
    candidate: any,
    { onSelect, isLoading }: { onSelect: () => Promise<void>; isLoading: boolean }
  ) => {
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
        types: coffeemon.types || ["roasted"],
        defaultImage: undefined,
      },
    };

    return (
      <View>
        <CoffeemonCard
          coffeemon={fakePlayerCoffeemon}
          onToggleParty={canSelect ? async (c) => await onSelect() : async () => {}}
          variant="large"
          isLoading={isLoading || !canSelect}
          disabled={!canSelect}
        />
        {!canSelect && reason && (
          <Text style={[switchModalStyles.disabledText, { textAlign: "center", color: "#ff6b6b" }]}>
            {reason}
          </Text>
        )}
      </View>
    );
  };

  // Loading state
  if (!battleState || !playerId || !isBattleReady) {
    return (
      <SafeAreaView style={[styles.battleContainer, { justifyContent: "center", alignItems: "center" }]} edges={["left", "right", "bottom"]}>
        <View style={[styles.errorContainer, { maxWidth: "90%", padding: 20 }]}>
          <Text style={styles.loadingText}>⚔️ Preparando Batalha...</Text>
          <Text style={styles.loadingSubtext}>Aguarde enquanto carregamos os Coffeemons</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Compute active Coffeemon data
  const activeIndex = myPlayerState?.activeCoffeemonIndex;
  const activeMon = activeIndex !== null && activeIndex !== undefined ? myPlayerState?.coffeemons?.[activeIndex] : null;
  const needsSwitch = activeMon && (activeMon.isFainted || activeMon.currentHp <= 0);

  return (
    <SafeAreaView style={styles.battleContainer} edges={["left", "right", "bottom"]}>
      {battleEnded && (
        <BattleEndOverlay
          winnerId={winnerId!}
          playerId={playerId}
          onReturnToMatchmaking={onNavigateToMatchmaking}
        />
      )}

      <ImageBackground source={battleScenario} style={styles.battleArena} resizeMode="cover">
        {playerSprite && (
          <BattleSprite
            imageSource={playerSprite.imageSource}
            isPlayer={true}
            animStyle={playerAnimStyle}
            uniqueKey={`player-${playerSprite.index}-${playerSprite.variant}`}
          />
        )}

        {opponentSprite && (
          <BattleSprite
            imageSource={opponentSprite.imageSource}
            isPlayer={false}
            animStyle={opponentAnimStyle}
            uniqueKey={`opponent-${opponentSprite.variant}`}
          />
        )}

        {myPlayerState && (
          <BattleHUD
            playerState={optimisticActiveIndex !== null ? { ...myPlayerState, activeCoffeemonIndex: optimisticActiveIndex } : myPlayerState}
            isMe={true}
            damage={playerDamage}
            spriteVariant={playerHudVariant ?? "default"}
            imageSourceGetter={getCoffeemonImageSource}
          />
        )}

        {opponentPlayerState && (
          <BattleHUD
            playerState={opponentPlayerState}
            isMe={false}
            damage={opponentDamage}
            spriteVariant={opponentHudVariant ?? "default"}
            imageSourceGetter={getCoffeemonImageSource}
          />
        )}

        <BattleTextBox
          message={displayedText}
          isTyping={isTyping}
          currentIndex={currentMessageIndex}
          totalMessages={log.length}
          onTextBoxClick={skipTyping}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      </ImageBackground>

      <View style={styles.battleActionsContainer}>
        {actionMode === "main" && (
          <View>
            <View style={styles.actionPromptContainer}>
              <Text style={styles.actionPromptText}>
                {needsSwitch ? "SEU COFFEEMON DESMAIOU! TROQUE." : "ESCOLHA SUA AÇÃO"}
              </Text>
            </View>
            
            <View style={styles.mainActionsGrid}>
              <TouchableOpacity
                style={[styles.mainActionButton, styles.attackActionButton, (!canAct || !!needsSwitch) && styles.actionButtonDisabled]}
                onPress={() => setActionMode("attack")}
                disabled={!canAct || !!needsSwitch}
              >
                <Text>⚔️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainActionButton, styles.specialActionButton, (!hasSwitchCandidate || !canAct) && styles.actionButtonDisabled]}
                onPress={() => setSwitchModalVisible(true)}
                disabled={!hasSwitchCandidate || !canAct}
              >
                <Text>🔄</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainActionButton, styles.itemActionButton, (items.length === 0 || !canAct) && styles.actionButtonDisabled]}
                onPress={() => setItemModalVisible(true)}
                disabled={items.length === 0 || !canAct}
              >
                <Text>🎒</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainActionButton, styles.fleeActionButton]}
                onPress={onNavigateToMatchmaking}
              >
                <Text>🏃</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {actionMode === "attack" && activeMon && (
          <View style={styles.attacksContainer}>
            <View style={styles.attacksGrid}>
              {activeMon.moves.map((move: Move, index: number) => {
                const canUse = move.power && move.power > 0;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.attackButton, !canUse && styles.attackButtonDisabled]}
                    onPress={() => handleAttack(index)}
                    disabled={!canUse}
                  >
                    <View style={styles.attackButtonGradient}>
                      <View style={styles.attackButtonHeader}>
                        <Text>{move.name}</Text>
                        <Text>⚡ {move.power || "—"}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      <CoffeemonSelectionModal
        visible={showSelectionModal}
        availableCoffeemons={initialSelectionCandidates}
        onSelectCoffeemon={async (candidate) => await selectInitialCoffeemon(candidate.index)}
        onClose={() => {}}
        renderCoffeemonCard={renderInitialSelectionCard}
        keyExtractor={(candidate) => `${candidate.coffeemon.name}-${candidate.index}`}
        title="Escolha seu Coffeemon Inicial"
        emptyMessage="Nenhum Coffeemon disponível"
      />

      <CoffeemonSelectionModal
        visible={isSwitchModalVisible}
        availableCoffeemons={switchCandidates}
        onSelectCoffeemon={async (candidate) => await handleSwitch(candidate.index)}
        onClose={() => setSwitchModalVisible(false)}
        renderCoffeemonCard={renderSwitchCandidateCard}
        keyExtractor={(candidate) => `${candidate.coffeemon.name}-${candidate.index}`}
        title="Trocar Coffeemon"
        emptyMessage="Nenhum Coffeemon disponível para troca"
      />

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
