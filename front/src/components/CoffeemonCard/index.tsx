import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BASE_IMAGE_URL } from '../../utils/config';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';

interface CoffeemonCardProps {
  coffeemon: PlayerCoffeemon;
  onToggleParty: (coffeemon: PlayerCoffeemon) => void;
  isLoading?: boolean;
  variant?: 'large' | 'small';
}

export default function CoffeemonCard({
  coffeemon,
  onToggleParty,
  isLoading = false,
  variant = 'large',
}: CoffeemonCardProps) {
  const isSmall = variant === 'small';
  const isInParty = coffeemon.isInParty;

  return (
    <View
      style={isSmall ? styles.coffeemonCardSmall : styles.coffeemonCard}
    >
      <Image
        source={{
          uri: `${BASE_IMAGE_URL}${coffeemon.coffeemon.name}/default.png`,
        }}
        style={isSmall ? styles.coffeemonImageSmall : styles.coffeemonImage}
        defaultSource={require('../../../assets/icon.png')}
      />
      <Text style={isSmall ? styles.coffeemonNameSmall : styles.coffeemonName}>
        {coffeemon.coffeemon.name}
      </Text>
      <Text style={isSmall ? styles.coffeemonLevelSmall : styles.coffeemonLevel}>
        Nv. {coffeemon.level}
      </Text>
      <TouchableOpacity
        style={[
          styles.partyButton,
          isInParty ? styles.removeButton : styles.addButton,
        ]}
        onPress={() => onToggleParty(coffeemon)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSmall ? (isInParty ? '➖' : '➕') : (isInParty ? '➖ Remover' : '➕ Adicionar')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
