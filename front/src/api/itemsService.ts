import { getServerUrl } from '../utils/config';

export interface ItemEffect {
  type: 'heal' | 'revive' | 'cure_status';
  value: number | string;
  target: 'coffeemon';
}

export interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  effects: ItemEffect[];
  quantity?: number; // Quantidade que o jogador possui
}

/**
 * Busca todos os itens disponíveis no jogo
 */
export const getItems = async (token: string): Promise<Item[]> => {
  try {
    const apiUrl = await getServerUrl();
    const response = await fetch(`${apiUrl}/game/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const items: Item[] = await response.json();
    return items;
  } catch (error) {
    console.error('[itemsService] Error fetching items:', error);
    throw error;
  }
};

/**
 * Busca os itens do jogador com as quantidades do inventário
 */
export const getPlayerItems = async (token: string): Promise<Item[]> => {
  try {
    const apiUrl = await getServerUrl();
    
    // Buscar todos os itens disponíveis
    const itemsResponse = await fetch(`${apiUrl}/game/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!itemsResponse.ok) {
      throw new Error(`Failed to fetch items: ${itemsResponse.statusText}`);
    }

    const allItems: Item[] = await itemsResponse.json();
    
    // Buscar dados do jogador (incluindo inventário)
    const playerResponse = await fetch(`${apiUrl}/game/players/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!playerResponse.ok) {
      throw new Error(`Failed to fetch player data: ${playerResponse.statusText}`);
    }

    const playerData = await playerResponse.json();
    const inventory = playerData.inventory || {};

    // Combinar itens com quantidades do inventário
    const playerItems = allItems
      .map(item => {
        const quantity = inventory[item.id] || 0;
        return {
          ...item,
          quantity,
        };
      });

    return playerItems;
  } catch (error) {
    console.error('[itemsService] Error fetching player items:', error);
    throw error;
  }
};

/**
 * Retorna o ícone apropriado para cada tipo de item
 */
export const getItemIcon = (itemId: string): string => {
  const iconMap: Record<string, string> = {
    small_potion: '🧪',
    revive_bean: '💚',
    antidote_espresso: '☕',
  };
  return iconMap[itemId] || '📦';
};

/**
 * Retorna a cor apropriada para cada tipo de efeito
 */
export const getItemColor = (effectType: string): string => {
  const colorMap: Record<string, string> = {
    heal: '#4CAF50',
    revive: '#9C27B0',
    cure_status: '#FF9800',
  };
  return colorMap[effectType] || '#757575';
};

/**
 * Dá itens iniciais ao player (debug/teste)
 */
export const giveInitialItems = async (token: string): Promise<{ message: string; inventory: any }> => {
  try {
    const apiUrl = await getServerUrl();
    const response = await fetch(`${apiUrl}/game/players/me/items/give-initial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to give items: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[itemsService] Error giving items:', error);
    throw error;
  }
};
