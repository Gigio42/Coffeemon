import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Coffeemon } from '../../../types';
import { styles } from './styles';

interface SelectionModalProps {
  visible: boolean;
  coffeemons: Coffeemon[];
  onSelect: (index: number) => void;
}

export default function SelectionModal({
  visible,
  coffeemons,
  onSelect,
}: SelectionModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Escolha seu Coffeemon Inicial</Text>
          <View style={styles.selectionRow}>
            {coffeemons.map((mon, index) => {
              const isFainted = mon.currentHp <= 0;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.selectionCard,
                    isFainted && styles.selectionCardDisabled,
                  ]}
                  onPress={() => onSelect(index)}
                  disabled={isFainted}
                >
                  <Text style={[
                    styles.selectionName,
                    isFainted && styles.selectionNameDisabled,
                  ]}>
                    {mon.name}
                  </Text>
                  <Text style={[
                    styles.selectionHp,
                    isFainted && styles.selectionHpDisabled,
                  ]}>
                    HP: {mon.currentHp}/{mon.maxHp}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
