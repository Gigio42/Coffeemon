import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Product } from '../../../types';
import { styles } from './styles';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const formatPrice = (price: number) =>
    `R$ ${price.toFixed(2).replace('.', ',')}`;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.productCard}>

        {/* Imagem */}
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.placeholderText}>☕</Text>
          )}
          <View style={styles.sparklesContainer}>
            <View style={[styles.sparkle, styles.sparkle1]} />
            <View style={[styles.sparkle, styles.sparkle2]} />
            <View style={[styles.sparkle, styles.sparkle3]} />
            <View style={[styles.sparkle, styles.sparkle4]} />
            <View style={[styles.sparkle, styles.sparkle5]} />
          </View>
        </View>

        {/* Nome */}
        <View style={styles.cardHeader}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
        </View>

        {/* Preço */}
        <Text style={styles.productPrice}>
          {formatPrice(product.price)}
        </Text>

        {/* Botão */}
        <TouchableOpacity
          style={[styles.addButton, isPressed && styles.addButtonPressed]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={(e) => { e.stopPropagation?.(); onAddToCart(); }}
          activeOpacity={1}
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
}
