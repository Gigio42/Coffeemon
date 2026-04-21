import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../../../types';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../../../components/Ecommerce/ProductCard';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import CustomAlert from '../../../components/Ecommerce/CustomAlert';
import { useCustomAlert } from '../../../hooks/useCustomAlert';

interface ProductListScreenProps {
  onViewProduct: (product: Product) => void;
  onNavigateToCart: () => void;
  cartCount: number;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductListScreen({
  onViewProduct,
  onNavigateToCart,
  cartCount,
  onAddToCart,
}: ProductListScreenProps) {
  const { products, loading, refreshing, error, refetch, onRefresh } = useProducts();
  const [searchText, setSearchText] = useState('');
  const { alertState, hideAlert, showAlert } = useCustomAlert();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    onAddToCart(product, 1);
    showAlert({
      type: 'success',
      title: 'Adicionado! 🛍️',
      message: `${product.name} foi adicionado ao carrinho`,
      showCancel: true,
      confirmText: 'Ver Carrinho',
      cancelText: 'Continuar',
      onConfirm: onNavigateToCart,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header espresso ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Branding */}
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandIcon}>☕</Text>
              <Text style={styles.brandTitle}>Coffeemon</Text>
            </View>
            <Text style={styles.brandSubtitle}>Café & Loja</Text>
          </View>

          {/* Chip do carrinho */}
          <TouchableOpacity style={styles.cartChip} onPress={onNavigateToCart} activeOpacity={0.75}>
            <Image
              source={require('../../../../assets/icons/icone_carrinho_compra.png')}
              style={styles.cartChipIcon}
              resizeMode="contain"
            />
            {cartCount > 0 ? (
              <View style={styles.cartChipBadge}>
                <Text style={styles.cartChipBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            ) : (
              <Text style={styles.cartChipCount}>0</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Barra de busca */}
        <View style={styles.searchContainer}>
          <Image
            source={require('../../../../assets/icons/icone_lupa_busca.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar no cardápio..."
            placeholderTextColor="rgba(255,255,255,0.38)"
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.searchClear} onPress={() => setSearchText('')}>
              <Text style={styles.searchClearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Conteúdo ── */}
      <LinearGradient colors={['#F0EBE3', '#FAF7F2']} style={styles.gradientContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <View style={styles.retryButtonContent}>
                <Image
                  source={require('../../../../assets/icons/icone_engrenagem_ajustes.png')}
                  style={styles.retryIcon}
                  resizeMode="contain"
                />
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            {searchText.length > 0 && (
              <View style={styles.resultsCounter}>
                <Text style={styles.resultsText}>
                  {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{searchText}"
                </Text>
              </View>
            )}

            <FlatList
              style={styles.productList}
              data={filteredProducts}
              numColumns={2}
              key={2}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productsGrid}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B4513" />}
              renderItem={({ item: product }) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onViewProduct(product)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={() =>
                !loading ? (
                  <EmptyState
                    message={
                      searchText
                        ? `Nenhum produto encontrado para "${searchText}"`
                        : 'Nenhum produto disponível'
                    }
                  />
                ) : null
              }
            />
          </View>
        )}
      </LinearGradient>

      <CustomAlert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={hideAlert}
        showCancel={alertState.showCancel}
        onConfirm={alertState.onConfirm}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    </SafeAreaView>
  );
}
