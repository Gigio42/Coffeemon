import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItem } from '../../../types';
import CartItemComponent from '../../../components/Ecommerce/CartItem';
import EmptyState from '../../../components/Ecommerce/EmptyState';
import { styles } from './styles';
import { pixelArt } from '../../../theme';
import CustomAlert from '../../../components/Ecommerce/CustomAlert';
import { useCustomAlert } from '../../../hooks/useCustomAlert';

interface CartScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => Promise<void>;
  onCheckoutComplete: () => void;
}

export default function CartScreen({
  cartItems,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onCheckoutComplete,
}: CartScreenProps) {
  const insets = useSafeAreaInsets();
  const [checkingOut, setCheckingOut] = useState(false);
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [isShopPressed, setIsShopPressed] = useState(false);
  const [isCheckoutPressed, setIsCheckoutPressed] = useState(false);
  const { alertState, hideAlert, showError, showWarning, showSuccess, showConfirm } = useCustomAlert();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace('.', ',')}`;

  const handleRemove = (productId: number) => {
    showConfirm(
      'Remover item',
      'Deseja remover este item do carrinho?',
      () => onRemoveItem(productId),
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
      await onCheckout();
      showSuccess('Pedido Realizado! 🎉', 'Seu pedido foi confirmado com sucesso!', onCheckoutComplete);
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
      showError('Erro', 'Não foi possível finalizar a compra');
    } finally {
      setCheckingOut(false);
    }
  };

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

      <LinearGradient colors={['#e0f0ff', '#f0d0e0']} style={styles.gradientContainer}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              iconSource={require('../../../../assets/icons/icone_carrinho_compra.png')}
              message="Seu carrinho está vazio"
            />
            <TouchableOpacity
              style={[styles.shopButton, isShopPressed && pixelArt.buttons.primaryPressed]}
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
              <CartItemComponent
                key={item.product.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
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
