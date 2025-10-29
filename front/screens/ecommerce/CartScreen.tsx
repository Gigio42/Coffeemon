import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getServerUrl } from "../../utils/config";
import { CartItem } from "../../types";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      // --- MUDANÇA: Adicionar 'await' em getServerUrl() ---
      const response = await fetch(`${await getServerUrl()}/shopping-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Se for erro 401 ou 403, é problema de autenticação
        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
        }
        throw new Error("Erro ao carregar carrinho");
      }

      const data = await response.json();

      // A API retorna um array de Orders ou "Carrinho vazio"
      if (typeof data === "string") {
        setCartItems([]);
        onCartUpdate(0);
      } else if (Array.isArray(data)) {
        // Converter o formato da API para o formato esperado pelo frontend
        const items: CartItem[] = [];
        data.forEach((order: any) => {
          if (order.orderItem && Array.isArray(order.orderItem)) {
            order.orderItem.forEach((item: any) => {
              items.push({
                product: {
                  id: item.product.id,
                  name: item.product.name,
                  description: item.product.description,
                  price: item.product.price,
                  image: item.product.image,
                },
                quantity: item.quantity,
              });
            });
          }
        });
        setCartItems(items);
        onCartUpdate(items.length);
      } else {
        setCartItems([]);
        onCartUpdate(0);
      }
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
      setAuthError(true);
      Alert.alert("Erro", "Não foi possível carregar o carrinho");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    // Se a quantidade for menor que 1, remover o item sem confirmação
    if (newQuantity < 1) {
      await removeItemDirect(productId);
      return;
    }

    try {
      // --- MUDANÇA: Adicionar 'await' em getServerUrl() ---
      const response = await fetch(`${await getServerUrl()}/shopping-cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar quantidade");
      }

      await fetchCart();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar a quantidade");
    }
  };

  const removeItemDirect = async (productId: number) => {
    try {
      // --- MUDANÇA: Adicionar 'await' em getServerUrl() ---
      const response = await fetch(
        `${await getServerUrl()}/shopping-cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover item");
      }

      await fetchCart();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível remover o item");
    }
  };

  const removeItem = async (productId: number) => {
    Alert.alert("Remover item", "Deseja remover este item do carrinho?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeItemDirect(productId),
      },
    ]);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione produtos antes de finalizar a compra"
      );
      return;
    }

    try {
      setCheckingOut(true);

      // --- MUDANÇA: Adicionar 'await' em getServerUrl() ---
      const response = await fetch(`${await getServerUrl()}/orders`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Erro ao finalizar compra");
      }

      // Backend pode retornar texto ou JSON
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      // Recarregar o carrinho (vai vir vazio agora)
      await fetchCart();

      Alert.alert(
        "Pedido Realizado! 🎉",
        "Seu pedido foi confirmado com sucesso!",
        [{ text: "OK" }, { text: "Ver Pedidos", onPress: onCheckoutComplete }]
      );
    } catch (err) {
      console.error("Erro ao finalizar compra:", err);
      Alert.alert("Erro", "Não foi possível finalizar a compra");
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  // ... (JSX de renderização - NÃO MUDA)
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando carrinho...</Text>
      </View>
    );
  }

  // Se houver erro de autenticação, mostra opção de voltar ao login
  if (authError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Erro ao carregar carrinho</Text>
          <Text style={styles.errorSubtext}>
            Não foi possível autenticar sua sessão
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setAuthError(false);
              setLoading(true);
              fetchCart();
            }}
          >
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Meu Carrinho</Text>
        <View style={{ width: 80 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyMessage}>Seu carrinho está vazio</Text>
          <TouchableOpacity style={styles.shopButton} onPress={onBack}>
            <Text style={styles.shopButtonText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView}>
            {cartItems.map((item) => (
              <View key={item.product.id} style={styles.cartItem}>
                {item.product.image && (
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.itemImage}
                  />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.product.price)}
                  </Text>

                  {/* Controles de quantidade */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subtotal}>
                    Subtotal: {formatPrice(item.product.price * item.quantity)}
                  </Text>
                </View>

                {/* Botão remover */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.product.id)}
                >
                  <Text style={styles.removeButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Footer com total e botão de checkout */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(calculateTotal())}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                checkingOut && styles.checkoutButtonDisabled,
              ]}
              onPress={handleCheckout}
              disabled={checkingOut}
            >
              <Text style={styles.checkoutButtonText}>
                {checkingOut ? "Processando..." : "✅ Finalizar Compra"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

// ... (seus styles continuam iguais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  itemPrice: {
    fontSize: 14,
    color: "#8B4513",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: "#8B4513",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 20,
    color: "#666",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B4513",
  },
  checkoutButton: {
    backgroundColor: "#8B4513",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#ff3b30",
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#8B4513",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
