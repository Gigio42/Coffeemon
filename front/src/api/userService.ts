import { getServerUrl } from '../utils/config';
import { User } from '../types';

/**
 * Busca os dados do usuário atual
 */
export async function fetchUserProfile(token: string): Promise<User> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar dados do usuário');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
}
