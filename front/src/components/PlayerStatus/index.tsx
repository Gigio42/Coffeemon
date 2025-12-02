import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../../hooks/usePlayer';
import { styles } from './styles';

const COINS_ICON = require('../../../assets/icons/icone_moedas.png');

interface PlayerStatusProps {
  token: string;
}

export default function PlayerStatus({ token }: PlayerStatusProps) {
  const { player, loading, error } = usePlayer(token);

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

  // Calcular progresso de nível (assumindo que cada nível precisa de 100 XP)
  const xpForNextLevel = 100;
  const currentLevelXp = player.experience % xpForNextLevel;
  const xpProgress = (currentLevelXp / xpForNextLevel) * 100;

  return (
    <View style={styles.container}>
      {/* Player Info */}
      <View style={styles.playerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{player.user?.username?.charAt(0).toUpperCase() || 'P'}</Text>
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
        {/* Moedas */}
        <View style={styles.statCard}>
          <Image source={COINS_ICON} style={styles.statIcon} />
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Moedas</Text>
            <Text style={styles.statValue}>{player.coins.toLocaleString()}</Text>
          </View>
        </View>

        {/* Experiência */}
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
  );
}