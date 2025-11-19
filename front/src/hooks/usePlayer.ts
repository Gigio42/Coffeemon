import { useState, useEffect } from 'react';
import { fetchPlayerData } from '../api/playerService';
import { Player } from '../types';

interface UsePlayerReturn {
  player: Player | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export function usePlayer(token: string): UsePlayerReturn {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPlayer = async () => {
    try {
      setError(false);
      const data = await fetchPlayerData(token);
      setPlayer(data);
    } catch (err) {
      console.error('Erro ao buscar player:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadPlayer();
    }
  }, [token]);

  const refetch = () => {
    setLoading(true);
    loadPlayer();
  };

  return {
    player,
    loading,
    error,
    refetch,
  };
}