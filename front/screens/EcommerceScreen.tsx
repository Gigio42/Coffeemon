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

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import {
  ProductListScreen,
  ProductDetailScreen,
  CartScreen,
  OrderHistoryScreen,
  ProfileScreen,
} from './ecommerce';
import { Product } from '../types';

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
          {/* Tab: Produtos */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.PRODUCTS)}
          >
            <Text style={[
              styles.tabIcon,
              currentTab === EcommerceTab.PRODUCTS && styles.tabIconActive
            ]}>
              🏪
            </Text>
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.PRODUCTS && styles.tabLabelActive
            ]}>
              Produtos
            </Text>
          </TouchableOpacity>

          {/* Tab: Carrinho */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.CART)}
          >
            <View>
              <Text style={[
                styles.tabIcon,
                currentTab === EcommerceTab.CART && styles.tabIconActive
              ]}>
                🛒
              </Text>
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.CART && styles.tabLabelActive
            ]}>
              Carrinho
            </Text>
          </TouchableOpacity>

          {/* Tab: Pedidos */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.ORDERS)}
          >
            <Text style={[
              styles.tabIcon,
              currentTab === EcommerceTab.ORDERS && styles.tabIconActive
            ]}>
              📦
            </Text>
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.ORDERS && styles.tabLabelActive
            ]}>
              Pedidos
            </Text>
          </TouchableOpacity>

          {/* Tab: Perfil */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.PROFILE)}
          >
            <Text style={[
              styles.tabIcon,
              currentTab === EcommerceTab.PROFILE && styles.tabIconActive
            ]}>
              👤
            </Text>
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.PROFILE && styles.tabLabelActive
            ]}>
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // ========================================
  // BARRA DE NAVEGAÇÃO INFERIOR
  // ========================================
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 5,
    paddingTop: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#8B4513',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
