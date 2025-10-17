import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthData, User } from '../types';

/**
 * ========================================
 * AUTH STORE - ZUSTAND
 * ========================================
 * 
 * Gerencia estado de autenticação global
 * Persiste token e dados do usuário no AsyncStorage
 */

interface AuthState {
  // Estado
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  playerId: number | null;
  
  // Ações
  login: (authData: AuthData, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  
  // Helpers
  getAuthHeader: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ========================================
      // ESTADO INICIAL
      // ========================================
      isAuthenticated: false,
      token: null,
      user: null,
      playerId: null,
      
      // ========================================
      // AÇÕES
      // ========================================
      
      /**
       * Login: Salva token e dados do usuário
       */
      login: async (authData: AuthData, user: User) => {
        set({
          isAuthenticated: true,
          token: authData.token,
          user,
          playerId: authData.playerId,
        });
      },
      
      /**
       * Logout: Limpa todos os dados de autenticação
       */
      logout: async () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          playerId: null,
        });
      },
      
      /**
       * Atualiza dados do usuário
       */
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
      
      /**
       * Retorna header de autorização formatado
       */
      getAuthHeader: () => {
        const token = get().token;
        return token ? `Bearer ${token}` : '';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
