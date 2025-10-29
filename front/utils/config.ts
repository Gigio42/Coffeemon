import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL_KEY = "saved_server_url";

function getDefaultDevUrl(): string {
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
    return debuggerHost
      ? `http://${debuggerHost}:3000`
      : "http://localhost:3000";
  }
  // URL de produção
  return "http://your-production-server.com:3000";
}

export async function setServerUrl(url: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SERVER_URL_KEY, url);
  } catch (e) {
    console.error("Falha ao salvar URL do servidor", e);
  }
}

export async function getServerUrl(): Promise<string> {
  try {
    const savedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
    if (savedUrl) {
      return savedUrl;
    }
    return getDefaultDevUrl();
  } catch (e) {
    return getDefaultDevUrl();
  }
}

export const BASE_IMAGE_URL = "https://gigio42.github.io/Coffeemon/";
