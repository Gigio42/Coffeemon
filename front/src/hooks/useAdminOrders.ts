import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import {
  fetchAdminOrders,
  fetchAdminStats,
  fetchAdminAnalytics,
  updateOrderStatus,
  AdminOrder,
  AdminStats,
  AdminAnalytics,
} from '../api/adminService';

interface UseAdminOrdersResult {
  orders: AdminOrder[];
  stats: AdminStats | null;
  analytics: AdminAnalytics | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  load: (filter?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  markDelivered: (orderId: number) => Promise<void>;
  markPending: (orderId: number) => Promise<void>;
  markCancelled: (orderId: number) => Promise<void>;
}

export function useAdminOrders(token: string): UseAdminOrdersResult {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilterState] = useState('');
  const filterRef = useRef('');

  const loadData = useCallback(async (filter: string, isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [ordersData, statsData, analyticsData] = await Promise.all([
        fetchAdminOrders(token, filter || undefined),
        fetchAdminStats(token),
        fetchAdminAnalytics(token),
      ]);
      setOrders(ordersData);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar dados');
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  }, [token]);

  const setStatusFilter = useCallback((s: string) => {
    filterRef.current = s;
    setStatusFilterState(s);
    loadData(s, false);
  }, [loadData]);

  const load = useCallback((filter?: string) => {
    const f = filter ?? filterRef.current;
    return loadData(f, false);
  }, [loadData]);

  const onRefresh = useCallback(() => loadData(filterRef.current, true), [loadData]);

  const applyStatus = useCallback(async (orderId: number, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await updateOrderStatus(token, orderId, status);
    } catch (e: any) {
      Alert.alert('Erro', e?.message ?? 'Não foi possível atualizar o pedido.');
    } finally {
      loadData(filterRef.current, true);
    }
  }, [token, loadData]);

  const markDelivered = useCallback((orderId: number) => applyStatus(orderId, 'entregue'), [applyStatus]);
  const markPending = useCallback((orderId: number) => applyStatus(orderId, 'finalizado'), [applyStatus]);
  const markCancelled = useCallback((orderId: number) => applyStatus(orderId, 'cancelado'), [applyStatus]);

  return {
    orders, stats, analytics,
    loading, refreshing, error,
    statusFilter, setStatusFilter,
    load, onRefresh,
    markDelivered, markPending, markCancelled,
  };
}
