import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Item, getItemIcon, getItemColor } from '../../api/itemsService';
import { styles } from './styles';

interface ItemSelectionModalProps {
  visible: boolean;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onClose: () => void;
}

export default function ItemSelectionModal({
  visible,
  items,
  onSelectItem,
  onClose,
}: ItemSelectionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>💼 ESCOLHA UM ITEM</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <ScrollView style={styles.itemsList} contentContainerStyle={styles.itemsListContent}>
            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum item disponível</Text>
              </View>
            ) : (
              items.map((item) => {
                const quantity = item.quantity || 0;
                const hasItem = quantity > 0;
                const icon = getItemIcon(item.id);
                const effectType = item.effects[0]?.type || 'heal';
                const color = getItemColor(effectType);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      { borderColor: color },
                      !hasItem && styles.itemCardDisabled,
                    ]}
                    onPress={() => hasItem && onSelectItem(item)}
                    disabled={!hasItem}
                  >
                    <View style={styles.itemIconContainer}>
                      <Text style={styles.itemIcon}>{icon}</Text>
                      {hasItem && (
                        <View style={[styles.quantityBadge, { backgroundColor: color }]}>
                          <Text style={styles.quantityText}>x{quantity}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, !hasItem && styles.itemNameDisabled]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemDescription, !hasItem && styles.itemDescriptionDisabled]}>
                        {item.description}
                      </Text>
                    </View>

                    {!hasItem && (
                      <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>SEM ESTOQUE</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
