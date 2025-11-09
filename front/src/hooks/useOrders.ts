import { useState, useEffect } from 'react';
import { fetchOrders } from '../api/orderService';
import { Order } from '../types';

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  refreshing: boolean;
  error: boolean;
  refetch: () => void;
  onRefresh: () => void;
}

export function useOrders(token: string): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadOrders = async (isRefreshing = false) => {
    try {
      setError(false);
      if (!isRefreshing) {
        setLoading(true);
      }

      const data = await fetchOrders(token);
      setOrders(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const refetch = () => {
    loadOrders();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders(true);
  };

  return {
    orders,
    loading,
    refreshing,
    error,
    refetch,
    onRefresh,
  };
}
