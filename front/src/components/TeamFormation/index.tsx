import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { theme } from '../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TeamFormationProps {
  partyMembers: PlayerCoffeemon[];
  onCoffeemonPress: (coffeemon: PlayerCoffeemon) => void;
  activeCoffeemonId?: number;
}

export default function TeamFormation({
  partyMembers,
  onCoffeemonPress,
  activeCoffeemonId,
}: TeamFormationProps) {
  const memberCount = partyMembers.length;
  const arenaWidth = SCREEN_WIDTH - theme.spacing.lg * 2;
  const centerX = arenaWidth / 2;

  const getPositions = () => {
    if (memberCount === 1) {
      return [{ x: centerX, y: 40, scale: 1.4, z: 10, isLeader: true }];
    }
    if (memberCount === 2) {
      return [
        { x: centerX - 60, y: 50, scale: 1.1, z: 5, isLeader: false },
        { x: centerX + 60, y: 50, scale: 1.1, z: 5, isLeader: false },
      ];
    }
    return [
      { x: centerX - 85, y: 65, scale: 0.95, z: 5, isLeader: false },
      { x: centerX + 85, y: 65, scale: 0.95, z: 5, isLeader: false },
      { x: centerX, y: 30, scale: 1.35, z: 10, isLeader: true },
    ];
  };

  const renderCoffeemon = (coffeemon: PlayerCoffeemon, index: number) => {
    const position = getPositions()[index];
    const baseSize = 130;
    const size = baseSize * position.scale;
    const isActive = coffeemon.id === activeCoffeemonId;

    return (
      <TouchableOpacity
        key={coffeemon.id}
        style={[
          styles.coffeemonPosition,
          {
            left: position.x - size / 2,
            top: position.y,
            width: size,
            zIndex: position.z,
          },
        ]}
        onPress={() => onCoffeemonPress(coffeemon)}
        activeOpacity={0.9}
      >
        {/* Stage/Podium Base */}
        <View style={styles.podiumWrapper}>
          <LinearGradient
            colors={isActive ? ['#FFD700', '#FFA500'] : ['#E0E0E0', '#BDBDBD']}
            style={[styles.podiumBase, { width: size * 0.8, height: 35 }]}
          />
          <View style={[styles.podiumShadow, { width: size * 0.7 }]} />
        </View>

        {/* Coffeemon Sprite - No overflow clipping */}
        <Image
          source={getCoffeemonImage(
            coffeemon.coffeemon.name,
            getVariantForStatusEffects(coffeemon.statusEffects, 'default'),
          )}
          style={{ 
            width: size, 
            height: size, 
            marginBottom: -20, // Sit on the podium
            zIndex: 3 
          }}
          resizeMode="contain"
        />

        {/* Minimalist Info Floating Badge */}
        <View style={[styles.infoFloating, isActive && styles.infoFloatingActive]}>
          <Text style={styles.nameText} numberOfLines={1}>
            {coffeemon.coffeemon.name}
          </Text>
          <View style={styles.statsRow}>
             <Text style={styles.levelText}>Lv.{coffeemon.level}</Text>
             <View style={styles.typeDot} />
             <Text style={styles.typeText}>
               {coffeemon.coffeemon.types?.[0] || 'roasted'}
             </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formationArea}>
        {memberCount === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>☕</Text>
            <Text style={styles.emptyTitle}>Sua equipe está vazia</Text>
          </View>
        ) : (
          partyMembers.slice(0, 3).map((member, index) => renderCoffeemon(member, index))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 380,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },

  formationArea: {
    flex: 1,
    position: 'relative',
    marginTop: 20,
  },

  coffeemonPosition: {
    position: 'absolute',
    alignItems: 'center',
  },

  podiumWrapper: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    zIndex: 1,
  },

  podiumBase: {
    borderRadius: 50,
    opacity: 0.6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },

  podiumShadow: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 50,
    marginTop: 2,
    filter: 'blur(5px)',
  },

  infoFloating: {
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    ...theme.shadows.md,
    zIndex: 10,
  },

  infoFloatingActive: {
    borderColor: '#FFA500',
    backgroundColor: '#FFFBEB',
  },

  nameText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2D3436',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#636E72',
  },

  typeDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#B2BEC3',
    marginHorizontal: 5,
  },

  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#808E9B',
    textTransform: 'capitalize',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    fontSize: 40,
    opacity: 0.3,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B2BEC3',
    marginTop: 10,
  },
});
