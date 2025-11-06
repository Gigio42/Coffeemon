import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Product } from '../../../types';
import { styles } from './styles';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      {product.image && (
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.productPrice}>
          {formatPrice(product.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
