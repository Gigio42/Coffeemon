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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { getTypeColor } from '../CoffeemonCard/styles';

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
  const [activeTab, setActiveTab] = useState<'about' | 'status' | 'moves'>('status');
  const [showSwapSelection, setShowSwapSelection] = useState(false);

  // Reset swap selection when modal opens/closes or coffeemon changes
  React.useEffect(() => {
    if (visible) {
      setShowSwapSelection(false);
      setActiveTab('about');
    }
  }, [visible, coffeemon]);

  if (!coffeemon) return null;

  const variant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
  const imageSource = getCoffeemonImage(coffeemon.coffeemon.name, variant);
  const typeColor = getTypeColor(coffeemon.coffeemon.types?.[0], coffeemon.coffeemon.name);
  const backgroundSource = COFFEEMON_BACKGROUNDS[coffeemon.coffeemon.name.toLowerCase()] || undefined;

  const modalContainerStyle = [
    styles.modalContainer,
    {
      width: Math.min(viewportWidth * 0.9, 400),
      maxHeight: Math.min(viewportHeight * 0.85, 700),
      borderColor: typeColor.dark,
    },
  ];

  // Use base stats as fallback if current stats are 0/undefined (common in catalog view)
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
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarContainer}>
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
      <Text style={styles.statValue}>{value}</Text>
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
            
            <View style={styles.xpContainer}>
              <Text style={styles.xpLabel}>Experience</Text>
              <Text style={styles.xpValue}>{coffeemon.experience} XP</Text>
            </View>
          </View>
        );
      case 'moves':
        return (
          <View style={styles.section}>
            {coffeemon.learnedMoves && coffeemon.learnedMoves.length > 0 ? (
              coffeemon.learnedMoves.map((lm) => (
                <View key={lm.id} style={styles.moveCard}>
                  <View style={styles.moveHeader}>
                    <Text style={styles.moveName}>{lm.move.name}</Text>
                    <Text style={styles.moveType}>{lm.move.elementalType || 'Normal'}</Text>
                  </View>
                  <Text style={styles.moveDesc}>{lm.move.description}</Text>
                  <View style={styles.moveStats}>
                    <Text style={styles.moveStat}>Power: {lm.move.power}</Text>
                    <Text style={styles.moveStat}>Category: {lm.move.category}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noMoves}>Nenhum movimento aprendido</Text>
            )}
          </View>
        );
      case 'about':
        return (
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={[styles.sectionTitle, { color: typeColor.dark, borderBottomWidth: 0 }]}>
              {coffeemon.coffeemon.name}
            </Text>
            <Text style={{ fontFamily: 'Courier New', color: '#555', marginBottom: 8 }}>
              Type: {coffeemon.coffeemon.types.join(', ')}
            </Text>
            <Text style={{ fontFamily: 'Courier New', color: '#555', marginBottom: 8 }}>
              Level: {coffeemon.level}
            </Text>
            
            {onToggleParty && (
              <View style={{ marginTop: 'auto', alignItems: 'flex-end', paddingTop: 20 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: typeColor.dark,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                  onPress={async () => {
                    if (onToggleParty) {
                      const result = await onToggleParty(coffeemon);
                      // If result is false (failed/full) and we are not in party, show swap selection
                      if (result === false && !coffeemon.isInParty) {
                        setShowSwapSelection(true);
                      } else {
                        onClose();
                      }
                    }
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontFamily: 'Courier New', fontSize: 12 }}>
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
      <Text style={styles.swapTitle}>Time Cheio!</Text>
      <Text style={styles.swapSubtitle}>Escolha quem substituir:</Text>
      
      <View style={styles.swapList}>
        {partyMembers.map((member) => {
          const memberVariant = getVariantForStatusEffects(member.statusEffects, 'default');
          const memberImage = getCoffeemonImage(member.coffeemon.name, memberVariant);
          const memberColor = getTypeColor(member.coffeemon.types?.[0], member.coffeemon.name);
          
          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.swapItem, { borderColor: memberColor.dark }]}
              onPress={async () => {
                if (onSwapParty && coffeemon) {
                  const success = await onSwapParty(coffeemon, member);
                  if (success) onClose();
                }
              }}
            >
              <Image source={memberImage} style={styles.swapImage} resizeMode="contain" />
              <Text style={styles.swapName}>{member.coffeemon.name}</Text>
              <Text style={styles.swapLevel}>Lvl {member.level}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.cancelSwapButton}
        onPress={() => setShowSwapSelection(false)}
      >
        <Text style={styles.cancelSwapText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  const modalContent = (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={modalContainerStyle}>
        {showSwapSelection ? (
          renderSwapSelection()
        ) : (
          <>
            <View style={[styles.header, { backgroundColor: typeColor.dark }]}>
              <Text style={styles.title}>{coffeemon.coffeemon.name.toUpperCase()}</Text>
              <Text style={styles.level}>Lvl {coffeemon.level}</Text>
            </View>

            <View style={styles.imageContainer}>
              <ImageBackground
                source={backgroundSource}
                style={styles.imageBackground}
                resizeMode="cover"
                imageStyle={{ opacity: 0.8 }}
              >
                <Image 
                  source={imageSource} 
                  style={styles.image} 
                  resizeMode="contain" 
                />
              </ImageBackground>
            </View>

            <View style={styles.tabsContainer}>
              {(['about', 'status', 'moves'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    activeTab === tab && [styles.tabButtonActive, { borderBottomColor: typeColor.dark }]
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[
                    styles.tabText,
                    activeTab === tab && [styles.tabTextActive, { color: typeColor.dark }]
                  ]}>
                    {tab.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView 
              style={styles.tabContent} 
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
            >
              {renderTabContent()}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: typeColor.dark }]} 
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.fullscreen}>
          <BlurView
            intensity={Platform.OS === 'android' ? 50 : 30}
            tint="dark"
            style={styles.blurContainer}
          >
            {modalContent}
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
