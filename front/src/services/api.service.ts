import { getServerUrl } from '../utils/config';
import { useAuthStore } from '../state';

/**
 * ========================================
 * API SERVICE
 * ========================================
 * 
 * Serviço centralizado para chamadas HTTP
 * Gerencia autenticação, headers e tratamento de erros
 */

class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = getServerUrl();
  }
  
  /**
   * Retorna headers padrão com autenticação
   */
  private getHeaders(): HeadersInit {
    const authHeader = useAuthStore.getState().getAuthHeader();
    return {
      'Content-Type': 'application/json',
      ...(authHeader && { 'Authorization': authHeader }),
    };
  }
  
  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Exporta instância singleton
export const apiService = new ApiService();
