import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../../hooks/useCart';
import CartItem from '../../../components/Ecommerce/CartItem';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import { pixelArt } from '../../../theme';

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
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [isRetryPressed, setIsRetryPressed] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isShopPressed, setIsShopPressed] = useState(false);
  const [isCheckoutPressed, setIsCheckoutPressed] = useState(false);

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
          <Image
            source={require('../../../../assets/icons/help_ajuda.png')}
            style={styles.helpIcon}
            resizeMode="contain"
          />
          <Text style={styles.errorText}>Erro ao carregar carrinho</Text>
          <Text style={styles.errorSubtext}>Não foi possível autenticar sua sessão</Text>

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
                style={styles.settingsIcon}
                resizeMode="contain"
              />
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoginPressed && pixelArt.buttons.primaryPressed
            ]}
            onPressIn={() => setIsLoginPressed(true)}
            onPressOut={() => setIsLoginPressed(false)}
            onPress={async () => {
              await AsyncStorage.clear();
              onLogout();
            }}
            activeOpacity={1}
          >
            <View style={styles.loginButtonContent}>
              <Image
                source={require('../../../../assets/icons/icone_perfil_usuario_generico.png')}
                style={styles.profileIcon}
                resizeMode="contain"
              />
              <Text style={styles.loginButtonText}>Voltar ao Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[
            styles.backButton,
            isBackPressed && pixelArt.buttons.actionPressed
          ]}
          onPressIn={() => setIsBackPressed(true)}
          onPressOut={() => setIsBackPressed(false)}
          onPress={onBack}
          activeOpacity={1}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('../../../../assets/icons/icone_carrinho_compra.png')}
            style={styles.emptyIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Meu Carrinho</Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState 
            iconSource={require('../../../../assets/icons/icone_carrinho_compra.png')} 
            message="Seu carrinho está vazio" 
          />
          <TouchableOpacity 
            style={[
              styles.shopButton,
              isShopPressed && pixelArt.buttons.primaryPressed
            ]}
            onPressIn={() => setIsShopPressed(true)}
            onPressOut={() => setIsShopPressed(false)}
            onPress={onBack}
            activeOpacity={1}
          >
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
              style={[
                styles.checkoutButton, 
                checkingOut && styles.checkoutButtonDisabled,
                isCheckoutPressed && pixelArt.buttons.secondaryPressed
              ]}
              onPressIn={() => setIsCheckoutPressed(true)}
              onPressOut={() => setIsCheckoutPressed(false)}
              onPress={handleCheckout}
              disabled={checkingOut}
              activeOpacity={1}
            >
              <Text style={styles.checkoutButtonText}>
                <View style={styles.checkoutButtonContent}>
                  {checkingOut ? (
                    <Text style={styles.checkoutButtonText}>Processando...</Text>
                  ) : (
                    <>
                      <Image
                        source={require('../../../../assets/icons/icone_cartao_credito.png')}
                        style={styles.checkoutIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                    </>
                  )}
                </View>
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
