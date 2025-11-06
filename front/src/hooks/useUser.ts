import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/userService';
import { User } from '../types';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export function useUser(token: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadUser = async () => {
    try {
      setError(false);
      const data = await fetchUserProfile(token);
      setUser(data);
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const refetch = () => {
    setLoading(true);
    loadUser();
  };

  return {
    user,
    loading,
    error,
    refetch,
  };
}
