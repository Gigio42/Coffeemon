import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as coffeemonService from '../api/coffeemonService';
import { PlayerCoffeemon } from '../api/coffeemonService';

interface UseCoffeemonsProps {
  token: string;
  onLog?: (message: string) => void;
}

interface UseCoffeemonsResult {
  coffeemons: PlayerCoffeemon[];
  loading: boolean;
  partyLoading: number | null;
  partyMembers: PlayerCoffeemon[];
  availableCoffeemons: PlayerCoffeemon[];
  fetchCoffeemons: () => Promise<void>;
  toggleParty: (coffeemon: PlayerCoffeemon) => Promise<void>;
}

export function useCoffeemons({
  token,
  onLog,
}: UseCoffeemonsProps): UseCoffeemonsResult {
  const [coffeemons, setCoffeemons] = useState<PlayerCoffeemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [partyLoading, setPartyLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchCoffeemons();
  }, []);

  async function fetchCoffeemons() {
    setLoading(true);
    try {
      // Primeiro busca o player
      const player = await coffeemonService.fetchPlayerData(token);
      console.log('Player data:', player);

      // Agora busca todos os coffeemons desse player
      const data = await coffeemonService.fetchPlayerCoffeemons(token, player.id);
      console.log('Coffeemons data:', data);
      setCoffeemons(data);

      if (onLog) {
        onLog(`${data.length} Coffeemons carregados`);
      }
    } catch (error: any) {
      console.error('Error fetching coffeemons:', error);
      if (onLog) {
        onLog('Erro de conexão ao carregar Coffeemons');
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleParty(coffeemon: PlayerCoffeemon) {
    const partyCount = coffeemons.filter((c) => c.isInParty).length;

    if (!coffeemon.isInParty && partyCount >= 3) {
      Alert.alert('Limite atingido', 'Você só pode ter 3 Coffeemons no time!');
      return;
    }

    setPartyLoading(coffeemon.id);

    try {
      if (coffeemon.isInParty) {
        // Remover do time
        await coffeemonService.removeFromParty(token, coffeemon.id);
      } else {
        // Adicionar ao time
        await coffeemonService.addToParty(token, coffeemon.id);
      }

      // Atualiza o estado local
      setCoffeemons((prev) =>
        prev.map((c) =>
          c.id === coffeemon.id ? { ...c, isInParty: !c.isInParty } : c
        )
      );

      if (onLog) {
        onLog(
          `${coffeemon.coffeemon.name} ${
            !coffeemon.isInParty ? 'adicionado ao' : 'removido do'
          } time`
        );
      }
    } catch (error: any) {
      console.error('Error toggling party:', error);
      Alert.alert('Erro', error.message || 'Erro de conexão ao alterar time');
    } finally {
      setPartyLoading(null);
    }
  }

  const partyMembers = coffeemons.filter((c) => c.isInParty);
  const availableCoffeemons = coffeemons.filter((c) => !c.isInParty);

  return {
    coffeemons,
    loading,
    partyLoading,
    partyMembers,
    availableCoffeemons,
    fetchCoffeemons,
    toggleParty,
  };
}
