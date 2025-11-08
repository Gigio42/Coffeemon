import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../../../types';
import { addToCart } from '../../../api/cartService';
import { styles } from './styles';
import CustomAlert from '../../../components/Ecommerce/CustomAlert';
import { useCustomAlert } from '../../../hooks/useCustomAlert';

interface ProductDetailScreenProps {
  token: string;
  product: Product;
  onBack: () => void;
  onAddedToCart: () => void;
}

export default function ProductDetailScreen({
  token,
  product,
  onBack,
  onAddedToCart,
}: ProductDetailScreenProps) {
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { alertState, hideAlert, showError, showAlert } = useCustomAlert();

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleAddToCart = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      showError('Erro', 'Quantidade inválida');
      return;
    }

    try {
      setLoading(true);
      await addToCart(token, product.id, qty);

      showAlert({
        type: 'success',
        title: 'Sucesso! 🎉',
        message: `${qty}x ${product.name} adicionado ao carrinho`,
        showCancel: true,
        confirmText: 'Ir para carrinho',
        cancelText: 'Continuar comprando',
        onConfirm: onAddedToCart,
      });
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      showError('Erro', err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
        <View style={{ width: 80 }} />
      </View>

      <LinearGradient 
        colors={['#e0f0ff', '#f0d0e0']} 
        style={styles.gradientContainer}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {product.image ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Sem imagem</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>Em estoque</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Preço unitário</Text>
            <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
      </ScrollView>
      </LinearGradient>

      <View style={[
        styles.footer,
        {
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 16) : 16
        }
      ]}>
        <View style={styles.subtotalContainerFooter}>
          <Text style={styles.subtotalLabelFooter}>Subtotal:</Text>
          <Text style={styles.subtotalValueFooter}>
            {formatPrice(product.price * (parseInt(quantity) || 1))}
          </Text>
        </View>
        
        <View style={styles.footerContent}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                const current = parseInt(quantity) || 1;
                if (current > 1) setQuantity(String(current - 1));
              }}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                const current = parseInt(quantity) || 1;
                setQuantity(String(current + 1));
              }}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addButton, loading && styles.addButtonDisabled]}
            onPress={handleAddToCart}
            disabled={loading}
          >
            <View style={styles.addButtonContent}>
              {loading ? (
                <Text style={styles.addButtonText}>Adicionando...</Text>
              ) : (
                <>
                  <Image
                    source={require('../../../../assets/icons/icone_carrinho_compra.png')}
                    style={styles.addButtonIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
