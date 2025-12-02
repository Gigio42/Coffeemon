import { getServerUrl } from '../utils/config';

export interface GachaPack {
  id: string;
  name: string;
  description: string;
  cost: number;
  notes: string[]; // Coffeemon types that can be obtained
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effects: Array<{
    type: string;
    value: number;
  }>;
}

/**
 * Fetch all available gacha packs from the shop
 */
export async function fetchGachaPacks(token: string): Promise<GachaPack[]> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/shop/packs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar pacotes gacha');
  }

  return await response.json();
}

/**
 * Purchase a gacha pack
 */
export async function buyGachaPack(token: string, packId: string): Promise<any> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/shop/buy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: packId,
      productType: 'GACHA',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro ao comprar pacote gacha');
  }

  return await response.json();
}

/**
 * Purchase a shop item
 */
export async function buyItem(token: string, itemId: string): Promise<any> {
  const url = await getServerUrl();
  const response = await fetch(`${url}/game/shop/buy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: itemId,
      productType: 'ITEM',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro ao comprar item');
  }

  return await response.json();
}
