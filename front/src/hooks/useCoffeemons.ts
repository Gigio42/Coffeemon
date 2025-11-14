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
  giveAllCoffeemons: () => Promise<void>;
  initialized: boolean;
}

export function useCoffeemons({
  token,
  onLog,
}: UseCoffeemonsProps): UseCoffeemonsResult {
  const [coffeemons, setCoffeemons] = useState<PlayerCoffeemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [partyLoading, setPartyLoading] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    initializePlayer();
  }, []);

  async function initializePlayer() {
    try {
      const playerData = await coffeemonService.fetchPlayerData(token);
      console.log('Player initialized with ID:', playerData?.id);
      setPlayerId(playerData.id);
      await fetchCoffeemons(playerData.id);
    } catch (error: any) {
      console.error('Error initializing player:', error);
      if (onLog) {
        onLog('Erro ao inicializar jogador');
      }
      setInitialized(true);
    }
  }

  async function fetchCoffeemons(playerIdParam?: number) {
    const idToUse = playerIdParam || playerId;
    if (!idToUse) {
      console.error('No player ID available');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching coffeemons for player:', idToUse);
      const data = await coffeemonService.fetchPlayerCoffeemons(token, idToUse);
      console.log(`Loaded ${data.length} coffeemons for player ${idToUse}`);
      setCoffeemons(data);

      if (onLog) {
        onLog(`${data.length} Coffeemons disponíveis`);
      }
      
      // Se não tem coffeemons, sugerir dar todos
      if (data.length === 0) {
        console.log('No coffeemons found.');
        if (onLog) {
          onLog('Nenhum Coffeemon encontrado. Use o botão para capturar todos.');
        }
      }
    } catch (error: any) {
      console.error('Error fetching coffeemons:', error);
      if (onLog) {
        onLog('Erro ao carregar Coffeemons');
      }
    } finally {
      setLoading(false);
      setInitialized(true);
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
      Alert.alert('Erro', error.message || 'Erro ao alterar time');
    } finally {
      setPartyLoading(null);
    }
  }

  async function giveAllCoffeemons() {
    if (!playerId) {
      console.error('No player ID available for giving coffeemons');
      Alert.alert('Erro', 'ID do jogador não disponível. Tente novamente.');
      return;
    }

    setLoading(true);
    try {
      console.log('Giving all coffeemons to player...');
      const result = await coffeemonService.giveAllCoffeemons(token);
      console.log(`Coffeemons grant result: ${result.count ?? 0}`);
      
      if (onLog) {
        onLog(result.message || `${result.count} Coffeemons capturados!`);
      }
      
      if (result.count > 0) {
        Alert.alert('Sucesso!', result.message || `${result.count} Coffeemons capturados!`);
      } else {
        Alert.alert('Informação', 'Você já possui todos os Coffeemons!');
      }
      
      // Recarregar coffeemons com o playerId
      await fetchCoffeemons(playerId);
    } catch (error: any) {
      console.error('Error giving all coffeemons:', error);
      const errorMessage = error.message || 'Erro ao capturar Coffeemons';
      Alert.alert('Erro', errorMessage);
      if (onLog) {
        onLog(`Erro: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
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
    fetchCoffeemons: () => fetchCoffeemons(),
    toggleParty,
    giveAllCoffeemons,
    initialized,
  };
}
