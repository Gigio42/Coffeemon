import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import ProductListScreen from './ProductList';
import ProductDetailScreen from './ProductDetail';
import CartScreen from './Cart';
import OrderHistoryScreen from './Orders';
import { CartItem, Product } from '../../types';
import { styles } from './styles';
import { fetchPlayerCoffeemons, fetchPlayerData } from '../../api/coffeemonService';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';
import { prefetchPalette } from '../../utils/colorPalette';
import { checkoutWithItems } from '../../api/cartService';
import { saveLocalOrder } from '../../api/localOrderService';

enum EcommerceTab {
  PRODUCTS = 'PRODUCTS',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  ORDERS = 'ORDERS',
}

interface EcommerceScreenProps {
  token?: string;
  userId?: number;
  onNavigateToGame: () => void;
  onLogout: () => void;
}

export default function EcommerceScreen({
  token,
  userId,
  onNavigateToGame,
  onLogout,
}: EcommerceScreenProps) {
  const [currentTab, setCurrentTab] = useState<EcommerceTab>(EcommerceTab.PRODUCTS);
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const preloadCoffeemonPalettes = async () => {
      try {
        const playerData = await fetchPlayerData(token);
        const playerId = playerData?.id;
        if (!playerId) return;

        const coffeemons = await fetchPlayerCoffeemons(token, playerId);
        for (const coffeemon of coffeemons.slice(0, 2)) {
          if (cancelled) return;
          const variant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
          const assetModule = getCoffeemonImage(coffeemon.coffeemon.name, variant);
          await prefetchPalette(assetModule);
        }
      } catch {
        // silencioso — prefetch é opcional
      }
    };

    const timer = setTimeout(() => {
      preloadCoffeemonPalettes();
    }, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token]);

  // ─── Carrinho local ──────────────────────────
  const handleAddToCart = (product: Product, quantity: number) => {
    setLocalCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      setLocalCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setLocalCart((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
      );
    }
  };

  const handleRemoveItem = (productId: number) => {
    setLocalCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleCheckout = async () => {
    const checkoutCart = [...localCart];
    const items = localCart.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
    const orderResult = await checkoutWithItems(items, token);
    if (!token) {
      await saveLocalOrder(orderResult.orderId, checkoutCart);
    }
    setLocalCart([]);
  };

  // ─── Telas ───────────────────────────────────
  const renderScreen = () => {
    switch (currentTab) {
      case EcommerceTab.PRODUCTS:
        return (
          <ProductListScreen
            onViewProduct={(product) => {
              setSelectedProduct(product);
              setCurrentTab(EcommerceTab.PRODUCT_DETAIL);
            }}
            onNavigateToCart={() => setCurrentTab(EcommerceTab.CART)}
            cartCount={localCart.length}
            onAddToCart={handleAddToCart}
          />
        );

      case EcommerceTab.PRODUCT_DETAIL:
        return selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            onAddedToCart={() => setCurrentTab(EcommerceTab.CART)}
            onAddToCart={handleAddToCart}
          />
        ) : null;

      case EcommerceTab.CART:
        return (
          <CartScreen
            cartItems={localCart}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onCheckoutComplete={() => setCurrentTab(EcommerceTab.ORDERS)}
          />
        );

      case EcommerceTab.ORDERS:
        return (
          <OrderHistoryScreen
            token={token}
            onBack={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            onNavigateToLogin={onNavigateToGame}
          />
        );

      default:
        return null;
    }
  };

  const cartQty = localCart.reduce((s, i) => s + i.quantity, 0);
  const isDetail = currentTab === EcommerceTab.PRODUCT_DETAIL;

  return (
    <View style={styles.container}>
      {renderScreen()}

      {!isDetail && (
        <View style={styles.tabBar}>

          {/* ── Produtos ── */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.PRODUCTS)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/loja.png')}
              style={[
                styles.tabIconImage,
                currentTab === EcommerceTab.PRODUCTS && styles.tabIconActive,
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.PRODUCTS && styles.tabLabelActive,
            ]}>
              Loja
            </Text>
            <View style={currentTab === EcommerceTab.PRODUCTS ? styles.tabDot : styles.tabDotHidden} />
          </TouchableOpacity>

          {/* ── Carrinho ── */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.CART)}
            activeOpacity={0.7}
          >
            <View style={styles.badgeWrapper}>
              <Image
                source={require('../../../assets/icons/icone_carrinho_compra.png')}
                style={[
                  styles.tabIconImage,
                  currentTab === EcommerceTab.CART && styles.tabIconActive,
                ]}
                resizeMode="contain"
              />
              {cartQty > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartQty > 9 ? '9+' : cartQty}</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.CART && styles.tabLabelActive,
            ]}>
              Carrinho
            </Text>
            <View style={currentTab === EcommerceTab.CART ? styles.tabDot : styles.tabDotHidden} />
          </TouchableOpacity>

          {/* ── Pedidos ── */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setCurrentTab(EcommerceTab.ORDERS)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/icone_caixa_produto.png')}
              style={[
                styles.tabIconImage,
                currentTab === EcommerceTab.ORDERS && styles.tabIconActive,
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.tabLabel,
              currentTab === EcommerceTab.ORDERS && styles.tabLabelActive,
            ]}>
              Pedidos
            </Text>
            <View style={currentTab === EcommerceTab.ORDERS ? styles.tabDot : styles.tabDotHidden} />
          </TouchableOpacity>

          {/* ── GAME (botão destaque — direita) ── */}
          <TouchableOpacity
            style={styles.gameTabButton}
            onPress={onNavigateToGame}
            activeOpacity={0.85}
          >
            <View style={styles.gameButtonInner}>
              <Image
                source={require('../../../assets/icons/escudo.png')}
                style={styles.gameButtonIcon}
                resizeMode="contain"
              />
              <Text style={styles.gameButtonLabel}>Jogar</Text>
            </View>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
}
