import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../state';
import { apiService } from '../../../services/api.service';
import { AuthResponse, User } from '../../../types';

/**
 * ========================================
 * USE AUTH HOOK
 * ========================================
 * 
 * Hook customizado para gerenciar autenticação
 * Encapsula lógica de login, logout e validação
 */

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user, login: storeLogin, logout: storeLogout } = useAuthStore();
  
  /**
   * Login: Autentica usuário e busca dados do player
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Autentica e recebe token
      const authResponse = await apiService.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      // 2. Busca dados do usuário (precisa do token)
      const tempToken = authResponse.access_token;
      
      // Temporariamente salva o token para fazer a próxima requisição
      await storeLogin(
        { token: tempToken, userId: 0, playerId: 0 },
        { id: 0, username: '', email, role: 'user' as any }
      );
      
      // 3. Busca dados do player
      const playerResponse = await apiService.get<any>('/game/players/me');
      
      // 4. Salva dados completos
      await storeLogin(
        {
          token: tempToken,
          userId: playerResponse.user?.id || 0,
          playerId: playerResponse.id,
        },
        {
          id: playerResponse.user?.id || 0,
          username: playerResponse.user?.username || email,
          email,
          role: playerResponse.user?.role || 'user',
        }
      );
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer login';
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert('Erro', errorMessage);
      return false;
    }
  }, [storeLogin]);
  
  /**
   * Logout: Limpa dados de autenticação
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await storeLogout();
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [storeLogout]);
  
  return {
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    user,
  };
};
