import { getServerUrl } from '../utils/config';

export interface PlayerCoffeemon {
  id: number;
  hp: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  isInParty: boolean;
  coffeemon: {
    id: number;
    name: string;
    type: string;
    imageUrl?: string;
  };
}

/**
 * Busca dados do jogador
 */
export async function fetchPlayerData(token: string): Promise<any> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/players/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar dados do jogador');
  }

  return await response.json();
}

/**
 * Busca todos os Coffeemons de um jogador
 */
export async function fetchPlayerCoffeemons(
  token: string,
  playerId: number
): Promise<PlayerCoffeemon[]> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/players/${playerId}/coffeemons`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar Coffeemons');
  }

  return await response.json();
}

/**
 * Adiciona um Coffeemon ao time do jogador
 */
export async function addToParty(
  token: string,
  playerCoffeemonId: number
): Promise<void> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/players/me/party`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerCoffeemonId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao adicionar ao time');
  }
}

/**
 * Remove um Coffeemon do time do jogador
 */
export async function removeFromParty(
  token: string,
  playerCoffeemonId: number
): Promise<void> {
  const url = await getServerUrl();
  const response = await fetch(
    `${url}/game/players/me/party/remove/${playerCoffeemonId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao remover do time');
  }
}

/**
 * Dá todos os Coffeemons disponíveis para o jogador atual
 */
export async function giveAllCoffeemons(token: string): Promise<{ message: string; count: number }> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/players/me/coffeemons/give-all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao dar Coffeemons');
  }

  return await response.json();
}

