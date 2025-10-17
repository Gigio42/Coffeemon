import Constants from 'expo-constants';

/**
 * ========================================
 * CONFIGURAÇÕES GLOBAIS
 * ========================================
 */

// Detecta automaticamente o IP do servidor
export const getServerUrl = (): string => {
  if (__DEV__) {
    // Em desenvolvimento, usa o IP do Metro/Expo
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
    return debuggerHost ? `http://${debuggerHost}:3000` : 'http://localhost:3000';
  }
  // Em produção, usar um domínio ou IP específico
  return 'http://your-production-server.com:3000';
};

export const SOCKET_URL = getServerUrl();

// URL base para sprites dos Coffeemons (hospedadas no GitHub Pages)
export const BASE_IMAGE_URL = 'https://gigio42.github.io/Coffeemon/';

/**
 * Padrão de sprites:
 * - ${BASE_IMAGE_URL}${coffeemonName}/default.png (frente)
 * - ${BASE_IMAGE_URL}${coffeemonName}/back.png (costas)
 * - ${BASE_IMAGE_URL}${coffeemonName}/hurt.png (dano)
 */
export const getSpriteUrl = (coffeemonName: string, variant: 'default' | 'back' | 'hurt' = 'default'): string => {
  return `${BASE_IMAGE_URL}${coffeemonName}/${variant}.png`;
};

// Configurações de batalha
export const BATTLE_CONFIG = {
  MAX_PARTY_SIZE: 3,
  DAMAGE_ANIMATION_DURATION: 500, // ms
  BATTLE_END_DELAY: 3000, // ms
  RECONNECTION_TIMEOUT: 30000, // ms
};

// Configurações de API
export const API_CONFIG = {
  TIMEOUT: 10000, // ms
  RETRY_ATTEMPTS: 3,
};
