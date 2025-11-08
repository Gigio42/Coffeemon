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
      <View style={styles.cartItemInner}>
        {/* Layout Horizontal Compacto */}
        <View style={styles.contentRow}>
          {/* Imagem Pequena */}
          {item.product.image ? (
            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>☕</Text>
            </View>
          )}

          {/* Informações Centrais */}
          <View style={styles.centerInfo}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={styles.unitPrice}>{formatPrice(item.product.price)}</Text>
            
            {/* Controles de Quantidade Inline */}
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  isDecreasePressed && styles.quantityButtonPressed,
                  item.quantity <= 1 && styles.quantityButtonDisabled
                ]}
                onPressIn={() => setIsDecreasePressed(true)}
                onPressOut={() => setIsDecreasePressed(false)}
                onPress={() => item.quantity > 1 && onUpdateQuantity(item.product.id, item.quantity - 1)}
                activeOpacity={1}
                disabled={item.quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  isIncreasePressed && styles.quantityButtonPressed
                ]}
                onPressIn={() => setIsIncreasePressed(true)}
                onPressOut={() => setIsIncreasePressed(false)}
                onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                activeOpacity={1}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lado Direito: Subtotal e Remover */}
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={[
                styles.removeButton,
                isRemovePressed && styles.removeButtonPressed
              ]}
              onPressIn={() => setIsRemovePressed(true)}
              onPressOut={() => setIsRemovePressed(false)}
              onPress={() => onRemove(item.product.id)}
              activeOpacity={1}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
            
            <Text style={styles.subtotalValue}>
              {formatPrice(item.product.price * item.quantity)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
