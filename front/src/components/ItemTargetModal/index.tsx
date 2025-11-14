import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Item } from '../../api/itemsService';
import { Coffeemon } from '../../types';
import CoffeemonCard from '../CoffeemonCard';
import { styles } from './styles';

interface ItemTargetModalProps {
  visible: boolean;
  selectedItem: Item | null;
  coffeemons: Coffeemon[];
  onSelectTarget: (index: number) => void;
  onClose: () => void;
}

/**
 * Valida se o item pode ser usado no Coffeemon
 */
const canUseItemOnCoffeemon = (
  item: Item,
  coffeemon: Coffeemon
): { canUse: boolean; reason?: string } => {
  const effect = item.effects[0];

  if (effect.type === 'heal') {
    if (coffeemon.isFainted || coffeemon.currentHp <= 0) {
      return { canUse: false, reason: 'Coffeemon está derrotado' };
    }
    if (coffeemon.currentHp >= coffeemon.maxHp) {
      return { canUse: false, reason: 'HP já está cheio' };
    }
    return { canUse: true };
  }

  if (effect.type === 'revive') {
    if (!coffeemon.isFainted && coffeemon.currentHp > 0) {
      return { canUse: false, reason: 'Coffeemon não está derrotado' };
    }
    return { canUse: true };
  }

  if (effect.type === 'cure_status') {
    const statusToCure = effect.value as string;
    const hasStatus = coffeemon.statusEffects?.some((s: any) => s.name === statusToCure);
    if (!hasStatus) {
      return { canUse: false, reason: `Não tem status ${statusToCure}` };
    }
    return { canUse: true };
  }

  return { canUse: true };
};

export default function ItemTargetModal({
  visible,
  selectedItem,
  coffeemons,
  onSelectTarget,
  onClose,
}: ItemTargetModalProps) {
  if (!selectedItem) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>🎯 ESCOLHA O ALVO</Text>
              <Text style={styles.subtitle}>Item: {selectedItem.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Coffeemons List */}
          <ScrollView style={styles.targetsList} contentContainerStyle={styles.targetsListContent}>
            {coffeemons.map((coffeemon, index) => {
              const validation = canUseItemOnCoffeemon(selectedItem, coffeemon);

              // Criar objeto fake compatível com CoffeemonCard
              const fakePlayerCoffeemon: any = {
                id: index,
                hp: coffeemon.currentHp,
                attack: coffeemon.attack,
                defense: coffeemon.defense,
                level: 1,
                experience: 0,
                isInParty: false,
                coffeemon: {
                  id: index,
                  name: coffeemon.name,
                  type: 'floral',
                  defaultImage: undefined,
                },
                maxHp: coffeemon.maxHp,
              };

              return (
                <View key={index} style={styles.targetCardWrapper}>
                  <CoffeemonCard
                    coffeemon={fakePlayerCoffeemon}
                    onToggleParty={
                      validation.canUse ? async () => onSelectTarget(index) : async () => {}
                    }
                    variant="large"
                    isLoading={false}
                    maxHp={coffeemon.maxHp}
                    disabled={!validation.canUse}
                  />
                  {!validation.canUse && validation.reason && (
                    <View style={styles.reasonBadge}>
                      <Text style={styles.reasonText}>{validation.reason}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
