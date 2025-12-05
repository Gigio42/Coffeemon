import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../../hooks/useCart';
import CartItem from '../../../components/Ecommerce/CartItem';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import { pixelArt } from '../../../theme';
import CustomAlert from '../../../components/Ecommerce/CustomAlert';
import { useCustomAlert } from '../../../hooks/useCustomAlert';

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
  const insets = useSafeAreaInsets();
  const [checkingOut, setCheckingOut] = useState(false);
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [isRetryPressed, setIsRetryPressed] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isShopPressed, setIsShopPressed] = useState(false);
  const [isCheckoutPressed, setIsCheckoutPressed] = useState(false);
  const { alertState, hideAlert, showError, showWarning, showSuccess, showConfirm } = useCustomAlert();

  // Calcula total de itens e economia
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    onCartUpdate(cartItems.length);
  }, [cartItems.length]);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleRemove = (productId: number) => {
    showConfirm(
      'Remover item',
      'Deseja remover este item do carrinho?',
      async () => {
        try {
          await removeItem(productId);
        } catch (err) {
          showError('Erro', 'Não foi possível remover o item');
        }
      },
      'Remover',
      'Cancelar'
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showWarning('Carrinho vazio', 'Adicione produtos antes de finalizar a compra');
      return;
    }

    try {
      setCheckingOut(true);
      await checkout();

      showSuccess(
        'Pedido Realizado! 🎉',
        'Seu pedido foi confirmado com sucesso!',
        onCheckoutComplete
      );
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
      showError('Erro', 'Não foi possível finalizar a compra');
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
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.6}
        >
          <Text style={styles.backButtonText}>←</Text>
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

      <LinearGradient 
        colors={['#e0f0ff', '#f0d0e0']} 
        style={styles.gradientContainer}
      >
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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </ScrollView>
        )}
      </LinearGradient>

      {cartItems.length > 0 && (
          <View style={[
            styles.footer,
            { paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 16) : 16 }
          ]}>
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
              <View style={styles.checkoutButtonContent}>
                {checkingOut ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.checkoutButtonText}>Processando...</Text>
                  </>
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
            </TouchableOpacity>
          </View>
      )}

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
