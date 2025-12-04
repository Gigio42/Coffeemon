import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { getTypeColorScheme } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

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

const getTypeIcon = (type?: string): string => {
  const icons: Record<string, string> = {
    roasted: '🔥',
    sweet: '🍬',
    bitter: '☕',
    milky: '🥛',
    iced: '❄️',
    nutty: '🌰',
    fruity: '🍎',
    spicy: '🌶️',
    sour: '🍋',
    floral: '🌸',
  };
  return icons[type || 'roasted'] || '☕';
};

interface CoffeemonDetailsModalProps {
  visible: boolean;
  coffeemon: PlayerCoffeemon | null;
  onClose: () => void;
  onToggleParty?: (coffeemon: PlayerCoffeemon) => Promise<boolean | void> | void;
  partyMembers?: PlayerCoffeemon[];
  onSwapParty?: (newMember: PlayerCoffeemon, oldMember: PlayerCoffeemon) => Promise<boolean>;
}

export default function CoffeemonDetailsModal({
  visible,
  coffeemon,
  onClose,
  onToggleParty,
  partyMembers = [],
  onSwapParty,
}: CoffeemonDetailsModalProps) {
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'about' | 'status' | 'moves'>('status');
  const [showSwapSelection, setShowSwapSelection] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setShowSwapSelection(false);
      setActiveTab('about');
    }
  }, [visible, coffeemon]);

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

  const stats = {
    hp: coffeemon.hp || coffeemon.coffeemon.baseHp || 100,
    attack: coffeemon.attack || coffeemon.coffeemon.baseAttack || 50,
    defense: coffeemon.defense || coffeemon.coffeemon.baseDefense || 50,
    speed: coffeemon.coffeemon.baseSpeed || 50,
  };

  const maxStat = Math.max(
    coffeemon.coffeemon.baseHp || 100,
    coffeemon.coffeemon.baseAttack || 50,
    coffeemon.coffeemon.baseDefense || 50,
    coffeemon.coffeemon.baseSpeed || 50
  );

  const renderStatBar = (label: string, value: number, color: string) => (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, textSecondary]}>{label}</Text>
      <View style={[styles.statBarContainer, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
        <View 
          style={[
            styles.statBar, 
            { 
              width: `${Math.min((value / maxStat) * 100, 100)}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      <Text style={[styles.statValue, textPrimary]}>{value}</Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <View style={styles.section}>
            {renderStatBar('HP', stats.hp, '#FF5959')}
            {renderStatBar('ATK', stats.attack, '#F5AC78')}
            {renderStatBar('DEF', stats.defense, '#FAE078')}
            {renderStatBar('SPD', stats.speed, '#9DB7F5')}
            
            <View style={[styles.xpContainer, { borderTopColor: 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.xpLabel, textSecondary]}>Experience</Text>
              <Text style={[styles.xpValue, textPrimary]}>{coffeemon.experience} XP</Text>
            </View>
          </View>
        );
      case 'moves':
        return (
          <View style={styles.section}>
            {coffeemon.learnedMoves && coffeemon.learnedMoves.length > 0 ? (
              coffeemon.learnedMoves.map((lm) => (
                <View key={lm.id} style={[styles.moveCard, { backgroundColor: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.8)' }]}>
                  <View style={styles.moveHeader}>
                    <Text style={[styles.moveName, textPrimary]}>{lm.move.name}</Text>
                    <View style={[styles.moveTypeBadge, { backgroundColor: typeColors.primary + '20' }]}>
                      <Text style={[styles.moveType, { color: typeColors.primary }]}>{lm.move.elementalType || 'Normal'}</Text>
                    </View>
                  </View>
                  <Text style={[styles.moveDesc, textSecondary]}>{lm.move.description}</Text>
                  <View style={[styles.moveStats, { borderTopColor: 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.moveStat, textTertiary]}>Power: {lm.move.power}</Text>
                    <Text style={[styles.moveStat, textTertiary]}>Category: {lm.move.category}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.noMoves, textTertiary]}>Nenhum movimento aprendido</Text>
            )}
          </View>
        );
      case 'about':
        return (
          <View style={[styles.section, { flex: 1 }]}>
            <View style={styles.aboutHeader}>
              <Text style={[styles.sectionTitle, { color: typeColors.primary }]}>
                {coffeemon.coffeemon.name}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: typeColors.primary }]}>
                 <Text style={styles.typeBadgeText}>{coffeemon.coffeemon.types.join(' / ')}</Text>
              </View>
            </View>
            
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
            
            {onToggleParty && (
              <View style={{ marginTop: 'auto', paddingTop: 20 }}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: typeColors.primary, shadowColor: typeColors.primary }]}
                  onPress={async () => {
                    if (onToggleParty) {
                      const result = await onToggleParty(coffeemon);
                      if (result === false && !coffeemon.isInParty) {
                        setShowSwapSelection(true);
                      } else {
                        onClose();
                      }
                    }
                  }}
                >
                  <Text style={styles.actionButtonText}>
                    {coffeemon.isInParty ? 'REMOVER DO TIME' : 'ADICIONAR AO TIME'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
                {showSwapSelection ? (
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
                                    <Text style={styles.typeIcon}>{getTypeIcon(coffeemon.coffeemon.types[0])}</Text>
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
                        
                        <LinearGradient
                            colors={[
                                typeColors.accentGradient[1] + '00',
                                typeColors.gradient[0] + '80',
                                typeColors.gradient[1] + 'CC'
                            ]}
                            locations={[0, 0.5, 1]}
                            style={styles.transitionGradient}
                        />

                        <View style={styles.contentArea}>
                            <LinearGradient
                                colors={typeColors.gradient as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFillObject}
                                opacity={0.8}
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
                            
                            <View style={styles.contentInnerGlow} />
                            
                            {/* Tabs */}
                            <View style={styles.tabsContainer}>
                                {(['about', 'status', 'moves'] as const).map((tab) => (
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
                                            {tab.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
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
