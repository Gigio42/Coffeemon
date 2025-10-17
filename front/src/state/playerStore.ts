import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Player, PlayerCoffeemons } from '../types';

/**
 * ========================================
 * PLAYER STORE - ZUSTAND
 * ========================================
 * 
 * Gerencia estado do jogador (perfil, coffeemons, party)
 * Persiste dados do jogador no AsyncStorage
 */

interface PlayerState {
  // Estado
  player: Player | null;
  coffeemons: PlayerCoffeemons[];
  party: PlayerCoffeemons[];
  isLoading: boolean;
  
  // Ações
  setPlayer: (player: Player) => void;
  setCoffeemons: (coffeemons: PlayerCoffeemons[]) => void;
  updateCoffeemon: (id: number, updates: Partial<PlayerCoffeemons>) => void;
  addCoffeemonToParty: (coffeemon: PlayerCoffeemons) => void;
  removeCoffeemonFromParty: (id: number) => void;
  updatePlayerCoins: (coins: number) => void;
  updatePlayerLevel: (level: number, experience: number) => void;
  setLoading: (isLoading: boolean) => void;
  clearPlayer: () => void;
  
  // Getters
  getPartyCount: () => number;
  canAddToParty: () => boolean;
  getCoffeemonById: (id: number) => PlayerCoffeemons | undefined;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // ========================================
      // ESTADO INICIAL
      // ========================================
      player: null,
      coffeemons: [],
      party: [],
      isLoading: false,
      
      // ========================================
      // AÇÕES
      // ========================================
      
      /**
       * Define dados do jogador
       */
      setPlayer: (player: Player) => {
        set({ player });
      },
      
      /**
       * Define lista de coffeemons
       */
      setCoffeemons: (coffeemons: PlayerCoffeemons[]) => {
        const party = coffeemons.filter(c => c.isInParty);
        set({ coffeemons, party });
      },
      
      /**
       * Atualiza um coffeemon específico
       */
      updateCoffeemon: (id: number, updates: Partial<PlayerCoffeemons>) => {
        set(state => {
          const updatedCoffeemons = state.coffeemons.map(c =>
            c.id === id ? { ...c, ...updates } : c
          );
          const party = updatedCoffeemons.filter(c => c.isInParty);
          return { coffeemons: updatedCoffeemons, party };
        });
      },
      
      /**
       * Adiciona coffeemon ao party
       */
      addCoffeemonToParty: (coffeemon: PlayerCoffeemons) => {
        set(state => {
          if (state.party.length >= 3) {
            console.warn('Party já está cheio (máximo 3)');
            return state;
          }
          
          const updatedCoffeemons = state.coffeemons.map(c =>
            c.id === coffeemon.id ? { ...c, isInParty: true } : c
          );
          const party = updatedCoffeemons.filter(c => c.isInParty);
          return { coffeemons: updatedCoffeemons, party };
        });
      },
      
      /**
       * Remove coffeemon do party
       */
      removeCoffeemonFromParty: (id: number) => {
        set(state => {
          const updatedCoffeemons = state.coffeemons.map(c =>
            c.id === id ? { ...c, isInParty: false } : c
          );
          const party = updatedCoffeemons.filter(c => c.isInParty);
          return { coffeemons: updatedCoffeemons, party };
        });
      },
      
      /**
       * Atualiza moedas do jogador
       */
      updatePlayerCoins: (coins: number) => {
        set(state => ({
          player: state.player ? { ...state.player, coins } : null,
        }));
      },
      
      /**
       * Atualiza nível e experiência do jogador
       */
      updatePlayerLevel: (level: number, experience: number) => {
        set(state => ({
          player: state.player ? { ...state.player, level, experience } : null,
        }));
      },
      
      /**
       * Define estado de loading
       */
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
      
      /**
       * Limpa todos os dados do jogador
       */
      clearPlayer: () => {
        set({
          player: null,
          coffeemons: [],
          party: [],
          isLoading: false,
        });
      },
      
      // ========================================
      // GETTERS
      // ========================================
      
      /**
       * Retorna quantidade de coffeemons no party
       */
      getPartyCount: () => {
        return get().party.length;
      },
      
      /**
       * Verifica se pode adicionar mais coffeemons ao party
       */
      canAddToParty: () => {
        return get().party.length < 3;
      },
      
      /**
       * Busca coffeemon por ID
       */
      getCoffeemonById: (id: number) => {
        return get().coffeemons.find(c => c.id === id);
      },
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
