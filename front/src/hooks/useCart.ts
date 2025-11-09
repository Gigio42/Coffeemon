import { useState, useEffect, useCallback } from 'react';
import { fetchCart, addToCart as addToCartService, updateCartItem, removeFromCart as removeFromCartService, checkout as checkoutService } from '../api/cartService';
import { CartItem } from '../types';

interface UseCartReturn {
  cartItems: CartItem[];
  loading: boolean;
  error: boolean;
  totalItems: number;
  totalAmount: number;
  refetch: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  checkout: () => Promise<void>;
}

export function useCart(token: string): UseCartReturn {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      setError(false);
      const data = await fetchCart(token);
      setCartItems(data);
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const refetch = async () => {
    setLoading(true);
    await loadCart();
  };

  const addToCart = async (productId: number, quantity: number) => {
    await addToCartService(token, productId, quantity);
    await loadCart();
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) {
      await removeFromCartService(token, productId);
    } else {
      await updateCartItem(token, productId, quantity);
    }
    await loadCart();
  };

  const removeItem = async (productId: number) => {
    await removeFromCartService(token, productId);
    await loadCart();
  };

  const checkout = async () => {
    await checkoutService(token);
    await loadCart();
  };

  const totalItems = cartItems.length;
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    cartItems,
    loading,
    error,
    totalItems,
    totalAmount,
    refetch,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
  };
}
