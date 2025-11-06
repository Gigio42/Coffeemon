import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../../hooks/useCart';
import CartItem from '../../../components/Ecommerce/CartItem';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';

interface CartScreenProps {
  token: string;
  onBack: () => void;
  onCartUpdate: (count: number) => void;
  onCheckoutComplete: () => void;
  onLogout: () => void;
}

export default function CartScreen({
  token,
  onBack,
  onCartUpdate,
  onCheckoutComplete,
  onLogout,
}: CartScreenProps) {
  const { cartItems, loading, error, totalAmount, updateQuantity, removeItem, checkout, refetch } = useCart(token);
  const [checkingOut, setCheckingOut] = useState(false);

  React.useEffect(() => {
    onCartUpdate(cartItems.length);
  }, [cartItems.length]);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleRemove = (productId: number) => {
    Alert.alert('Remover item', 'Deseja remover este item do carrinho?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeItem(productId);
          } catch (err) {
            Alert.alert('Erro', 'Não foi possível remover o item');
          }
        },
      },
    ]);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de finalizar a compra');
      return;
    }

    try {
      setCheckingOut(true);
      await checkout();

      Alert.alert('Pedido Realizado! 🎉', 'Seu pedido foi confirmado com sucesso!', [
        { text: 'OK' },
        { text: 'Ver Pedidos', onPress: onCheckoutComplete },
      ]);
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
      Alert.alert('Erro', 'Não foi possível finalizar a compra');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando carrinho...</Text>
      </View>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Erro ao carregar carrinho</Text>
          <Text style={styles.errorSubtext}>Não foi possível autenticar sua sessão</Text>

          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>🔄 Tentar Novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={async () => {
              await AsyncStorage.clear();
              onLogout();
            }}
          >
            <Text style={styles.loginButtonText}>🔐 Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Meu Carrinho</Text>
        <View style={{ width: 80 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState icon="🛒" message="Seu carrinho está vazio" />
          <TouchableOpacity style={styles.shopButton} onPress={onBack}>
            <Text style={styles.shopButtonText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView}>
            {cartItems.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutButton, checkingOut && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={checkingOut}
            >
              <Text style={styles.checkoutButtonText}>
                {checkingOut ? 'Processando...' : '✅ Finalizar Compra'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
