import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Product } from '../../../types';
import { styles } from './styles';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.productCard}>
        {/* Header apenas com nome do produto */}
        <View style={styles.cardHeader} testID={`product-card-header-${product.id}`}>
          <Text style={styles.productName} numberOfLines={2} testID={`product-name-${product.id}`}>
            {product.name.toUpperCase()}
          </Text>
        </View>

        {/* Descrição do produto */}
        <Text style={styles.productDescription} numberOfLines={3}>
          {product.description}
        </Text>

        {/* Imagem do produto com sparkles - Estrutura exata do HTML */}
        <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.placeholderText}>Latte</Text>
          )}
          
          {/* Sparkles decorativos - Exatamente como no HTML */}
          <View style={styles.sparklesContainer}>
            <View style={[styles.sparkle, styles.sparkle1]} />
            <View style={[styles.sparkle, styles.sparkle2]} />
            <View style={[styles.sparkle, styles.sparkle3]} />
            <View style={[styles.sparkle, styles.sparkle4]} />
            <View style={[styles.sparkle, styles.sparkle5]} />
          </View>
        </TouchableOpacity>

        {/* Preço do produto */}
        <Text style={styles.productPrice}>
          {formatPrice(product.price)}
        </Text>

        {/* Botão de adicionar ao carrinho - Exato do HTML */}
        <TouchableOpacity
          style={[styles.addButton, isPressed && styles.addButtonPressed]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={onAddToCart || onPress}
          activeOpacity={1}
        >
          <Text style={styles.addButtonText}>ADICIONAR AO CARRINHO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
