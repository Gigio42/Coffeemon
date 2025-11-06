import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../../hooks/useUser';
import { styles } from './styles';

interface ProfileScreenProps {
  token: string;
  userId: number;
  onLogout: () => void;
  onNavigateToGame: () => void;
  onBack: () => void;
}

export default function ProfileScreen({
  token,
  userId,
  onLogout,
  onNavigateToGame,
  onBack,
}: ProfileScreenProps) {
  const { user, loading, error, refetch } = useUser(token);

  const handleLogout = async () => {
    console.log('🚪 Fazendo logout...');
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage limpo, redirecionando...');
    onLogout();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!user || error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Erro ao carregar perfil</Text>
          <Text style={styles.errorSubtext}>Não foi possível carregar seus dados</Text>

          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>🔄 Tentar Novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={async () => {
              await AsyncStorage.clear();
              onLogout();
            }}
          >
            <Text style={styles.loginButtonText}>🔐 Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👤 Perfil</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>👑 Admin</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>#{user.id}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome de usuário:</Text>
              <Text style={styles.infoValue}>{user.username}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo de conta:</Text>
              <Text style={styles.infoValue}>
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>

          <TouchableOpacity style={styles.actionButton} onPress={onNavigateToGame}>
            <Text style={styles.actionButtonIcon}>🎮</Text>
            <Text style={styles.actionButtonText}>Jogar Coffeemon</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.actionButtonIcon}>🚪</Text>
            <Text style={styles.actionButtonText}>Sair da Conta</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Coffeemon v1.0</Text>
          <Text style={styles.footerText}>E-commerce & Game</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
