import { useState, useEffect } from 'react';
import { fetchPlayerData } from '../api/playerService';
import { Player } from '../types';

const playerCoinsListeners = new Set<(coins: number) => void>();

export function notifyPlayerCoinsUpdate(coins: number): void {
  playerCoinsListeners.forEach((fn) => fn(coins));
}

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

  useEffect(() => {
    const listener = (coins: number) => {
      setPlayer((prev) => (prev ? { ...prev, coins } : prev));
    };
    playerCoinsListeners.add(listener);
    return () => { playerCoinsListeners.delete(listener); };
  }, []);

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