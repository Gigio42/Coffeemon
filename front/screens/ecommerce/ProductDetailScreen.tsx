import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { getServerUrl } from "../../utils/config";
import { Product } from "../../types";

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
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const handleAddToCart = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      Alert.alert("Erro", "Quantidade inválida");
      return;
    }

    try {
      setLoading(true);

      // --- MUDANÇA: Adicionar 'await' em getServerUrl() ---
      const url = await getServerUrl();
      console.log("Adicionando ao carrinho:", {
        productId: product.id,
        quantity: qty,
        url: `${url}/shopping-cart`,
      });

      const response = await fetch(`${url}/shopping-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
        }),
      });

      console.log("Status da resposta:", response.status);
      const responseData = await response.json();
      console.log("Resposta do servidor:", responseData);

      if (!response.ok) {
        // Erro específico de usuário não encontrado
        if (
          responseData.message &&
          responseData.message.includes("Usuário com ID")
        ) {
          throw new Error(
            "Sessão expirada ou inválida. Por favor, faça logout e login novamente."
          );
        }
        throw new Error(
          responseData.message || "Erro ao adicionar ao carrinho"
        );
      }

      Alert.alert(
        "Sucesso! ✅",
        `${qty}x ${product.name} adicionado ao carrinho`,
        [
          { text: "Continuar comprando", onPress: onBack },
          { text: "Ir para carrinho", onPress: onAddedToCart },
        ]
      );
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Erro desconhecido"
      );
    } finally {
      setLoading(false);
    }
  };

  // ... (JSX de renderização - NÃO MUDA)
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Imagem do produto */}
        {product.image && (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}

        {/* Informações do produto */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={styles.divider} />

          {/* Seletor de quantidade */}
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

          {/* Subtotal */}
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>
              {formatPrice(product.price * (parseInt(quantity) || 1))}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão adicionar ao carrinho */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? "Adicionando..." : "🛒 Adicionar ao Carrinho"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... (seus styles continuam iguais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#8B4513",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#e0e0e0",
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  productPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B4513",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  quantityInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 8,
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  subtotalLabel: {
    fontSize: 18,
    color: "#666",
  },
  subtotalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  addButton: {
    backgroundColor: "#8B4513",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
