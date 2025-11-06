import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as authService from '../api/authService';

interface UseAuthResult {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  message: string;
  isRegistering: boolean;
  setIsRegistering: (value: boolean) => void;
  handleLogin: () => Promise<void>;
  handleRegister: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearCache: () => Promise<void>;
}

interface UseAuthProps {
  onSuccess: (token: string, playerId: number, userId: number) => void;
}

export function useAuth({ onSuccess }: UseAuthProps): UseAuthResult {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      checkAuthStatus();
    }
  }, []);

  async function checkAuthStatus() {
    try {
      const storedToken = await authService.getStoredToken();
      const storedPlayerId = await authService.getStoredPlayerId();
      const storedUserId = await authService.getStoredUserId();

      if (storedToken && storedPlayerId && storedUserId) {
        onSuccess(storedToken, parseInt(storedPlayerId), parseInt(storedUserId));
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      await authService.clearAuthData();
    }
  }

  async function handleLogin() {
    // Validação de campos
    if (!email.trim() || !password.trim()) {
      setMessage('Erro: Preencha todos os campos');
      return;
    }

    try {
      setMessage('Fazendo login...');

      // ETAPA 1: Login
      const loginData = await authService.login({ email, password });
      const token = loginData.access_token;
      await authService.saveToken(token);

      setMessage('Usuário autenticado! Buscando dados do usuário...');

      // ETAPA 2: Buscar dados do usuário (User ID)
      const userData = await authService.fetchUserData(token);
      await authService.saveUserId(userData.id);

      setMessage('Buscando dados do jogador...');

      // ETAPA 3: Buscar dados do jogador (Player ID)
      const playerData = await authService.fetchPlayerData(token);
      await authService.savePlayerId(playerData.id);

      // ETAPA 4: Login bem-sucedido!
      setMessage('Login bem-sucedido! Bem-vindo!');
      setTimeout(() => onSuccess(token, playerData.id, userData.id), 1000);
    } catch (error: any) {
      console.error('Erro de login:', error);
      setMessage(`Erro: ${error.message || 'Falha na conexão com o servidor'}`);
      await authService.clearAuthData();
    }
  }

  async function handleRegister() {
    // Validação de campos
    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage('Erro: Preencha todos os campos');
      return;
    }

    if (password.length < 8) {
      setMessage('Erro: A senha deve ter pelo menos 8 caracteres');
      return;
    }

    try {
      setMessage('Criando conta...');

      // ETAPA 1: Registro
      const registerData = await authService.register({ username, email, password });
      const token = registerData.access_token;
      await authService.saveToken(token);

      setMessage('Conta criada! Buscando dados do usuário...');

      // ETAPA 2: Buscar dados do usuário (User ID)
      const userData = await authService.fetchUserData(token);
      await authService.saveUserId(userData.id);

      setMessage('Criando perfil de jogador...');

      // ETAPA 3: Criar perfil de jogador
      const playerData = await authService.createPlayerProfile(token);
      await authService.savePlayerId(playerData.id);

      // ETAPA 4: Registro bem-sucedido!
      setMessage(`Registro bem-sucedido! Bem-vindo, ${username}!`);
      setTimeout(() => onSuccess(token, playerData.id, userData.id), 1000);
    } catch (error: any) {
      console.error('Erro de registro:', error);
      setMessage(`Erro: ${error.message || 'Falha na conexão com o servidor'}`);
      await authService.clearAuthData();
    }
  }

  async function clearCache() {
    await authService.clearAuthData();
    setMessage('Cache limpo! Faça login novamente.');
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    message,
    isRegistering,
    setIsRegistering,
    handleLogin,
    handleRegister,
    checkAuthStatus,
    clearCache,
  };
}
