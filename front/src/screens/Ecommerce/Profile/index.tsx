import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../../hooks/useUser';
import { styles } from './styles';
import { pixelArt } from '../../../theme';

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
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [isRetryPressed, setIsRetryPressed] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isGamePressed, setIsGamePressed] = useState(false);
  const [isLogoutPressed, setIsLogoutPressed] = useState(false);
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
          <Image
            source={require('../../../../assets/icons/help_ajuda.png')}
            style={styles.helpIcon}
            resizeMode="contain"
          />
          <Text style={styles.errorText}>Erro ao carregar perfil</Text>
          <Text style={styles.errorSubtext}>Não foi possível carregar seus dados</Text>

          <TouchableOpacity 
            style={[
              styles.retryButton,
              isRetryPressed && pixelArt.buttons.actionPressed
            ]}
            onPressIn={() => setIsRetryPressed(true)}
            onPressOut={() => setIsRetryPressed(false)}
            onPress={refetch}
            activeOpacity={1}
          >
            <View style={styles.retryButtonContent}>
              <Image
                source={require('../../../../assets/icons/icone_engrenagem_ajustes.png')}
                style={styles.settingsIcon}
                resizeMode="contain"
              />
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoginPressed && pixelArt.buttons.primaryPressed
            ]}
            onPressIn={() => setIsLoginPressed(true)}
            onPressOut={() => setIsLoginPressed(false)}
            onPress={async () => {
              await AsyncStorage.clear();
              onLogout();
            }}
            activeOpacity={1}
          >
            <View style={styles.loginButtonContent}>
              <Image
                source={require('../../../../assets/icons/icone_perfil_usuario_generico.png')}
                style={styles.profileIcon}
                resizeMode="contain"
              />
              <Text style={styles.loginButtonText}>Voltar ao Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[
            styles.backButton,
            isBackPressed && pixelArt.buttons.actionPressed
          ]}
          onPressIn={() => setIsBackPressed(true)}
          onPressOut={() => setIsBackPressed(false)}
          onPress={onBack}
          activeOpacity={1}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('../../../../assets/icons/icone_perfil_usuario_generico.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>
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

          <TouchableOpacity 
            style={[
              styles.actionButton,
              isGamePressed && pixelArt.buttons.primaryPressed
            ]}
            onPressIn={() => setIsGamePressed(true)}
            onPressOut={() => setIsGamePressed(false)}
            onPress={onNavigateToGame}
            activeOpacity={1}
          >
            <Image
              source={require('../../../../assets/icons/estrela.png')}
              style={styles.actionButtonIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionButtonText}>Jogar Coffeemon</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.logoutButton,
              isLogoutPressed && pixelArt.buttons.dangerPressed
            ]}
            onPressIn={() => setIsLogoutPressed(true)}
            onPressOut={() => setIsLogoutPressed(false)}
            onPress={handleLogout}
            activeOpacity={1}
          >
            <Image
              source={require('../../../../assets/icons/icone_perfil_usuario_generico.png')}
              style={styles.actionButtonIcon}
              resizeMode="contain"
            />
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
