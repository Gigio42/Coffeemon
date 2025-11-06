import { getServerUrl } from '../utils/config';
import { CartItem } from '../types';

/**
 * Busca o carrinho do usuário
 */
export async function fetchCart(token: string): Promise<CartItem[]> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/shopping-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar carrinho');
    }

    const data = await response.json();

    if (typeof data === 'string') {
      return [];
    }

    if (Array.isArray(data)) {
      const items: CartItem[] = [];
      data.forEach((order: any) => {
        if (order.orderItem && Array.isArray(order.orderItem)) {
          order.orderItem.forEach((item: any) => {
            items.push({
              product: {
                id: item.product.id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                image: item.product.image,
              },
              quantity: item.quantity,
            });
          });
        }
      });
      return items;
    }

    return [];
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    throw error;
  }
}

/**
 * Adiciona um produto ao carrinho
 */
export async function addToCart(
  token: string,
  productId: number,
  quantity: number
): Promise<void> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/shopping-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.message && responseData.message.includes('Usuário com ID')) {
        throw new Error('Sessão expirada ou inválida. Por favor, faça logout e login novamente.');
      }
      throw new Error(responseData.message || 'Erro ao adicionar ao carrinho');
    }
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    throw error;
  }
}

/**
 * Atualiza a quantidade de um produto no carrinho
 */
export async function updateCartItem(
  token: string,
  productId: number,
  quantity: number
): Promise<void> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/shopping-cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar quantidade');
    }
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    throw error;
  }
}

/**
 * Remove um produto do carrinho
 */
export async function removeFromCart(token: string, productId: number): Promise<void> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/shopping-cart/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao remover item');
    }
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    throw error;
  }
}

/**
 * Finaliza a compra (checkout)
 */
export async function checkout(token: string): Promise<void> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/orders`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao finalizar compra');
    }
  } catch (error) {
    console.error('Erro ao finalizar compra:', error);
    throw error;
  }
}
