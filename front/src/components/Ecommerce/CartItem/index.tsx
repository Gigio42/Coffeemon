import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { CartItem as CartItemType } from '../../../types';
import { styles } from './styles';
import { pixelArt } from '../../../theme';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isDecreasePressed, setIsDecreasePressed] = useState(false);
  const [isIncreasePressed, setIsIncreasePressed] = useState(false);
  const [isRemovePressed, setIsRemovePressed] = useState(false);
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <View style={styles.cartItem}>
      {item.product.image && (
        <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              isDecreasePressed && pixelArt.buttons.smallPressed
            ]}
            onPressIn={() => setIsDecreasePressed(true)}
            onPressOut={() => setIsDecreasePressed(false)}
            onPress={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            activeOpacity={1}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              isIncreasePressed && pixelArt.buttons.smallPressed
            ]}
            onPressIn={() => setIsIncreasePressed(true)}
            onPressOut={() => setIsIncreasePressed(false)}
            onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            activeOpacity={1}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtotal}>
          Subtotal: {formatPrice(item.product.price * item.quantity)}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.removeButton,
          isRemovePressed && pixelArt.buttons.dangerPressed
        ]}
        onPressIn={() => setIsRemovePressed(true)}
        onPressOut={() => setIsRemovePressed(false)}
        onPress={() => onRemove(item.product.id)}
        activeOpacity={1}
      >
        <Image
          source={require('../../../../assets/icons/help_ajuda.png')}
          style={styles.removeButtonIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
