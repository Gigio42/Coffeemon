import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getServerUrl, setServerUrl } from "../utils/config";

interface LoginScreenProps {
  onNavigateToMatchmaking: (
    token: string,
    playerId: number,
    userId: number
  ) => void;
}

function ConfigModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      const loadUrl = async () => {
        const currentUrl = await getServerUrl();
        setUrlInput(currentUrl);
        setLoading(false);
      };
      loadUrl();
    }
  }, [visible]);

  const handleSave = async () => {
    if (!urlInput.trim()) {
      Alert.alert("Erro", "A URL não pode estar vazia.");
      return;
    }
    await setServerUrl(urlInput);
    Alert.alert("Sucesso", "Endereço do servidor salvo!");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Configurar Servidor</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#8B4513" />
          ) : (
            <TextInput
              style={styles.input} // Reutiliza o estilo de input
              placeholder="Endereço do Servidor"
              value={urlInput}
              onChangeText={setUrlInput}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- COMPONENTE PRINCIPAL DA TELA DE LOGIN ---
export default function LoginScreen({
  onNavigateToMatchmaking,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // --- NOVO: Estado para controlar o modal ---
  const [configVisible, setConfigVisible] = useState(false);

  useEffect(() => {
    // A lógica de carregar a URL foi movida para o Modal

    if (Platform.OS !== "web") {
      checkAuthStatus();
    }
  }, []);

  async function checkAuthStatus() {
    try {
      const storedToken = await AsyncStorage.getItem("jwt_token");
      const storedPlayerId = await AsyncStorage.getItem("player_id");
      const storedUserId = await AsyncStorage.getItem("user_id");

      if (storedToken && storedPlayerId && storedUserId) {
        onNavigateToMatchmaking(
          storedToken,
          parseInt(storedPlayerId),
          parseInt(storedUserId)
        );
      }
    } catch (error) {
      console.error("Erro ao verificar auth:", error);
      await AsyncStorage.clear();
    }
  }

  async function handleLogin() {
    // Validação de campos
    if (!email.trim() || !password.trim()) {
      setLoginMessage("Erro: Preencha todos os campos");
      return;
    }
    try {
      setLoginMessage("Fazendo login...");

      const url = await getServerUrl();
      console.log("Tentando conectar em:", `${url}/auth/login`);

      const loginResponse = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginData.access_token) {
        throw new Error(loginData.message || "Falha no login");
      }

      const token = loginData.access_token;
      await AsyncStorage.setItem("jwt_token", token);

      setLoginMessage("Usuário autenticado! Buscando dados do usuário...");

      // ETAPA 2: Buscar dados do usuário (User ID)
      const userResponse = await fetch(`${await getServerUrl()}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        throw new Error("Erro ao buscar dados do usuário.");
      }

      const userData = await userResponse.json();
      const userId = userData.id;
      await AsyncStorage.setItem("user_id", userId.toString());

      setLoginMessage("Buscando dados do jogador...");

      // ETAPA 3: Buscar dados do jogador (Player ID)
      const playerResponse = await fetch(
        `${await getServerUrl()}/game/players/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!playerResponse.ok) {
        throw new Error("Perfil de jogador não encontrado para este usuário.");
      }

      const playerData = await playerResponse.json();
      await AsyncStorage.setItem("player_id", playerData.id.toString());

      // ETAPA 4: Login bem-sucedido! Navegar para E-commerce
      setLoginMessage(`Login bem-sucedido! Bem-vindo!`);
      setTimeout(
        () => onNavigateToMatchmaking(token, playerData.id, userId),
        1000
      );
    } catch (error: any) {
      console.error("Erro de login:", error);
      setLoginMessage(
        `Erro: ${error.message || "Falha na conexão com o servidor"}`
      );
      await AsyncStorage.clear();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* --- NOVO: Botão de Configuração --- */}
      <TouchableOpacity
        style={styles.configButton}
        onPress={() => setConfigVisible(true)}
      >
        <Text style={styles.configButtonText}>⚙️</Text>
      </TouchableOpacity>

      {/* --- NOVO: Renderiza o Modal --- */}
      <ConfigModal
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
      />

      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Login</Text>

        {/* --- REMOVIDO: TextInput da URL --- */}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="emailInput"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="passwordInput"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          accessibilityLabel="loginButton"
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {loginMessage ? (
          <Text
            style={[
              styles.message,
              { color: loginMessage.includes("Erro") ? "red" : "green" },
            ]}
          >
            {loginMessage}
          </Text>
        ) : null}

        {/* Botão para limpar cache (útil na web) */}
        {Platform.OS === "web" && (
          <TouchableOpacity
            style={styles.clearCacheButton}
            onPress={async () => {
              await AsyncStorage.clear();
              setLoginMessage("Cache limpo! Faça login novamente.");
            }}
          >
            <Text style={styles.clearCacheText}>🗑️ Limpar Cache</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// --- ATUALIZADO: Adiciona estilos para o modal e botão ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f5ed",
    padding: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  loginButton: {
    width: "100%",
    maxWidth: 300,
    height: 50,
    backgroundColor: "#3498db",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
  clearCacheButton: {
    marginTop: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearCacheText: {
    color: "#999",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  configButton: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 10,
    zIndex: 10,
  },
  configButtonText: {
    fontSize: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
