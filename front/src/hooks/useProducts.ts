import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/productService';
import { Product } from '../types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  refetch: () => void;
  onRefresh: () => void;
}

/**
 * Hook para gerenciar produtos da loja
 * Busca produtos automaticamente ao montar e fornece funções de refresh
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async (isRefreshing = false) => {
    try {
      setError('');
      if (!isRefreshing) {
        setLoading(true);
      }
      
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const refetch = () => {
    loadProducts();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts(true);
  };

  return {
    products,
    loading,
    refreshing,
    error,
    refetch,
    onRefresh,
  };
}
