import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as coffeemonService from '../api/coffeemonService';
import { PlayerCoffeemon } from '../api/coffeemonService';

type PartySyncEvent =
  | { type: 'toggle'; coffeemonId: number; isInParty: boolean }
  | { type: 'swap'; addId: number; removeId: number };

const partySyncListeners = new Set<(event: PartySyncEvent) => void>();

interface UseCoffeemonsProps {
  token: string;
  playerId?: number;
  onLog?: (message: string) => void;
}

interface UseCoffeemonsResult {
  coffeemons: PlayerCoffeemon[];
  loading: boolean;
  partyLoading: number | null;
  partyMembers: PlayerCoffeemon[];
  availableCoffeemons: PlayerCoffeemon[];
  fetchCoffeemons: (force?: boolean) => Promise<void>;
  toggleParty: (coffeemon: PlayerCoffeemon) => Promise<boolean | void>;
  swapPartyMembers: (newMember: PlayerCoffeemon, oldMember: PlayerCoffeemon) => Promise<boolean>;
  giveAllCoffeemons: () => Promise<void>;
  addMissingMoves: () => Promise<void>;
  initialized: boolean;
}

export function useCoffeemons({
  token,
  playerId: initialPlayerId,
  onLog,
}: UseCoffeemonsProps): UseCoffeemonsResult {
  const [coffeemons, setCoffeemons] = useState<PlayerCoffeemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [partyLoading, setPartyLoading] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(initialPlayerId ?? null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const lastFetchAt = useRef<number>(0);
  const FETCH_THROTTLE_MS = 30_000;

  useEffect(() => {
    const listener = (event: PartySyncEvent) => {
      setCoffeemons((prev) =>
        prev.map((coffeemon) => {
          if (event.type === 'toggle' && coffeemon.id === event.coffeemonId) {
            return { ...coffeemon, isInParty: event.isInParty };
          }
          if (event.type === 'swap') {
            if (coffeemon.id === event.addId) return { ...coffeemon, isInParty: true };
            if (coffeemon.id === event.removeId) return { ...coffeemon, isInParty: false };
          }
          return coffeemon;
        })
      );
    };

    partySyncListeners.add(listener);
    return () => {
      partySyncListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    initializePlayer();
  }, []);

  async function initializePlayer() {
    try {
      // Se playerId já foi fornecido, pula o fetchPlayerData
      let id = initialPlayerId;
      if (!id) {
        const playerData = await coffeemonService.fetchPlayerData(token);
        id = playerData.id;
      }
      if (!id) {
        throw new Error('Player ID inválido');
      }
      setPlayerId(id);
      await fetchCoffeemons(id);
    } catch (error: any) {
      console.error('Error initializing player:', error);
      if (onLog) {
        onLog('Erro ao inicializar jogador');
      }
      setInitialized(true);
    }
  }

  async function fetchCoffeemons(playerIdParam?: number, force = false) {
    const idToUse = playerIdParam || playerId;
    if (!idToUse) {
      console.error('No player ID available');
      return;
    }

    if (!force && Date.now() - lastFetchAt.current < FETCH_THROTTLE_MS) return;

    setLoading(true);
    try {
      const data = await coffeemonService.fetchPlayerCoffeemons(token, idToUse);
      setCoffeemons(data);

      if (onLog) {
        onLog(`${data.length} Coffeemons disponíveis`);
      }
      
      // Se não tem coffeemons, sugerir dar todos
      if (data.length === 0) {
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
      lastFetchAt.current = Date.now();
      setInitialized(true);
    }
  }

  async function toggleParty(coffeemon: PlayerCoffeemon) {
    const partyCount = coffeemons.filter((c) => c.isInParty).length;

    if (!coffeemon.isInParty && partyCount >= 3) {
      // Alert.alert('Limite atingido', 'Você só pode ter 3 Coffeemons no time!');
      // Return false to indicate failure/need for swap
      return false;
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
      lastFetchAt.current = 0; // invalida cache para forçar próximo fetch
      partySyncListeners.forEach((listener) =>
        listener({ type: 'toggle', coffeemonId: coffeemon.id, isInParty: !coffeemon.isInParty })
      );

      if (onLog) {
        onLog(
          `${coffeemon.coffeemon.name} ${
            !coffeemon.isInParty ? 'adicionado ao' : 'removido do'
          } time`
        );
      }
      return true;
    } catch (error: any) {
      console.error('Error toggling party:', error);
      Alert.alert('Erro', error.message || 'Erro ao alterar time');
      return false;
    } finally {
      setPartyLoading(null);
    }
  }

  async function swapPartyMembers(newMember: PlayerCoffeemon, oldMember: PlayerCoffeemon) {
    setPartyLoading(newMember.id);
    try {
      // 1. Remove old member
      await coffeemonService.removeFromParty(token, oldMember.id);
      
      // 2. Add new member
      await coffeemonService.addToParty(token, newMember.id);

      // 3. Update local state
      setCoffeemons((prev) =>
        prev.map((c) => {
          if (c.id === oldMember.id) return { ...c, isInParty: false };
          if (c.id === newMember.id) return { ...c, isInParty: true };
          return c;
        })
      );
      lastFetchAt.current = 0;
      partySyncListeners.forEach((listener) =>
        listener({ type: 'swap', addId: newMember.id, removeId: oldMember.id })
      );

      if (onLog) {
        onLog(`Trocou ${oldMember.coffeemon.name} por ${newMember.coffeemon.name}`);
      }
      return true;
    } catch (error: any) {
      console.error('Error swapping party members:', error);
      Alert.alert('Erro', 'Falha ao trocar membros do time.');
      // Refresh to ensure consistency
      if (playerId) await fetchCoffeemons(playerId, true);
      return false;
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
      const result = await coffeemonService.giveAllCoffeemons(token);
      
      if (onLog) {
        onLog(result.message || `${result.count} Coffeemons capturados!`);
      }
      
      if (result.count > 0) {
        Alert.alert('Sucesso!', result.message || `${result.count} Coffeemons capturados!`);
      } else {
        Alert.alert('Informação', 'Você já possui todos os Coffeemons!');
      }
      
      // Recarregar coffeemons com o playerId
      await fetchCoffeemons(playerId, true);
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

  async function addMissingMoves() {
    if (!playerId) {
      console.error('No player ID available');
      Alert.alert('Erro', 'ID do jogador não disponível. Tente novamente.');
      return;
    }

    setLoading(true);
    try {
      const result = await coffeemonService.addMissingMoves(token);
      
      if (onLog) {
        onLog(result.message || `${result.fixed} Coffeemons corrigidos!`);
      }
      
      Alert.alert('Sucesso!', result.message || `${result.fixed} Coffeemons tiveram moves adicionados!`);
      
      // Recarregar coffeemons
      await fetchCoffeemons(playerId, true);
    } catch (error: any) {
      console.error('Error adding missing moves:', error);
      const errorMessage = error.message || 'Erro ao adicionar moves';
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
    fetchCoffeemons: (force = false) => fetchCoffeemons(undefined, force),
    toggleParty,
    swapPartyMembers,
    giveAllCoffeemons,
    addMissingMoves,
    initialized,
  };
}
