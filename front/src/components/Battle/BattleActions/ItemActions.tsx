import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  getItemColor,
  getItemIcon,
  Item,
} from "../../../api/itemsService";
import { styles } from "./styles";

interface ItemActionsProps {
  items: Item[];
  playerItems: Map<number, number>;
  onSelectItem: (item: Item) => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function ItemActions({
  items,
  playerItems,
  onSelectItem,
  onBack,
  disabled = false,
}: ItemActionsProps) {
  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.itemScrollView}
        contentContainerStyle={styles.itemScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => {
          const quantity = playerItems.get(item.id) || 0;
          const hasItem = quantity > 0;
          const icon = getItemIcon(item.id);
          const color = getItemColor(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemButton,
                !hasItem && styles.itemButtonDisabled,
              ]}
              onPress={() => onSelectItem(item)}
              disabled={!hasItem || disabled}
            >
              <View style={styles.itemButtonContent}>
                {icon && (
                  <Image
                    source={icon}
                    style={[
                      styles.itemIcon,
                      !hasItem && styles.itemIconDisabled,
                    ]}
                  />
                )}
                <View style={styles.itemTextContainer}>
                  <Text
                    style={[
                      styles.itemName,
                      !hasItem && styles.itemNameDisabled,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.itemDescription,
                      !hasItem && styles.itemDescriptionDisabled,
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
                {hasItem ? (
                  <View
                    style={[
                      styles.itemQuantityBadge,
                      { backgroundColor: color },
                    ]}
                  >
                    <Text style={styles.itemQuantityText}>x{quantity}</Text>
                  </View>
                ) : (
                  <View style={styles.itemOutOfStockBadge}>
                    <Text style={styles.itemOutOfStockText}>0</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
