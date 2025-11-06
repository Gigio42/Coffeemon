import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Product } from '../../../types';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../../../components/Ecommerce/ProductCard';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';

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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>☕ Coffeemon Store</Text>
        <TouchableOpacity style={styles.cartButton} onPress={onNavigateToCart}>
          <Text style={styles.cartIcon}>🛒</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
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
    </SafeAreaView>
  );
}
