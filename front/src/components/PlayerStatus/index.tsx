import React from 'react';
import { View, Text, Image } from 'react-native';
import { usePlayer } from '../../hooks/usePlayer';
import { styles } from './styles';

const COINS_ICON = require('../../../assets/icons/icone_moedas.png');
const STAR_ICON = require('../../../assets/icons/estrela.png');
const SHIELD_ICON = require('../../../assets/icons/escudo.png');

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

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statusItem}>
          <Image source={COINS_ICON} style={styles.icon} />
          <Text style={styles.value}>{player.coins}</Text>
        </View>
        <View style={styles.statusItem}>
          <Image source={STAR_ICON} style={styles.icon} />
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(player.level / 100) * 100}%` }]} />
          </View>
        </View>
        <View style={styles.statusItem}>
          <Image source={SHIELD_ICON} style={styles.icon} />
          <Text style={styles.value}>{player.experience}</Text>
        </View>
      </View>
    </View>
  );
}