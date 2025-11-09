import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { PlayerState } from '../../../types';
import { styles } from '../../../screens/Battle/styles';
import { getServerUrl } from '../../../utils/config';

interface BattleHUDProps {
  playerState: PlayerState | null;
  isMe: boolean;
}

// Ícones baseados no tipo do Coffeemon
const getTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    floral: '🍇',
    sweet: '🔥',
    fruity: '🍋',
    nutty: '🌰',
    roasted: '🔥',
    spicy: '🌶️',
    sour: '🍃',
  };
  return icons[type?.toLowerCase()] || '☕';
};

export default function BattleHUD({ playerState, isMe }: BattleHUDProps) {
  const [serverUrl, setServerUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const loadServerUrl = async () => {
      const url = await getServerUrl();
      setServerUrl(url);
    };
    loadServerUrl();
  }, []);

  const activeMon =
    playerState && playerState.activeCoffeemonIndex !== null
      ? playerState.coffeemons[playerState.activeCoffeemonIndex]
      : null;

  useEffect(() => {
    if (activeMon && serverUrl) {
      const baseName = activeMon.name.split(' (Lvl')[0];
      setImageUrl(`${serverUrl}/imgs/${baseName}/default.png`);
    } else {
      setImageUrl('');
    }
  }, [activeMon, serverUrl]);

  if (!activeMon) {
    return null;
  }

  const hpPercent = Math.max(0, Math.min(100, (activeMon.currentHp / activeMon.maxHp) * 100));
  const totalSegments = 20; // Total de quadradinhos na barra
  const filledSegments = Math.ceil((hpPercent / 100) * totalSegments);
  
  const containerStyle = isMe ? styles.playerHudPosition : styles.opponentHudPosition;

  return (
    <View style={[styles.hudContainer, containerStyle]}>
      {/* Container Principal com display: flex e align-items: center */}
      <View style={styles.hudMainContent}>
        {/* Seção do Ícone - Pixel Art com image-rendering: pixelated */}
        <Image
          source={{ uri: imageUrl }}
          style={styles.hudPixelIcon}
          resizeMode="contain"
        />
        
        {/* Bloco de Informações - flex: 1 para ocupar espaço restante */}
        <View style={styles.hudInfoBlock}>
          {/* Rótulo de Texto - text-transform: uppercase */}
          <Text style={styles.hudNameLabel}>{activeMon.name}</Text>
          
          {/* Container da Barra de Status */}
          <View style={styles.hudStatusBarContainer}>
            {/* Segmentos da Barra - flex: 1 para largura igual */}
            {Array.from({ length: totalSegments }).map((_, index) => {
              const isFilled = index < filledSegments;
              // Classes distintas para verde (#8bc34a) e vermelho (#f44336)
              const segmentColor = isFilled 
                ? (hpPercent <= 20 ? '#f44336' : hpPercent <= 50 ? '#FFD700' : '#8bc34a')
                : 'transparent'; // Vazios transparentes para mostrar fundo
              
              return (
                <View
                  key={index}
                  style={[
                    styles.hudStatusSegment,
                    { backgroundColor: segmentColor },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
