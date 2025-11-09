import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl } from '../utils/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  success?: boolean;
  message?: string;
}

export interface UserData {
  id: number;
  email: string;
  username?: string;
}

export interface PlayerData {
  id: number;
  userId: number;
}

/**
 * Realiza login no servidor
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error(data.message || 'Falha no login');
  }

  return data;
}

/**
 * Realiza registro no servidor
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!data.success || !data.access_token) {
    throw new Error(data.message || 'Falha no registro');
  }

  return data;
}

/**
 * Busca dados do usuário autenticado
 */
export async function fetchUserData(token: string): Promise<UserData> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar dados do usuário.');
  }

  return await response.json();
}

/**
 * Busca dados do jogador
 */
export async function fetchPlayerData(token: string): Promise<PlayerData> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/players/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Perfil de jogador não encontrado para este usuário.');
  }

  return await response.json();
}

/**
 * Cria perfil de jogador
 */
export async function createPlayerProfile(token: string): Promise<PlayerData> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/players`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar perfil de jogador.');
  }

  return await response.json();
}

/**
 * Salva token de autenticação no AsyncStorage
 */
export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem('jwt_token', token);
}

/**
 * Salva ID do usuário no AsyncStorage
 */
export async function saveUserId(userId: number): Promise<void> {
  await AsyncStorage.setItem('user_id', userId.toString());
}

/**
 * Salva ID do jogador no AsyncStorage
 */
export async function savePlayerId(playerId: number): Promise<void> {
  await AsyncStorage.setItem('player_id', playerId.toString());
}

/**
 * Busca token armazenado
 */
export async function getStoredToken(): Promise<string | null> {
  return await AsyncStorage.getItem('jwt_token');
}

/**
 * Busca ID do jogador armazenado
 */
export async function getStoredPlayerId(): Promise<string | null> {
  return await AsyncStorage.getItem('player_id');
}

/**
 * Busca ID do usuário armazenado
 */
export async function getStoredUserId(): Promise<string | null> {
  return await AsyncStorage.getItem('user_id');
}

/**
 * Limpa dados de autenticação
 */
export async function clearAuthData(): Promise<void> {
  await AsyncStorage.clear();
}
