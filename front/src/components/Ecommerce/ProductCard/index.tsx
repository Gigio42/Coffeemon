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

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleButtonPress = (e: any) => {
    e?.stopPropagation?.();
    onAddToCart();
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.productCard}>
        {/* Header apenas com nome do produto */}
        <View style={styles.cardHeader} testID={`product-card-header-${product.id}`}>
          <Text style={styles.productName} numberOfLines={2} testID={`product-name-${product.id}`}>
            {product.name.toUpperCase()}
          </Text>
        </View>

        {/* Imagem do produto com sparkles */}
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.placeholderText}>Latte</Text>
          )}
          
          {/* Sparkles decorativos */}
          <View style={styles.sparklesContainer}>
            <View style={[styles.sparkle, styles.sparkle1]} />
            <View style={[styles.sparkle, styles.sparkle2]} />
            <View style={[styles.sparkle, styles.sparkle3]} />
            <View style={[styles.sparkle, styles.sparkle4]} />
            <View style={[styles.sparkle, styles.sparkle5]} />
          </View>
        </View>

        {/* Preço do produto */}
        <Text style={styles.productPrice}>
          {formatPrice(product.price)}
        </Text>

        {/* Botão de comprar - Adiciona ao carrinho */}
        <TouchableOpacity
          style={[styles.addButton, isPressed && styles.addButtonPressed]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleButtonPress}
          activeOpacity={1}
        >
          <Text style={styles.addButtonText}>COMPRAR</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
