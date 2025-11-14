/**
 * ========================================
 * ECOMMERCE SCREEN - HUB DO E-COMMERCE
 * ========================================
 * 
 * Esta é a tela principal do e-commerce que gerencia:
 * 1. Navegação entre as sub-telas (Produtos, Carrinho, Pedidos, Perfil)
 * 2. Estado compartilhado do carrinho
 * 3. Dados de autenticação
 */

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import ProductListScreen from './ProductList';
import ProductDetailScreen from './ProductDetail';
import CartScreen from './Cart';
import OrderHistoryScreen from './Orders';
import ProfileScreen from './Profile';
import { Product } from '../../types';
import { styles } from './styles';
import { fetchPlayerCoffeemons, fetchPlayerData } from '../../api/coffeemonService';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { getTypeColor } from '../../components/CoffeemonCard/styles';
import { prefetchPalette } from '../../utils/colorPalette';

// Sub-telas do e-commerce
enum EcommerceTab {
  PRODUCTS = 'PRODUCTS',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  ORDERS = 'ORDERS',
  PROFILE = 'PROFILE'
}

interface EcommerceScreenProps {
  token: string;
  userId: number;
  onNavigateToMatchmaking: () => void;
  onLogout: () => void;
}

export default function EcommerceScreen({ 
  token, 
  userId, 
  onNavigateToMatchmaking,
  onLogout 
}: EcommerceScreenProps) {
  // Controla qual sub-tela está sendo exibida
  const [currentTab, setCurrentTab] = useState<EcommerceTab>(EcommerceTab.PRODUCTS);
  
  // Contador de itens no carrinho (para badge)
  const [cartCount, setCartCount] = useState<number>(0);
  
  // Produto selecionado para visualização detalhada
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const preloadCoffeemonPalettes = async () => {
      try {
        const playerData = await fetchPlayerData(token);
        const playerId = playerData?.id;
        if (!playerId) {
          return;
        }

        const coffeemons = await fetchPlayerCoffeemons(token, playerId);
        await Promise.allSettled(
          coffeemons.map(async (coffeemon) => {
            if (cancelled) {
              return;
            }

            const variant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
            const assetModule = getCoffeemonImage(coffeemon.coffeemon.name, variant);
            const fallbackPalette = getTypeColor(coffeemon.coffeemon.type, coffeemon.coffeemon.name);
            await prefetchPalette(assetModule, fallbackPalette);
          })
        );
      } catch (error) {
        console.warn('[Ecommerce] Failed to prefetch Coffeemon palettes', error);
      }
    };

    preloadCoffeemonPalettes();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Atualiza o contador do carrinho
  const handleCartUpdate = (count: number) => {
    setCartCount(count);
  };

  // Navega para detalhes do produto
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab(EcommerceTab.PRODUCT_DETAIL);
  };

  // Renderiza a tela atual
  const renderScreen = () => {
    switch (currentTab) {
      case EcommerceTab.PRODUCTS:
        return (
          <ProductListScreen
            token={token}
            onViewProduct={handleViewProduct}
            onNavigateToCart={() => setCurrentTab(EcommerceTab.CART)}
            onNavigateToMatchmaking={onNavigateToMatchmaking}
            cartCount={cartCount}
          />
        );

      case EcommerceTab.PRODUCT_DETAIL:
        return selectedProduct ? (
          <ProductDetailScreen
            token={token}
            product={selectedProduct}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            onAddedToCart={() => {
              // Poderia atualizar o contador aqui
              setCurrentTab(EcommerceTab.CART);
            }}
          />
        ) : null;

      case EcommerceTab.CART:
        return (
          <CartScreen
            token={token}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            onCartUpdate={handleCartUpdate}
            onCheckoutComplete={() => setCurrentTab(EcommerceTab.ORDERS)}
            onLogout={onLogout}
          />
        );

      case EcommerceTab.ORDERS:
        return (
          <OrderHistoryScreen
            token={token}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            onLogout={onLogout}
          />
        );

      case EcommerceTab.PROFILE:
        return (
          <ProfileScreen
            token={token}
            userId={userId}
            onLogout={onLogout}
            onNavigateToGame={onNavigateToMatchmaking}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      
      {/* Barra de Navegação Inferior - Só mostra nas telas principais, não nos detalhes */}
      {currentTab !== EcommerceTab.PRODUCT_DETAIL && (
        <View style={styles.tabBar}>
          <View style={styles.tabGroup}>
            {/* Tab: Produtos */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            >
              <Image
                source={require('../../../assets/icons/loja.png')}
                style={[
                  styles.tabIconImage,
                  currentTab === EcommerceTab.PRODUCTS && styles.tabIconActive
                ]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === EcommerceTab.PRODUCTS && styles.tabLabelActive
                ]}
              >
                Produtos
              </Text>
            </TouchableOpacity>

            {/* Tab: Carrinho */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setCurrentTab(EcommerceTab.CART)}
            >
              <View>
                <Image
                  source={require('../../../assets/icons/icone_carrinho_compra.png')}
                  style={[
                    styles.tabIconImage,
                    currentTab === EcommerceTab.CART && styles.tabIconActive
                  ]}
                  resizeMode="contain"
                />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === EcommerceTab.CART && styles.tabLabelActive
                ]}
              >
                Carrinho
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botão central: Matchmaking */}
          <TouchableOpacity
            style={styles.centerButtonWrapper}
            onPress={onNavigateToMatchmaking}
            activeOpacity={0.85}
          >
            <View style={styles.centerButton}>
              <Image
                source={require('../../../assets/icons/escudo.png')}
                style={styles.centerButtonIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.centerButtonLabel}>Match</Text>
          </TouchableOpacity>

          <View style={styles.tabGroup}>
            {/* Tab: Pedidos */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setCurrentTab(EcommerceTab.ORDERS)}
            >
              <Image
                source={require('../../../assets/icons/icone_caixa_produto.png')}
                style={[
                  styles.tabIconImage,
                  currentTab === EcommerceTab.ORDERS && styles.tabIconActive
                ]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === EcommerceTab.ORDERS && styles.tabLabelActive
                ]}
              >
                Pedidos
              </Text>
            </TouchableOpacity>

            {/* Tab: Perfil */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setCurrentTab(EcommerceTab.PROFILE)}
            >
              <Image
                source={require('../../../assets/icons/icone_perfil_usuario_generico.png')}
                style={[
                  styles.tabIconImage,
                  currentTab === EcommerceTab.PROFILE && styles.tabIconActive
                ]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === EcommerceTab.PROFILE && styles.tabLabelActive
                ]}
              >
                Perfil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
