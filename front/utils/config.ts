import Constants from 'expo-constants';

// Detecta automaticamente o IP do servidor
export const getServerUrl = () => {
  if (__DEV__) {
    // Em desenvolvimento, usa o IP do Metro/Expo
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
    return debuggerHost ? `http://${debuggerHost}:3000` : 'http://localhost:3000';
  }
  // Em produção, usar um domínio ou IP específico
  return 'http://your-production-server.com:3000';
};

export const SOCKET_URL = getServerUrl();
export const BASE_IMAGE_URL = 'https://gigio42.github.io/Coffeemon/';
