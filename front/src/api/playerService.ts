import { getServerUrl } from '../utils/config';
import { Player } from '../types';

/**
 * Busca os dados do player atual
 */
export async function fetchPlayerData(token: string): Promise<Player> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/game/players/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar dados do player');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do player:', error);
    throw error;
  }
}