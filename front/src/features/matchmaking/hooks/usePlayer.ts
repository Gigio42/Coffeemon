import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { usePlayerStore } from '../../../state';
import { apiService } from '../../../services/api.service';
import { Player, PlayerCoffeemons } from '../../../types';
import { BATTLE_CONFIG } from '../../../utils/config';

/**
 * ========================================
 * USE PLAYER HOOK
 * ========================================
 * 
 * Hook customizado para gerenciar dados do jogador
 * Busca coffeemons, gerencia party, atualiza stats
 */

interface UsePlayerReturn {
  // Estado
  player: Player | null;
  coffeemons: PlayerCoffeemons[];
  party: PlayerCoffeemons[];
  isLoading: boolean;
  error: string | null;
  
  // Ações
  fetchPlayer: () => Promise<void>;
  fetchCoffeemons: () => Promise<void>;
  addToParty: (coffeemonId: number) => Promise<boolean>;
  removeFromParty: (coffeemonId: number) => Promise<boolean>;
  addCoffeemonByQR: (coffeemonId: number) => Promise<boolean>;
  
  // Helpers
  canAddToParty: boolean;
  partyCount: number;
}

export const usePlayer = (): UsePlayerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    player,
    coffeemons,
    party,
    setPlayer,
    setCoffeemons,
    updateCoffeemon,
    getPartyCount,
    canAddToParty: storeCanAddToParty,
  } = usePlayerStore();
  
  /**
   * Busca dados do jogador
   */
  const fetchPlayer = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const playerData = await apiService.get<Player>('/game/players/me');
      setPlayer(playerData);
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar dados do jogador';
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert('Erro', errorMessage);
    }
  }, [setPlayer]);
  
  /**
   * Busca coffeemons do jogador
   */
  const fetchCoffeemons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Busca player primeiro para pegar o ID
      const playerData = await apiService.get<Player>('/game/players/me');
      
      // Busca coffeemons do player
      const coffeemonsData = await apiService.get<PlayerCoffeemons[]>(
        `/game/players/${playerData.id}/coffeemons`
      );
      
      setCoffeemons(coffeemonsData);
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar coffeemons';
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert('Erro', errorMessage);
    }
  }, [setCoffeemons]);
  
  /**
   * Adiciona coffeemon ao party
   */
  const addToParty = useCallback(async (coffeemonId: number): Promise<boolean> => {
    if (!storeCanAddToParty()) {
      Alert.alert('Party Cheio', `Você só pode ter ${BATTLE_CONFIG.MAX_PARTY_SIZE} Coffeemons no party.`);
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.put('/game/players/me/party', {
        playerCoffeemonId: coffeemonId,
      });
      
      // Atualiza localmente
      updateCoffeemon(coffeemonId, { isInParty: true });
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao adicionar ao party';
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert('Erro', errorMessage);
      return false;
    }
  }, [storeCanAddToParty, updateCoffeemon]);
  
  /**
   * Remove coffeemon do party
   */
  const removeFromParty = useCallback(async (coffeemonId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.put(`/game/players/me/party/remove/${coffeemonId}`, {});
      
      // Atualiza localmente
      updateCoffeemon(coffeemonId, { isInParty: false });
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao remover do party';
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert('Erro', errorMessage);
      return false;
    }
  }, [updateCoffeemon]);
  
  /**
   * Adiciona coffeemon via QR Code
   */
  const addCoffeemonByQR = useCallback(async (coffeemonId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.post(`/game/players/me/coffeemons/${coffeemonId}`, {});
      
      // Recarrega lista de coffeemons
      await fetchCoffeemons();
      
      setIsLoading(false);
      Alert.alert('Sucesso', 'Coffeemon adicionado com sucesso!');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao adicionar coffeemon';
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert('Erro', errorMessage);
      return false;
    }
  }, [fetchCoffeemons]);
  
  /**
   * Auto-fetch ao montar
   */
  useEffect(() => {
    if (!player) {
      fetchPlayer();
    }
    if (coffeemons.length === 0) {
      fetchCoffeemons();
    }
  }, []);
  
  return {
    // Estado
    player,
    coffeemons,
    party,
    isLoading,
    error,
    
    // Ações
    fetchPlayer,
    fetchCoffeemons,
    addToParty,
    removeFromParty,
    addCoffeemonByQR,
    
    // Helpers
    canAddToParty: storeCanAddToParty(),
    partyCount: getPartyCount(),
  };
};
