import { getServerUrl } from '../utils/config';
import { Order } from '../types';

/**
 * Busca o histórico de pedidos do usuário
 */
export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar pedidos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
}

/**
 * Finaliza a compra (checkout) - alias para o cartService
 */
export async function createOrder(token: string): Promise<void> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/orders`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao criar pedido');
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}
