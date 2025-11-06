import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../../../types';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../../../components/Ecommerce/ProductCard';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import { pixelArt } from '../../../theme';

interface ProductListScreenProps {
  token: string;
  onViewProduct: (product: Product) => void;
  onNavigateToCart: () => void;
  cartCount: number;
}

export default function ProductListScreen({
  token,
  onViewProduct,
  onNavigateToCart,
  cartCount,
}: ProductListScreenProps) {
  const { products, loading, refreshing, error, refetch, onRefresh } = useProducts();
  const [isCartPressed, setIsCartPressed] = useState(false);
  const [isRetryPressed, setIsRetryPressed] = useState(false);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#e0f0ff', '#f0d0e0']} // --bg-light to --bg-dark
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>☕ Coffeemon Store</Text>
        <TouchableOpacity 
          style={[
            styles.cartButton,
            isCartPressed && pixelArt.buttons.primaryPressed
          ]}
          onPressIn={() => setIsCartPressed(true)}
          onPressOut={() => setIsCartPressed(false)}
          onPress={onNavigateToCart}
          activeOpacity={1}
        >
          <Image
            source={require('../../../../assets/icons/icone_sacola_compras.png')}
            style={styles.cartIconImage}
            resizeMode="contain"
          />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity 
            style={[
              styles.retryButton,
              isRetryPressed && pixelArt.buttons.actionPressed
            ]}
            onPressIn={() => setIsRetryPressed(true)}
            onPressOut={() => setIsRetryPressed(false)}
            onPress={refetch}
            activeOpacity={1}
          >
            <View style={styles.retryButtonContent}>
              <Image
                source={require('../../../../assets/icons/icone_engrenagem_ajustes.png')}
                style={styles.retryIcon}
                resizeMode="contain"
              />
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => onViewProduct(product)}
              />
            ))}
          </View>

          {products.length === 0 && !loading && (
            <EmptyState message="Nenhum produto disponível" />
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}
