import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Product } from '../../../types';
import { addToCart } from '../../../api/cartService';
import { styles } from './styles';

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

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleAddToCart = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      Alert.alert('Erro', 'Quantidade inválida');
      return;
    }

    try {
      setLoading(true);
      await addToCart(token, product.id, qty);

      Alert.alert(
        'Sucesso!',
        `${qty}x ${product.name} adicionado ao carrinho`,
        [
          { text: 'Continuar comprando', onPress: onBack },
          { text: 'Ir para carrinho', onPress: onAddedToCart },
        ]
      );
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {product.image && (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Quantidade</Text>
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

          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>
              {formatPrice(product.price * (parseInt(quantity) || 1))}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
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
                  <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
                </>
              )}
            </View>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
