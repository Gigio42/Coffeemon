import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Coffeemon } from '../../../types';
import { styles } from './styles';

export interface SwitchCandidate {
  coffeemon: Coffeemon;
  index: number;
  canSwitch: boolean;
  reason?: string;
}

interface SwitchModalProps {
  visible: boolean;
  candidates: SwitchCandidate[];
  onSelect: (index: number) => void;
  onClose: () => void;
  getImageSource: (name: string, variant?: 'default' | 'back') => any;
}

export default function SwitchModal({
  visible,
  candidates,
  onSelect,
  onClose,
  getImageSource,
}: SwitchModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={24} tint="dark" style={styles.blurBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Escolha seu combatente!</Text>

          <ScrollView
            contentContainerStyle={styles.cardsContainer}
            showsVerticalScrollIndicator={false}
          >
            {candidates.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum Coffeemon disponível para troca</Text>
            ) : (
              candidates.map(({ coffeemon, index, canSwitch, reason }) => {
                const hpPercent = Math.max(
                  0,
                  Math.min(100, (coffeemon.currentHp / coffeemon.maxHp) * 100 || 0)
                );
                const imageSource = getImageSource(coffeemon.name, 'default');

                return (
                  <TouchableOpacity
                    key={`${coffeemon.name}-${index}`}
                    style={[styles.card, !canSwitch && styles.cardDisabled]}
                    onPress={() => onSelect(index)}
                    disabled={!canSwitch}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardName}>{coffeemon.name}</Text>
                      {!canSwitch && (
                        <Text style={styles.lockIcon}>🔒</Text>
                      )}
                    </View>

                    <Image
                      source={imageSource}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />

                    <View style={styles.hpBarContainer}>
                      <View style={styles.hpBarTrack}>
                        <View
                          style={[styles.hpBarFill, { width: `${hpPercent}%` }]}
                        />
                      </View>
                      <Text style={styles.hpText}>
                        {coffeemon.currentHp}/{coffeemon.maxHp} HP
                      </Text>
                    </View>

                    <View style={styles.statsRow}>
                      <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>ATK</Text>
                        <Text style={styles.statValue}>
                          {coffeemon.attack !== undefined ? coffeemon.attack : '--'}
                        </Text>
                      </View>
                      <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>DEF</Text>
                        <Text style={styles.statValue}>
                          {coffeemon.defense !== undefined ? coffeemon.defense : '--'}
                        </Text>
                      </View>
                      <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>SPD</Text>
                        <Text style={styles.statValue}>
                          {coffeemon.speed !== undefined ? coffeemon.speed : '--'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.selectBadge}>
                        {canSwitch ? 'Selecionar' : 'Indisponível'}
                      </Text>
                    </View>

                    {!canSwitch && reason ? (
                      <Text style={styles.disabledText}>{reason}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}
