import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Alert
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerCoffeemon, fetchAvailableMoves, updateCoffeemonMoves } from '../../api/coffeemonService';
import { styles } from './styles';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { getTypeColorScheme } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import MoveCustomizer from '../MoveCustomizer';
import TypeIcon from '../TypeIcon';

const LIMONETO_BACKGROUND = require('../../../assets/backgrounds/limonetoback.png');
const JASMINELLE_BACKGROUND = require('../../../assets/backgrounds/jasminiback.png');
const MAPRION_BACKGROUND = require('../../../assets/backgrounds/maprionback.png');
const EMBERLY_BACKGROUND = require('../../../assets/backgrounds/emberlyback.png');
const GINGERLYNN_BACKGROUND = require('../../../assets/backgrounds/gingerlynnback.png');
const ALMONDINO_BACKGROUND = require('../../../assets/backgrounds/almondinoback.png');

const COFFEEMON_BACKGROUNDS: Record<string, ImageSourcePropType> = {
  jasminelle: JASMINELLE_BACKGROUND,
  limoneto: LIMONETO_BACKGROUND,
  limonetto: LIMONETO_BACKGROUND,
  maprion: MAPRION_BACKGROUND,
  emberly: EMBERLY_BACKGROUND,
  gingerlynn: GINGERLYNN_BACKGROUND,
  almondino: ALMONDINO_BACKGROUND,
};

interface CoffeemonDetailsModalProps {
  visible: boolean;
  coffeemon: PlayerCoffeemon | null;
  onClose: () => void;
  onToggleParty?: (coffeemon: PlayerCoffeemon) => Promise<boolean | void> | void;
  partyMembers?: PlayerCoffeemon[];
  onSwapParty?: (newMember: PlayerCoffeemon, oldMember: PlayerCoffeemon) => Promise<boolean>;
  onRefresh?: () => Promise<void>;
  token?: string | null;
}

export default function CoffeemonDetailsModal({
  visible,
  coffeemon,
  onClose,
  onToggleParty,
  partyMembers = [],
  onSwapParty,
  onRefresh,
  token,
}: CoffeemonDetailsModalProps) {
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'sobre' | 'stats' | 'golpes'>('stats');
  const [showSwapSelection, setShowSwapSelection] = useState(false);
  const [showMoveCustomizer, setShowMoveCustomizer] = useState(false);
  const statsAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setShowSwapSelection(false);
      setShowMoveCustomizer(false);
      setActiveTab('sobre');
    }
  }, [visible, coffeemon]);

  React.useEffect(() => {
    if (visible && activeTab === 'stats' && !showMoveCustomizer && !showSwapSelection) {
      statsAnim.setValue(0);
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [activeTab, showMoveCustomizer, showSwapSelection, statsAnim, visible]);

  if (!coffeemon) return null;

  const variant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
  const imageSource = getCoffeemonImage(coffeemon.coffeemon.name, variant);
  const typeColors = getTypeColorScheme(coffeemon.coffeemon.types?.[0] || 'roasted');
  const backgroundSource = COFFEEMON_BACKGROUNDS[coffeemon.coffeemon.name.toLowerCase()] || undefined;

  // Dynamic Styles
  const textPrimary = { color: colors.text.primary };
  const textSecondary = { color: colors.text.secondary };
  const textTertiary = { color: colors.text.tertiary };

  const modalWidth = Math.min(viewportWidth * 0.9, 380);
  const modalHeight = Math.min(viewportHeight * 0.85, 680);

  const toPositiveNumber = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const stats = {
    hp: toPositiveNumber(coffeemon.hp, toPositiveNumber(coffeemon.coffeemon.baseHp, 100)),
    attack: toPositiveNumber(coffeemon.attack, toPositiveNumber(coffeemon.coffeemon.baseAttack, 50)),
    defense: toPositiveNumber(coffeemon.defense, toPositiveNumber(coffeemon.coffeemon.baseDefense, 50)),
    speed: toPositiveNumber(coffeemon.coffeemon.baseSpeed, 50),
  };

  const maxStat = Math.max(
    stats.hp,
    stats.attack,
    stats.defense,
    stats.speed,
    100
  );

  const currentLevel = Math.max(1, Math.floor(toPositiveNumber(coffeemon.level, 1)));
  const totalXp = Math.max(0, Math.floor(Number(coffeemon.experience) || 0));
  const xpInLevel = totalXp % 100;
  const xpPercent = Math.max(0, Math.min(100, (xpInLevel / 100) * 100));

  const renderStatBar = (label: string, value: number, colorStart: string, colorEnd: string) => {
    const basePercent = Math.min((value / maxStat) * 100, 100);
    const finalPercent = value > 0 ? Math.max(8, basePercent) : 0;
    const animatedWidth = statsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', `${finalPercent}%`],
    });

    return (
      <View style={[styles.statRow, { backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(0,0,0,0.06)' }]}>
        <Text style={[styles.statLabel, textSecondary]}>{label}</Text>
        <View style={[styles.statBarContainer, { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
          <Animated.View style={[styles.statBar, { width: animatedWidth }]}>
            <LinearGradient
              colors={[colorStart, colorEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>
        <Text style={[styles.statValue, textPrimary]}>{Math.round(value)}</Text>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        const xpAnimatedWidth = statsAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', `${xpPercent}%`],
        });
        return (
          <View style={styles.section}>
            <View style={[styles.statsCard, { backgroundColor: 'rgba(255,255,255,0.35)', borderColor: 'rgba(0,0,0,0.06)' }]}>
              {renderStatBar('HP', stats.hp, '#FF6B6B', '#FF8E53')}
              {renderStatBar('ATQ', stats.attack, '#F6AD55', '#FBD38D')}
              {renderStatBar('DEF', stats.defense, '#4FD1C5', '#81E6D9')}
              {renderStatBar('VEL', stats.speed, '#6B8CFF', '#9F7AEA')}
            </View>
            
            <View style={[styles.xpCard, { backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(0,0,0,0.06)' }]}>
              <View style={styles.xpHeader}>
                <Text style={[styles.xpLabel, textSecondary]}>Experiência</Text>
                <Text style={[styles.xpValue, textPrimary]}>{xpInLevel}/100 (Lv {currentLevel})</Text>
              </View>
              <View style={[styles.xpBarContainer, { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
                <Animated.View style={[styles.xpBarFill, { width: xpAnimatedWidth }]}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                </Animated.View>
              </View>
              <Text style={[styles.xpSubtext, textTertiary]}>{totalXp} XP total</Text>
            </View>
          </View>
        );
      case 'golpes':
        return (
          <View style={styles.section}>
            {coffeemon.learnedMoves && coffeemon.learnedMoves.length > 0 ? (
              <>
                {coffeemon.learnedMoves.map((lm) => (
                  <View key={lm.id} style={[styles.moveCard, { backgroundColor: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.8)' }]}>
                    <View style={styles.moveHeader}>
                      <Text style={[styles.moveName, textPrimary]}>{lm.move.name}</Text>
                      <View style={[styles.moveTypeBadge, { backgroundColor: typeColors.primary + '20' }]}>
                        <Text style={[styles.moveType, { color: typeColors.primary }]}>{lm.move.elementalType || 'Normal'}</Text>
                      </View>
                    </View>
                    <Text style={[styles.moveDesc, textSecondary]}>{lm.move.description}</Text>
                    <View style={[styles.moveStats, { borderTopColor: 'rgba(0,0,0,0.05)' }]}>
                      <Text style={[styles.moveStat, textTertiary]}>Poder: {lm.move.power}</Text>
                      <Text style={[styles.moveStat, textTertiary]}>Categoria: {lm.move.category}</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.customizeMovesButton, { backgroundColor: typeColors.primary }]}
                  onPress={() => setShowMoveCustomizer(true)}
                >
                  <Text style={styles.customizeMovesButtonText}>Customizar Moves</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={[styles.noMoves, textTertiary]}>Nenhum movimento aprendido</Text>
            )}
          </View>
        );
      case 'sobre':
        return (
          <View style={[styles.section, { flex: 1 }]}>
            {/* Description Section */}
            {coffeemon.coffeemon.description && (
              <View style={styles.descriptionSection}>
                <Text style={[styles.descriptionText, textSecondary]}>
                  {coffeemon.coffeemon.description}
                </Text>
              </View>
            )}

            {/* Physical Characteristics */}
            {(coffeemon.coffeemon.weight || coffeemon.coffeemon.height) && (
              <View style={styles.characteristicsGrid}>
                <Text style={[styles.subsectionTitle, textPrimary]}>Características Físicas</Text>
                <View style={styles.characteristicsRow}>
                  {coffeemon.coffeemon.height !== undefined && coffeemon.coffeemon.height !== null && (
                    <View style={styles.characteristicCard}>
                      <View style={styles.characteristicIconContainer}>
                        <Text style={styles.characteristicIcon}>📏</Text>
                      </View>
                      <Text style={[styles.characteristicLabel, textTertiary]}>Altura</Text>
                      <Text style={[styles.characteristicValue, textPrimary]}>
                        {(() => {
                          const heightNum = parseFloat(String(coffeemon.coffeemon.height || 0));
                          if (heightNum >= 1) {
                            return `${heightNum.toFixed(1)} m`;
                          } else if (heightNum > 0) {
                            return `${Math.round(heightNum * 100)} cm`;
                          }
                          return '-- cm';
                        })()}
                      </Text>
                    </View>
                  )}
                  {coffeemon.coffeemon.weight !== undefined && coffeemon.coffeemon.weight !== null && (
                    <View style={styles.characteristicCard}>
                      <View style={styles.characteristicIconContainer}>
                        <Text style={styles.characteristicIcon}>⚖️</Text>
                      </View>
                      <Text style={[styles.characteristicLabel, textTertiary]}>Peso</Text>
                      <Text style={[styles.characteristicValue, textPrimary]}>
                        {Number(coffeemon.coffeemon.weight).toFixed(1)} g
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Flavor Profile */}
            {coffeemon.coffeemon.flavorProfile && (
              <View style={styles.flavorSection}>
                <Text style={[styles.subsectionTitle, textPrimary]}>Perfil de Sabor</Text>
                <View style={[styles.flavorCard, { backgroundColor: typeColors.primary + '15', borderColor: typeColors.primary + '30' }]}>
                  <Text style={styles.flavorIcon}>☕</Text>
                  <Text style={[styles.flavorProfileText, { color: typeColors.dark }]}>
                    {coffeemon.coffeemon.flavorProfile}
                  </Text>
                </View>
              </View>
            )}

            {/* Level Info */}
            <View style={styles.levelInfoSection}>
              <View style={[styles.levelInfoCard, { backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(0,0,0,0.08)' }]}>
                <Text style={[styles.levelInfoLabel, textTertiary]}>Nível Atual</Text>
                <Text style={[styles.levelInfoValue, { color: typeColors.primary }]}>{coffeemon.level}</Text>
              </View>
              <View style={[styles.levelInfoCard, { backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(0,0,0,0.08)' }]}>
                <Text style={[styles.levelInfoLabel, textTertiary]}>Experiência</Text>
                <Text style={[styles.levelInfoValue, textPrimary]}>{coffeemon.experience} XP</Text>
              </View>
            </View>
            
          </View>
        );
    }
  };

  const renderSwapSelection = () => (
    <View style={styles.swapContainer}>
      <Text style={[styles.swapTitle, textPrimary]}>Time Cheio!</Text>
      <Text style={[styles.swapSubtitle, textSecondary]}>Escolha quem substituir:</Text>
      
      <View style={styles.swapList}>
        {partyMembers.map((member) => {
          const memberVariant = getVariantForStatusEffects(member.statusEffects, 'default');
          const memberImage = getCoffeemonImage(member.coffeemon.name, memberVariant);
          const memberColors = getTypeColorScheme(member.coffeemon.types?.[0] || 'roasted');
          
          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.swapItem, { borderColor: memberColors.primary, backgroundColor: 'rgba(255,255,255,0.8)' }]}
              onPress={async () => {
                if (onSwapParty && coffeemon) {
                  const success = await onSwapParty(coffeemon, member);
                  if (success) onClose();
                }
              }}
            >
              <Image source={memberImage} style={styles.swapImage} resizeMode="contain" />
              <Text style={[styles.swapName, textPrimary]}>{member.coffeemon.name}</Text>
              <Text style={[styles.swapLevel, textTertiary]}>Lvl {member.level}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.cancelSwapButton}
        onPress={() => setShowSwapSelection(false)}
      >
        <Text style={[styles.cancelSwapText, textSecondary]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  const handleLoadAvailableMoves = async (playerCoffeemonId: number) => {
    if (!token) throw new Error('Token não disponível');
    return await fetchAvailableMoves(token, playerCoffeemonId);
  };

  const handleSaveMoves = async (moveIds: number[]) => {
    if (!token || !coffeemon) throw new Error('Token ou coffeemon não disponível');
    
    try {
      // 1. Salvar no backend
      await updateCoffeemonMoves(token, coffeemon.id, moveIds);
      
      // 2. Fechar o customizador
      setShowMoveCustomizer(false);
      
      // 3. Atualizar os dados
      if (onRefresh) {
        await onRefresh();
      }
      
      // 4. Fechar o modal de detalhes para forçar recarregar quando abrir novamente
      onClose();
      
      // 5. Mostrar feedback de sucesso
      setTimeout(() => {
        Alert.alert('Sucesso', 'Moves atualizados com sucesso!');
      }, 300);
    } catch (error) {
      console.error('Erro ao salvar moves:', error);
      throw error; // Re-throw para o MoveCustomizer tratar
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.fullscreen}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <TouchableWithoutFeedback onPress={onClose}>
           <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={[styles.modalWrapper, { width: modalWidth, height: modalHeight }]}>
            <BlurView intensity={95} tint="light" style={styles.modalGlass}>
                {showMoveCustomizer ? (
                    coffeemon && (
                        <MoveCustomizer
                            coffeemon={coffeemon}
                            onSave={handleSaveMoves}
                            onClose={() => setShowMoveCustomizer(false)}
                            onLoadAvailableMoves={handleLoadAvailableMoves}
                            token={token}
                        />
                    )
                ) : showSwapSelection ? (
                    renderSwapSelection()
                ) : (
                    <>
                        <View style={styles.heroSection}>
                            <LinearGradient
                                colors={typeColors.accentGradient as any}
                                style={StyleSheet.absoluteFillObject}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                            
                            <LinearGradient
                                colors={[typeColors.dark, 'transparent', typeColors.light]}
                                style={styles.heroGradientOverlay}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                            
                            <View style={styles.heroOverlay}>
                                <View style={styles.typePill}>
                                    <TypeIcon
                                        type={coffeemon.coffeemon.types[0]}
                                        size={16}
                                        strokeWidth={2.4}
                                        style={styles.typeIcon}
                                    />
                                    <Text style={styles.typeName}>{coffeemon.coffeemon.types[0]}</Text>
                                </View>
                                <View style={styles.levelPill}>
                                    <Text style={styles.levelText}>Lv {coffeemon.level}</Text>
                                </View>
                            </View>

                            <View style={styles.imageArea}>
                                <View style={styles.heroVignette} pointerEvents="none" />
                                {backgroundSource && (
                                    <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFillObject}>
                                        <Image 
                                            source={backgroundSource} 
                                            style={styles.backgroundImage} 
                                            resizeMode="cover"
                                        />
                                    </BlurView>
                                )}
                                <View style={[styles.imageGlow, { shadowColor: typeColors.primary }]}>
                                    <Image 
                                        source={imageSource} 
                                        style={styles.mainImage} 
                                        resizeMode="contain" 
                                    />
                                </View>
                                
                                <View style={styles.nameSection}>
                                    <View style={styles.nameContainer}>
                                        <Text style={styles.name}>{coffeemon.coffeemon.name}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.contentArea}>
                            <LinearGradient
                                colors={typeColors.gradient as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[StyleSheet.absoluteFillObject, { opacity: 0.8 }]}
                            />
                            
                            <LinearGradient
                                colors={[typeColors.gradient[1], 'transparent']}
                                style={styles.contentGradientTop}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                            />
                            
                            <LinearGradient
                                colors={[typeColors.accentGradient[0], 'transparent']}
                                style={styles.contentGradientCorner}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                            />
                            
                            {/* Tabs */}
                            <View style={styles.tabsContainer}>
                                {(['sobre', 'stats', 'golpes'] as const).map((tab) => {
                                    const tabLabels = {
                                        sobre: 'SOBRE',
                                        stats: 'STATS',
                                        golpes: 'GOLPES'
                                    };
                                    
                                    return (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[
                                            styles.tabButton,
                                            activeTab === tab && { backgroundColor: typeColors.primary + '15' }
                                        ]}
                                        onPress={() => setActiveTab(tab)}
                                    >
                                        <Text style={[
                                            styles.tabText,
                                            { color: colors.text.tertiary },
                                            activeTab === tab && { color: typeColors.primary, fontWeight: '800' }
                                        ]}>
                                            {tabLabels[tab]}
                                        </Text>
                                    </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <ScrollView 
                                style={styles.scrollContent}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {renderTabContent()}
                            </ScrollView>
                        </View>
                    </>
                )}
            </BlurView>
        </View>
      </View>
    </Modal>
  );
}
