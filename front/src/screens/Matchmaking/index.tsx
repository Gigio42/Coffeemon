import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Image,
  ActivityIndicator,
  View as RNView,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Socket } from 'socket.io-client';
import { BattleState } from '../../types';
import { usePlayer } from '../../hooks/usePlayer';
import PlayerStatus from '../../components/PlayerStatus';
import { useMatchmaking } from '../../hooks/useMatchmaking';
import { useCoffeemons } from '../../hooks/useCoffeemons';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { prefetchPalette, useDynamicPalette, type Palette } from '../../utils/colorPalette';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { BattleFormat, FORMAT_LABELS, FORMAT_SIZE, GameLobby } from '../../types/lobby';

import TeamFormation from '../../components/TeamFormation';
import SlidingBottomSheet, { type SlidingBottomSheetSection } from '../../components/SlidingBottomSheet';
import CoffeemonDetailsModal from '../../components/CoffeemonDetailsModal';
import CoffeemonSelectionModal from '../../components/CoffeemonSelectionModal';

import { styles, lobbyOverlayStyles, toastStyles } from './styles';
import { getTypeColorScheme, spacing } from '../../theme/colors';
import QRScanner from './QRScanner';

const BOT_ICON = require('../../../assets/iconsv2/coach.png');
const PRIVATE_ICON = require('../../../assets/iconsv2/swords.png');
const ROOMS_ICON = require('../../../assets/iconsv2/swords.png');
const BOT_MIA_ICON = require('../../../assets/bots/mia.png');
const BOT_JOHN_ICON = require('../../../assets/bots/john.png');

const NOISE_SOURCE = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIUlEQVR42mP8z8AARMAw///MIMcAIeyMBIgiIYlQAgB0Sw4DsxMyYAAAAASUVORK5CYII=',
} as const;

const DEFAULT_BACKGROUND_PALETTE: Palette = {
  light: '#F5F5F5', dark: '#2C1810', accent: '#8B4513',
};

const FORMAT_BADGE_COLOR: Record<BattleFormat, string> = {
  '1v1': '#10B981', '2v2': '#F59E0B', '3v3': '#3B82F6',
};

interface MatchmakingScreenProps {
  token: string;
  playerId: number;
  onNavigateToLogin: () => void;
  onNavigateToEcommerce?: () => void;
  onNavigateToBattle: (battleId: string, battleState: BattleState, socket: Socket) => void;
  skipIntro?: boolean;
  onIntroFinish?: () => void;
  isActive?: boolean;
}

type SheetTab = 'private' | 'rooms' | 'bots';

export default function MatchmakingScreen({
  token,
  playerId,
  onNavigateToLogin,
  onNavigateToEcommerce,
  onNavigateToBattle,
  skipIntro = false,
  onIntroFinish,
  isActive = false,
}: MatchmakingScreenProps) {
  const [introLoading, setIntroLoading] = useState(true);
  const [showContent, setShowContent] = useState(skipIntro);
  const [progress, setProgress] = useState(skipIntro ? 100 : 0);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTab, setSheetTab] = useState<SheetTab>('rooms');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDetailsCoffeemon, setSelectedDetailsCoffeemon] = useState<PlayerCoffeemon | null>(null);
  const [activeCoffeemon, setActiveCoffeemon] = useState<PlayerCoffeemon | null>(null);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);

  const ensuredPalettesRef = useRef<Set<number>>(new Set());
  const privateBtnScale = useRef(new Animated.Value(1)).current;
  const roomsBtnScale = useRef(new Animated.Value(1)).current;
  const botBtnScale = useRef(new Animated.Value(1)).current;
  const searchingPulse = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { player } = usePlayer(token);
  const {
    partyLoading, partyMembers, availableCoffeemons,
    fetchCoffeemons, toggleParty, swapPartyMembers, initialized: coffeemonsInitialized,
  } = useCoffeemons({ token, playerId });

  useEffect(() => {
    if (isActive) {
      fetchCoffeemons();
    }
  }, [isActive]);

  const {
    isSearching, isStarting, format, currentLobby, publicLobbies,
    newLobbyAlert, lobbyError, activeBattleId, reconnectSecondsLeft, findBotMatch, createLobby, joinLobby,
    leaveLobby, startLobby, refreshLobbies, cancelMatch, dismissAlert, clearLobbyError,
    rejoinBattle, clearActiveBattle,
  } = useMatchmaking({
    token,
    playerId,
    partyCount: partyMembers.length,
    onNavigateToLogin,
    onNavigateToBattle,
  });

  const hasParty = partyMembers.length > 0;
  const formatColor = FORMAT_BADGE_COLOR[format];

  // Intro
  useEffect(() => { setIntroLoading(false); }, []);
  useEffect(() => {
    if (skipIntro) { if (!showContent) setShowContent(true); return; }
    if (introLoading || !coffeemonsInitialized) return;
    const totalTime = 800;
    const startTime = Date.now();
    let rafId: number;
    const easeOut = (t: number) => t * (2 - t);
    const tick = () => {
      const ratio = Math.min((Date.now() - startTime) / totalTime, 1);
      setProgress(Math.min(easeOut(ratio) * 100, 100));
      if (ratio < 1) { rafId = requestAnimationFrame(tick); }
      else { setProgress(100); setTimeout(() => { setShowContent(true); onIntroFinish?.(); }, 100); }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [introLoading, coffeemonsInitialized, skipIntro]);

  // Lobby error
  useEffect(() => {
    if (!lobbyError) return;
    Alert.alert('Erro', lobbyError, [{ text: 'OK', onPress: clearLobbyError }]);
  }, [lobbyError, clearLobbyError]);

  // Toast
  useEffect(() => {
    if (!newLobbyAlert) { toastAnim.setValue(0); return; }
    Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => dismissAlert(), 4000);
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [newLobbyAlert, dismissAlert]);

  // Searching pulse
  useEffect(() => {
    if (!isSearching) { searchingPulse.setValue(1); return; }
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(searchingPulse, { toValue: 1.15, duration: 700, useNativeDriver: true }),
      Animated.timing(searchingPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]));
    pulse.start();
    return () => pulse.stop();
  }, [isSearching]);

  // Active coffeemon
  useEffect(() => {
    if (!partyMembers?.length) { setActiveCoffeemon(null); return; }
    const exists = activeCoffeemon && partyMembers.some((m: PlayerCoffeemon) => m.id === activeCoffeemon.id);
    if (!exists) setActiveCoffeemon(partyMembers[0] ?? null);
  }, [partyMembers]);

  // Palette prefetch (background, non-blocking)
  useEffect(() => {
    if (!coffeemonsInitialized) { ensuredPalettesRef.current.clear(); return; }
    const pending = [...partyMembers, ...availableCoffeemons].filter(
      (c) => !ensuredPalettesRef.current.has(c.id)
    );
    if (!pending.length) return;
    let cancelled = false;
    Promise.allSettled(pending.map(async (c) => {
      const variant = getVariantForStatusEffects(c.statusEffects, 'default');
      const asset = getCoffeemonImage(c.coffeemon.name, variant);
      const colors = getTypeColorScheme(c.coffeemon.types?.[0] || 'roasted');
      await prefetchPalette(asset, { light: colors.light, dark: colors.dark, accent: colors.primary });
    })).then(() => { if (!cancelled) pending.forEach((c) => ensuredPalettesRef.current.add(c.id)); });
    return () => { cancelled = true; };
  }, [coffeemonsInitialized, partyMembers, availableCoffeemons]);

  // Dynamic palette
  const fallbackPalette = useMemo((): Palette => {
    if (!activeCoffeemon) return DEFAULT_BACKGROUND_PALETTE;
    const colors = getTypeColorScheme(activeCoffeemon.coffeemon.types?.[0] || 'roasted');
    return { light: colors.light, dark: colors.dark, accent: colors.primary };
  }, [activeCoffeemon]);
  const activeVariant = useMemo(
    () => activeCoffeemon ? getVariantForStatusEffects(activeCoffeemon.statusEffects, 'default') : 'default',
    [activeCoffeemon]
  );
  const activeAsset = useMemo(
    () => activeCoffeemon ? getCoffeemonImage(activeCoffeemon.coffeemon.name, activeVariant) : null,
    [activeCoffeemon?.coffeemon.name, activeVariant]
  );
  const palette = useDynamicPalette(activeAsset, fallbackPalette);

  const pressAnim = (ref: Animated.Value) =>
    Animated.sequence([
      Animated.timing(ref, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(ref, { toValue: 1.1, duration: 130, useNativeDriver: true }),
      Animated.timing(ref, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();

  const handleOpenSheet = useCallback((tab: SheetTab) => {
    setSheetTab(tab);
    if (tab === 'rooms') refreshLobbies();
    setSheetVisible(true);
  }, [refreshLobbies]);
  const handleCloseSheet = useCallback(() => setSheetVisible(false), []);

  const handleCreatePrivate = useCallback(() => {
    if (!hasParty) return;
    createLobby('private'); handleCloseSheet();
  }, [hasParty, createLobby]);

  const handleCreatePublic = useCallback(() => {
    if (!hasParty) return;
    createLobby('public'); handleCloseSheet();
  }, [hasParty, createLobby]);

  const handleJoinByCode = useCallback(() => {
    const code = joinCodeInput.trim().toUpperCase();
    if (code.length !== 6) { Alert.alert('Código inválido', 'O código deve ter 6 caracteres.'); return; }
    joinLobby(code); setJoinCodeInput(''); handleCloseSheet();
  }, [joinCodeInput, joinLobby]);

  const handleJoinPublic = useCallback((lobby: GameLobby) => {
    joinLobby(lobby.id); handleCloseSheet();
  }, [joinLobby]);

  const handleFindBot = useCallback((botProfileId: string) => {
    if (!hasParty) return;
    findBotMatch(botProfileId); handleCloseSheet();
  }, [hasParty, findBotMatch]);

  const handleOpenDetails = useCallback((c: PlayerCoffeemon) => {
    setSelectedDetailsCoffeemon(c); setDetailsModalVisible(true);
  }, []);
  const handleCloseDetails = useCallback(() => {
    setDetailsModalVisible(false); setSelectedDetailsCoffeemon(null);
  }, []);

  // No-party banner shown inside sheets
  const noPartyBanner = (
    <View style={matchStyles.noPartyBanner}>
      <Text style={matchStyles.noPartyEmoji}>☕</Text>
      <Text style={matchStyles.noPartyText}>Adicione Coffeemons ao time para batalhar</Text>
    </View>
  );

  const sheetSections: SlidingBottomSheetSection[] = useMemo(() => {
    if (sheetTab === 'private') {
      return [{
        key: 'private',
        title: 'Partida Privada',
        content: (
          <View style={styles.sheetSectionContent}>
            {!hasParty ? noPartyBanner : (
              <>
                <View style={matchStyles.formatInfoRow}>
                  <Text style={matchStyles.formatInfoLabel}>Formato detectado</Text>
                  <View style={[matchStyles.formatInfoBadge, { backgroundColor: formatColor }]}>
                    <Text style={matchStyles.formatInfoBadgeText}>{FORMAT_LABELS[format]}</Text>
                  </View>
                  <Text style={matchStyles.formatInfoSub}>({partyMembers.length} no time)</Text>
                </View>
                <View style={styles.sheetDividerRow}>
                  <View style={styles.sheetDivider} />
                  <Text style={styles.sheetDividerText}>Criar sala</Text>
                  <View style={styles.sheetDivider} />
                </View>
                <TouchableOpacity
                  style={styles.sheetActionButton}
                  onPress={handleCreatePrivate}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sheetActionButtonText}>🔒 Criar sala privada</Text>
                  <Text style={styles.sheetActionButtonSub}>Compartilhe o código com um amigo</Text>
                </TouchableOpacity>
                <View style={styles.sheetDividerRow}>
                  <View style={styles.sheetDivider} />
                  <Text style={styles.sheetDividerText}>Entrar com código</Text>
                  <View style={styles.sheetDivider} />
                </View>
                <View style={styles.joinCodeRow}>
                  <TextInput
                    style={styles.joinCodeInput}
                    placeholder="ABC123"
                    placeholderTextColor="#9CA3AF"
                    value={joinCodeInput}
                    onChangeText={(t) => setJoinCodeInput(t.toUpperCase())}
                    maxLength={6}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={[styles.joinCodeButton, joinCodeInput.length !== 6 && styles.joinCodeButtonDisabled]}
                    onPress={handleJoinByCode}
                    disabled={joinCodeInput.length !== 6}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.joinCodeButtonText}>Entrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ),
      }];
    }

    if (sheetTab === 'rooms') {
      return [{
        key: 'rooms',
        title: 'Salas Públicas',
        content: (
          <View style={styles.sheetSectionContent}>
            {!hasParty ? noPartyBanner : (
              <>
                <View style={matchStyles.formatInfoRow}>
                  <Text style={matchStyles.formatInfoLabel}>Formato detectado</Text>
                  <View style={[matchStyles.formatInfoBadge, { backgroundColor: formatColor }]}>
                    <Text style={matchStyles.formatInfoBadgeText}>{FORMAT_LABELS[format]}</Text>
                  </View>
                  <Text style={matchStyles.formatInfoSub}>({partyMembers.length} no time)</Text>
                </View>
                <TouchableOpacity
                  style={styles.sheetActionButton}
                  onPress={handleCreatePublic}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sheetActionButtonText}>🌐 Criar sala pública</Text>
                  <Text style={styles.sheetActionButtonSub}>Qualquer jogador pode entrar</Text>
                </TouchableOpacity>
              </>
            )}
            <View style={styles.sheetDividerRow}>
              <View style={styles.sheetDivider} />
              <Text style={styles.sheetDividerText}>
                {publicLobbies.length > 0
                  ? `${publicLobbies.length} sala${publicLobbies.length > 1 ? 's' : ''} disponível`
                  : 'Nenhuma sala disponível'}
              </Text>
              <View style={styles.sheetDivider} />
            </View>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              {publicLobbies.length === 0 ? (
                <Text style={styles.sheetEmptyText}>Nenhuma sala aberta no momento</Text>
              ) : (
                publicLobbies.map((lobby) => (
                  <LobbyCard key={lobby.id} lobby={lobby} onJoin={handleJoinPublic} disabled={!hasParty} />
                ))
              )}
            </ScrollView>
          </View>
        ),
      }];
    }

    return [{
      key: 'bots',
      title: 'Treino com Bot',
      content: (
        <View style={styles.sheetSectionContent}>
          {!hasParty ? noPartyBanner : (
            <View style={matchStyles.formatInfoRow}>
              <Text style={matchStyles.formatInfoLabel}>Formato detectado</Text>
              <View style={[matchStyles.formatInfoBadge, { backgroundColor: formatColor }]}>
                <Text style={matchStyles.formatInfoBadgeText}>{FORMAT_LABELS[format]}</Text>
              </View>
              <Text style={matchStyles.formatInfoSub}>({partyMembers.length} no time)</Text>
            </View>
          )}
          <View style={styles.sheetBotsList}>
            {[
              { id: 'jessie', name: 'Mia', level: 'Nível 5', icon: BOT_MIA_ICON },
              { id: 'pro-james', name: 'John', level: 'Nível 15', icon: BOT_JOHN_ICON },
            ].map((bot) => (
              <TouchableOpacity
                key={bot.id}
                style={[styles.sheetBotButton, !hasParty && styles.sheetBotButtonDisabled]}
                onPress={() => handleFindBot(bot.id)}
                disabled={!hasParty}
                activeOpacity={0.8}
              >
                <Image source={bot.icon} style={styles.sheetBotImage} resizeMode="contain" />
                <View style={styles.sheetBotContent}>
                  <Text style={styles.sheetBotLabel}>{bot.name}</Text>
                  <Text style={styles.sheetBotDescription}>{bot.level}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    }];
  }, [sheetTab, format, formatColor, partyMembers.length, hasParty, publicLobbies, joinCodeInput]);

  return (
    <View style={styles.fullScreenContainer}>
      <View pointerEvents="none" style={styles.dynamicBackground}>
        <LinearGradient
          colors={['#F8F9FA', '#FFFFFF', '#F8F9FA']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.Image
          source={NOISE_SOURCE}
          resizeMode="repeat"
          style={[styles.grainOverlay, { opacity: 0.02 }]}
        />
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        {!showContent ? (
          <RNView style={styles.loadingContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
              locations={[0, 0.5, 1]}
              style={styles.backgroundVideo}
            />
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingLogoContainer}>
                <View style={styles.loadingIconCircle}>
                  <Text style={styles.loadingLogoEmoji}>☕</Text>
                </View>
              </View>
              <Text style={styles.loadingLogo}>COFFEEMON</Text>
              <Text style={styles.loadingSubtitle}>Carregando sua aventura</Text>
              <Text style={styles.loadingPercentage}>{Math.round(progress)}%</Text>
              <Text style={styles.loadingText}>
                {progress < 40 ? 'Iniciando...' : progress < 80 ? 'Preparando...' : 'Pronto!'}
              </Text>
              <View style={styles.loadingBarContainer}>
                <View style={[styles.loadingBar, { width: `${progress}%` as any }]}>
                  {progress > 5 && progress < 100 && <View style={styles.loadingBarGlow} />}
                </View>
              </View>
            </View>
          </RNView>
        ) : (
          <>
            {onNavigateToEcommerce && (
              <TouchableOpacity style={styles.floatingBackButton} onPress={onNavigateToEcommerce}>
                <Text style={styles.floatingBackButtonText}>←</Text>
              </TouchableOpacity>
            )}

            <PlayerStatus token={token} onLogout={onNavigateToLogin} onNavigateToEcommerce={onNavigateToEcommerce} />

            <View style={styles.teamContainer}>
              <View style={styles.teamHeader}>
                <Text style={styles.teamTitle}>Minha Equipe</Text>
                <View style={matchStyles.teamHeaderRight}>
                  {hasParty && (
                    <View style={[matchStyles.formatBadgeSmall, { backgroundColor: formatColor + '22', borderColor: formatColor }]}>
                      <Text style={[matchStyles.formatBadgeSmallText, { color: formatColor }]}>
                        {FORMAT_LABELS[format]}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.teamCount}>{partyMembers.length}/3</Text>
                </View>
              </View>
              <TeamFormation
                partyMembers={partyMembers}
                onCoffeemonPress={handleOpenDetails}
                activeCoffeemonId={activeCoffeemon?.id}
              />
            </View>

            <View style={styles.bottomBar}>
              <Animated.View style={{ transform: [{ scale: privateBtnScale }] }}>
                <TouchableOpacity
                  style={[styles.bottomBarPill, styles.bottomBarPillLeft]}
                  onPress={() => { pressAnim(privateBtnScale); handleOpenSheet('private'); }}
                  activeOpacity={0.8}
                >
                  <Image source={PRIVATE_ICON} style={styles.bottomBarIcon} />
                  <Text style={styles.bottomBarLabel}>Local</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: roomsBtnScale }] }}>
                <TouchableOpacity
                  style={[styles.bottomBarPill, styles.bottomBarPillCenter]}
                  onPress={() => { pressAnim(roomsBtnScale); handleOpenSheet('rooms'); }}
                  activeOpacity={0.8}
                >
                  <Image source={ROOMS_ICON} style={styles.bottomBarIconCenter} />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: botBtnScale }] }}>
                <TouchableOpacity
                  style={[styles.bottomBarPill, styles.bottomBarPillRight]}
                  onPress={() => { pressAnim(botBtnScale); handleOpenSheet('bots'); }}
                  activeOpacity={0.8}
                >
                  <Image source={BOT_ICON} style={styles.bottomBarIcon} />
                  <Text style={styles.bottomBarLabel}>Bots</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </>
        )}
      </SafeAreaView>

      {/* Rejoin battle banner */}
      {activeBattleId && !isStarting && !currentLobby && !isSearching && (
        <View style={rejoinStyles.banner}>
          <View style={rejoinStyles.bannerContent}>
            <View style={rejoinStyles.countdownCircle}>
              <Text style={rejoinStyles.countdownText}>
                {reconnectSecondsLeft != null ? reconnectSecondsLeft : '⚔️'}
              </Text>
            </View>
            <View style={rejoinStyles.bannerText}>
              <Text style={rejoinStyles.bannerTitle}>Partida em andamento</Text>
              <Text style={rejoinStyles.bannerSub}>
                {reconnectSecondsLeft != null
                  ? `${reconnectSecondsLeft}s para recuperar`
                  : 'Você pode recuperar a partida anterior'}
              </Text>
            </View>
          </View>
          <View style={rejoinStyles.bannerActions}>
            <TouchableOpacity style={rejoinStyles.rejoinBtn} onPress={rejoinBattle} activeOpacity={0.8}>
              <Text style={rejoinStyles.rejoinBtnText}>Recuperar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rejoinStyles.dismissBtn} onPress={clearActiveBattle} activeOpacity={0.8}>
              <Text style={rejoinStyles.dismissBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Battle starting overlay (both host and guest see this) */}
      {isStarting && (
        <View style={lobbyOverlayStyles.backdrop}>
          <View style={lobbyOverlayStyles.card}>
            <Text style={{ fontSize: 52, marginBottom: 12 }}>⚔️</Text>
            <Text style={lobbyOverlayStyles.title}>Batalha iniciando!</Text>
            <ActivityIndicator color="#C8A26B" size="large" style={{ marginVertical: 12 }} />
            <Text style={lobbyOverlayStyles.subtitle}>Prepare seus Coffeemons...</Text>
          </View>
        </View>
      )}

      {/* Lobby overlay (waiting room) */}
      {!isStarting && currentLobby && (
        <LobbyOverlay
          lobby={currentLobby}
          playerId={playerId}
          onLeave={leaveLobby}
          onStart={startLobby}
        />
      )}

      {/* Searching overlay (random queue) */}
      {!isStarting && isSearching && (
        <View style={lobbyOverlayStyles.backdrop}>
          <View style={lobbyOverlayStyles.card}>
            <Animated.View style={{ transform: [{ scale: searchingPulse }] }}>
              <Text style={{ fontSize: 48 }}>⚔️</Text>
            </Animated.View>
            <Text style={lobbyOverlayStyles.title}>Procurando partida...</Text>
            <ActivityIndicator color="#C8A26B" size="small" style={{ marginBottom: 8 }} />
            <Text style={lobbyOverlayStyles.subtitle}>Aguardando um oponente</Text>
            <TouchableOpacity style={lobbyOverlayStyles.cancelBtn} onPress={cancelMatch}>
              <Text style={lobbyOverlayStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {newLobbyAlert && (
        <Animated.View style={[
          toastStyles.toast,
          {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          },
        ]}>
          <View style={toastStyles.toastLeft}>
            <View style={toastStyles.toastAvatar}>
              <Text style={toastStyles.toastAvatarText}>
                {newLobbyAlert.hostUsername[0]?.toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={toastStyles.toastTitle}>{newLobbyAlert.hostUsername} criou uma sala</Text>
              <Text style={toastStyles.toastSub}>{FORMAT_LABELS[newLobbyAlert.format]} • Pública</Text>
            </View>
          </View>
          <TouchableOpacity
            style={toastStyles.toastBtn}
            onPress={() => { joinLobby(newLobbyAlert.id); dismissAlert(); }}
          >
            <Text style={toastStyles.toastBtnText}>Entrar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <QRScanner
        visible={qrScannerVisible}
        token={token}
        onClose={() => setQrScannerVisible(false)}
        onSuccess={() => { fetchCoffeemons(true); setQrScannerVisible(false); }}
      />

      <CoffeemonSelectionModal
        visible={selectionModalVisible}
        availableCoffeemons={availableCoffeemons}
        onSelectCoffeemon={async (c) => { await toggleParty(c); setSelectionModalVisible(false); }}
        onClose={() => setSelectionModalVisible(false)}
        partyLoading={partyLoading}
      />

      <CoffeemonDetailsModal
        visible={detailsModalVisible}
        coffeemon={selectedDetailsCoffeemon}
        onClose={handleCloseDetails}
        onToggleParty={toggleParty}
        partyMembers={partyMembers}
        onSwapParty={swapPartyMembers}
        onRefresh={fetchCoffeemons}
        token={token}
      />

      <SlidingBottomSheet
        visible={sheetVisible}
        sections={sheetSections}
        onClose={handleCloseSheet}
      />
    </View>
  );
}

// ─── Local styles ─────────────────────────────────────────────────────────────

const matchStyles = StyleSheet.create({
  teamHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formatBadgeSmall: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  formatBadgeSmallText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  formatInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  formatInfoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  formatInfoBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  formatInfoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  formatInfoSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noPartyBanner: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  noPartyEmoji: {
    fontSize: 36,
  },
  noPartyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});

// ─── LobbyCard ────────────────────────────────────────────────────────────────

function LobbyCard({
  lobby, onJoin, disabled,
}: { lobby: GameLobby; onJoin: (l: GameLobby) => void; disabled: boolean }) {
  const color = FORMAT_BADGE_COLOR[lobby.format] ?? '#6B7280';
  return (
    <TouchableOpacity
      style={[lobbyCardStyles.card, disabled && lobbyCardStyles.cardDisabled]}
      onPress={() => onJoin(lobby)}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={lobbyCardStyles.left}>
        <View style={[lobbyCardStyles.avatar, { backgroundColor: color + '22' }]}>
          <Text style={[lobbyCardStyles.avatarText, { color }]}>
            {lobby.hostUsername[0]?.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={lobbyCardStyles.host}>{lobby.hostUsername}</Text>
          <Text style={lobbyCardStyles.sub}>1/2 jogadores</Text>
        </View>
      </View>
      <View style={[lobbyCardStyles.badge, { backgroundColor: color }]}>
        <Text style={lobbyCardStyles.badgeText}>{FORMAT_LABELS[lobby.format]}</Text>
      </View>
    </TouchableOpacity>
  );
}

const lobbyCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardDisabled: { opacity: 0.5 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  host: { fontSize: 15, fontWeight: '600', color: '#111827' },
  sub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

// ─── LobbyOverlay ─────────────────────────────────────────────────────────────

function LobbyOverlay({
  lobby, playerId, onLeave, onStart,
}: { lobby: GameLobby; playerId: number; onLeave: () => void; onStart: () => void }) {
  const isHost = lobby.hostId === playerId;
  const color = FORMAT_BADGE_COLOR[lobby.format] ?? '#3B82F6';

  return (
    <View style={lobbyOverlayStyles.backdrop}>
      <View style={lobbyOverlayStyles.card}>
        <View style={lobbyOverlayStyles.header}>
          <Text style={lobbyOverlayStyles.title}>
            {lobby.type === 'private' ? '🔒 Sala Privada' : '🌐 Sala Pública'}
          </Text>
          <View style={[lobbyOverlayStyles.formatBadge, { backgroundColor: color }]}>
            <Text style={lobbyOverlayStyles.formatText}>{FORMAT_LABELS[lobby.format]}</Text>
          </View>
        </View>

        {lobby.type === 'private' && (
          <View style={lobbyOverlayStyles.codeBox}>
            <Text style={lobbyOverlayStyles.codeLabel}>Código da sala</Text>
            <Text style={lobbyOverlayStyles.codeValue}>{lobby.id}</Text>
          </View>
        )}

        <View style={lobbyOverlayStyles.players}>
          <PlayerSlot username={lobby.hostUsername} label="Host" color={color} ready />
          <View><Text style={lobbyOverlayStyles.vsLabel}>VS</Text></View>
          <PlayerSlot username={lobby.guestUsername} label="Convidado" color={color} ready={!!lobby.guestId} />
        </View>

        <View style={lobbyOverlayStyles.actions}>
          <TouchableOpacity style={lobbyOverlayStyles.leaveBtn} onPress={onLeave}>
            <Text style={lobbyOverlayStyles.leaveBtnText}>Sair</Text>
          </TouchableOpacity>

          {isHost ? (
            <TouchableOpacity
              style={[lobbyOverlayStyles.startBtn, lobby.status !== 'ready' && lobbyOverlayStyles.startBtnDisabled]}
              onPress={onStart}
              disabled={lobby.status !== 'ready'}
            >
              <Text style={lobbyOverlayStyles.startBtnText}>
                {lobby.status === 'ready' ? 'Iniciar!' : 'Aguardando...'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={lobbyOverlayStyles.waitingBox}>
              <ActivityIndicator size="small" color="#C8A26B" />
              <Text style={lobbyOverlayStyles.waitingText}>Aguardando o host iniciar</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function PlayerSlot({ username, label, color, ready }: {
  username?: string; label: string; color: string; ready: boolean;
}) {
  return (
    <View style={lobbyOverlayStyles.playerSlot}>
      <View style={[lobbyOverlayStyles.playerAvatar, { backgroundColor: ready ? color + '33' : '#F3F4F6' }]}>
        {ready && username ? (
          <Text style={[lobbyOverlayStyles.playerAvatarText, { color }]}>{username[0]?.toUpperCase()}</Text>
        ) : (
          <Text style={lobbyOverlayStyles.playerAvatarEmpty}>?</Text>
        )}
      </View>
      <Text style={[lobbyOverlayStyles.playerName, !ready && { color: '#9CA3AF' }]}>
        {username ?? 'Aguardando...'}
      </Text>
      <Text style={lobbyOverlayStyles.playerLabel}>{label}</Text>
    </View>
  );
}

// ─── Rejoin Banner Styles ─────────────────────────────────────────────────────

const rejoinStyles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  countdownCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C8A26B',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  countdownText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#F1F5F9' },
  bannerSub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rejoinBtn: {
    backgroundColor: '#C8A26B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rejoinBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  dismissBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dismissBtnText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
});
