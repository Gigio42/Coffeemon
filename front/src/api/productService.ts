import { getServerUrl } from '../utils/config';
import { Product } from '../types';

interface ProductsResponse {
  products?: Product[];
  message?: string;
}

let productsCache: Product[] | null = null;
let productsCacheAt = 0;
const PRODUCTS_CACHE_TTL_MS = 60_000;
const PRODUCTS_REQUEST_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PRODUCTS_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Servidor demorou para responder (timeout)');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Busca todos os produtos disponíveis na loja
 * @returns Promise com array de produtos
 */
export async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  try {
    const now = Date.now();
    if (
      !forceRefresh &&
      productsCache &&
      now - productsCacheAt < PRODUCTS_CACHE_TTL_MS
    ) {
      return productsCache;
    }

    const serverUrl = await getServerUrl();
    const response = await fetchWithTimeout(`${serverUrl}/products`);

    if (!response.ok) {
      throw new Error(`Erro ao carregar produtos: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    
    if (data.products && Array.isArray(data.products)) {
      const buildImageUrl = (imagePath?: string): string => {
        if (!imagePath) return '';
        return /^https?:\/\//i.test(imagePath)
          ? imagePath
          : `${serverUrl}/${imagePath.replace(/^\/+/, '')}`;
      };

      // Adiciona a URL completa apenas quando necessário
      const mappedProducts = data.products.map(product => ({
        ...product,
        image: buildImageUrl(product.image)
      }));
      productsCache = mappedProducts;
      productsCacheAt = now;
      return mappedProducts;
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

    const response = await fetchWithTimeout(`${serverUrl}/products/${id}`, { headers });

    if (!response.ok) {
      throw new Error(`Erro ao carregar produto: ${response.status}`);
    }

    const product: Product = await response.json();
    
    const buildImageUrl = (imagePath?: string): string => {
      if (!imagePath) return '';
      return /^https?:\/\//i.test(imagePath)
        ? imagePath
        : `${serverUrl}/${imagePath.replace(/^\/+/, '')}`;
    };

    // Adiciona a URL completa apenas quando necessário
    return {
      ...product,
      image: buildImageUrl(product.image)
    };
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
}
