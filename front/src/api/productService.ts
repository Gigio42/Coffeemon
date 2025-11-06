import { getServerUrl } from '../utils/config';
import { Product } from '../types';

interface ProductsResponse {
  products?: Product[];
  message?: string;
}

/**
 * Busca todos os produtos disponíveis na loja
 * @returns Promise com array de produtos
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const serverUrl = await getServerUrl();
    const response = await fetch(`${serverUrl}/products`);

    if (!response.ok) {
      throw new Error(`Erro ao carregar produtos: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    
    if (data.products && Array.isArray(data.products)) {
      return data.products;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

/**
 * Busca um produto específico por ID
 * @param id - ID do produto
 * @param token - Token de autenticação (opcional)
 * @returns Promise com o produto
 */
export async function fetchProductById(id: number, token?: string): Promise<Product> {
  try {
    const serverUrl = await getServerUrl();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${serverUrl}/products/${id}`, { headers });

    if (!response.ok) {
      throw new Error(`Erro ao carregar produto: ${response.status}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
}
