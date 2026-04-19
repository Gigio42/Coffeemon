import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../../hooks/usePlayer';
import { styles } from './styles';

const COINS_ICON = require('../../../assets/icons/icone_moedas.png');
const SETTINGS_ICON = require('../../../assets/iconsv2/settings.png');

interface PlayerStatusProps {
  token: string;
  onNavigateToEcommerce?: () => void;
  onLogout?: () => void;
}

export default function PlayerStatus({
  token,
  onNavigateToEcommerce,
  onLogout,
}: PlayerStatusProps) {
  const { player, loading, error } = usePlayer(token);
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (error || !player) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados</Text>
      </View>
    );
  }

  const xpForNextLevel = 100;
  const currentLevelXp = player.experience % xpForNextLevel;
  const xpProgress = (currentLevelXp / xpForNextLevel) * 100;
  const initial = player.user?.username?.charAt(0).toUpperCase() || 'P';

  const handleLogout = () => {
    setMenuOpen(false);
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Settings button */}
        <TouchableOpacity
          style={styles.gearButton}
          onPress={() => setMenuOpen(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={SETTINGS_ICON} style={styles.gearIcon} />
        </TouchableOpacity>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{player.user?.username || 'Jogador'}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>Nível</Text>
              <Text style={styles.levelValue}>{player.level}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Image source={COINS_ICON} style={styles.statIcon} />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Moedas</Text>
              <Text style={styles.statValue}>{player.coins.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIconEmoji}>⭐</Text>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>XP</Text>
              <Text style={styles.statValue}>{player.experience}</Text>
            </View>
          </View>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>Progresso do Nível</Text>
            <Text style={styles.xpText}>{currentLevelXp}/{xpForNextLevel} XP</Text>
          </View>
          <View style={styles.xpBarBackground}>
            <LinearGradient
              colors={['#3B82F6', '#60A5FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.xpBarFill, { width: `${xpProgress}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          {/* stopPropagation: tap inside card doesn't close */}
          <Pressable style={styles.menuCard} onPress={(e) => e.stopPropagation()}>

            {/* Profile header */}
            <View style={styles.menuHeader}>
              <View style={styles.menuAvatar}>
                <Text style={styles.menuAvatarText}>{initial}</Text>
              </View>
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUsername} numberOfLines={1}>
                  {player.user?.username || 'Jogador'}
                </Text>
                {player.uid ? (
                  <Text style={styles.menuUid}>UID: {player.uid}</Text>
                ) : null}
                <View style={styles.menuLevelBadge}>
                  <Text style={styles.menuLevelText}>Nível {player.level}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.menuCloseButton}
                onPress={() => setMenuOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.menuCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuDivider} />

            {/* Actions */}
            {onNavigateToEcommerce && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  onNavigateToEcommerce();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemEmoji}>🏪</Text>
                <View style={styles.menuItemBody}>
                  <Text style={styles.menuItemTitle}>Ir para a Loja</Text>
                  <Text style={styles.menuItemSub}>Produtos, carrinho e pedidos</Text>
                </View>
                <Text style={styles.menuItemArrow}>›</Text>
              </TouchableOpacity>
            )}

            {onNavigateToEcommerce && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  onNavigateToEcommerce();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemEmoji}>👤</Text>
                <View style={styles.menuItemBody}>
                  <Text style={styles.menuItemTitle}>Conta</Text>
                  <Text style={styles.menuItemSub}>Gerenciar conta</Text>
                </View>
                <Text style={styles.menuItemArrow}>›</Text>
              </TouchableOpacity>
            )}

            <View style={styles.menuDivider} />

            {onLogout && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.menuItemEmoji}>🚪</Text>
                <View style={styles.menuItemBody}>
                  <Text style={[styles.menuItemTitle, styles.menuItemTitleDanger]}>
                    Sair da conta
                  </Text>
                </View>
              </TouchableOpacity>
            )}

          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
