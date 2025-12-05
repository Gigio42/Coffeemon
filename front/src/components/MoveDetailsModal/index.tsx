import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface Move {
  id: number;
  name: string;
  description?: string;
  elementalType?: string;
  power: number;
  category?: string;
  accuracy?: number;
  effectChance?: number;
  statusEffect?: string;
  effects?: any[];
}

interface MoveDetailsModalProps {
  visible: boolean;
  move: Move | null;
  onClose: () => void;
}

const typeColors: {
  [key: string]: { primary: string; secondary: string };
} = {
  floral: { primary: "#E91E63", secondary: "#F48FB1" },
  sweet: { primary: "#FF6F91", secondary: "#FFB3C1" },
  fruity: { primary: "#FFC107", secondary: "#FFE082" },
  nutty: { primary: "#8D6E63", secondary: "#BCAAA4" },
  roasted: { primary: "#FF5722", secondary: "#FF8A65" },
  spicy: { primary: "#F44336", secondary: "#E57373" },
  sour: { primary: "#4CAF50", secondary: "#81C784" },
};

export default function MoveDetailsModal({ visible, move, onClose }: MoveDetailsModalProps) {
  if (!move) return null;

  const moveType = move.elementalType || 'roasted';
  const colorScheme = typeColors[moveType] || typeColors.roasted;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modal}>
          <BlurView intensity={95} tint="light" style={styles.modalContent}>
            <LinearGradient
              colors={[colorScheme.primary, colorScheme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <Text style={styles.moveName}>{move.name}</Text>
                <View style={[styles.typeBadge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Text style={styles.typeText}>{moveType.toUpperCase()}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.content}>
              {move.description && (
                <Text style={styles.description}>{move.description}</Text>
              )}

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Power</Text>
                  <Text style={[styles.statValue, { color: colorScheme.primary }]}>
                    {move.power || '—'}
                  </Text>
                </View>

                {move.category && (
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Category</Text>
                    <Text style={[styles.statValue, { color: colorScheme.primary }]}>
                      {move.category}
                    </Text>
                  </View>
                )}

                {move.accuracy !== undefined && (
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Accuracy</Text>
                    <Text style={[styles.statValue, { color: colorScheme.primary }]}>
                      {move.accuracy}%
                    </Text>
                  </View>
                )}

                {move.effectChance !== undefined && move.effectChance > 0 && (
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Effect Chance</Text>
                    <Text style={[styles.statValue, { color: colorScheme.primary }]}>
                      {move.effectChance}%
                    </Text>
                  </View>
                )}
              </View>

              {move.effects && move.effects.length > 0 && (
                <View style={styles.effectBox}>
                  <Text style={styles.effectLabel}>Effects</Text>
                  <Text style={styles.effectValue}>
                    {move.effects.map((e: any) => e.type || e).join(', ')}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colorScheme.primary }]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: '92%',
    maxWidth: 480,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 30,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moveName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  content: {
    padding: 28,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
    minWidth: '45%',
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    color: '#666',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  effectBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  effectLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    color: '#666',
  },
  effectValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
