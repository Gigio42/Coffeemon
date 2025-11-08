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
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../../../types';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../../../components/Ecommerce/ProductCard';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import { pixelArt } from '../../../theme';
import { addToCart } from '../../../api/cartService';
import CustomAlert from '../../../components/Ecommerce/CustomAlert';
import { useCustomAlert } from '../../../hooks/useCustomAlert';

interface ProductListScreenProps {
  token: string;
  onViewProduct: (product: Product) => void;
  onNavigateToCart: () => void;
  onNavigateToMatchmaking: () => void;
  cartCount: number;
}

export default function ProductListScreen({
  token,
  onViewProduct,
  onNavigateToCart,
  onNavigateToMatchmaking,
  cartCount,
}: ProductListScreenProps) {
  const { products, loading, refreshing, error, refetch, onRefresh } = useProducts();
  const [isRetryPressed, setIsRetryPressed] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isMatchmakingPressed, setIsMatchmakingPressed] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const { alertState, hideAlert, showError, showAlert } = useCustomAlert();

  // Filtrar produtos baseado na pesquisa
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await addToCart(token, product.id, 1);
      showAlert({
        type: 'success',
        title: 'Adicionado! 🛍️',
        message: `${product.name} foi adicionado ao carrinho`,
        showCancel: true,
        confirmText: 'Ver Carrinho',
        cancelText: 'Continuar Comprando',
        onConfirm: onNavigateToCart,
      });
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      showError('Erro', err instanceof Error ? err.message : 'Não foi possível adicionar ao carrinho');
    } finally {
      setAddingToCart(null);
    }
  };

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
        <View style={styles.searchContainer}>
          <Image
            source={require('../../../../assets/icons/icone_lupa_busca.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar produtos..."
            placeholderTextColor="#666666"
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Botão de Matchmaking */}
      <TouchableOpacity 
        style={[
          styles.matchmakingButton,
          isMatchmakingPressed && styles.matchmakingButtonPressed
        ]}
        onPressIn={() => setIsMatchmakingPressed(true)}
        onPressOut={() => setIsMatchmakingPressed(false)}
        onPress={onNavigateToMatchmaking}
        activeOpacity={1}
      >
        <Image
          source={require('../../../../assets/icons/escudo.png')}
          style={styles.matchmakingIcon}
          resizeMode="contain"
        />
        <Text style={styles.matchmakingText}>Ir para Batalha</Text>
      </TouchableOpacity>

      {/* Gradiente de fundo para o conteúdo */}
      <LinearGradient 
        colors={['#e0f0ff', '#f0d0e0']} 
        style={styles.gradientContainer}
      >
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
        <View>
          {/* Contador de resultados */}
          {searchText && (
            <View style={styles.resultsCounter}>
              <Text style={styles.resultsText}>
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                {searchText && ` para "${searchText}"`}
              </Text>
            </View>
          )}

          <FlatList
            data={filteredProducts}
            numColumns={2}
            key={2} // Força re-render com 2 colunas
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productsGrid}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item: product }) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => onViewProduct(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              filteredProducts.length === 0 && !loading ? (
                <EmptyState 
                  message={searchText ? `Nenhum produto encontrado para "${searchText}"` : "Nenhum produto disponível"} 
                />
              ) : null
            )}
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
