import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getServerUrl } from '../../utils/config';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles, getTypeColor } from './styles';

// Mapping de imagens locais dos Coffeemons
const imageMap: { [key: string]: any } = {
  jasminelle: require('../../../assets/coffeemons/jasminelle/default.png'),
  limonetto: require('../../../assets/coffeemons/limonetto/default.png'),
  maprion: require('../../../assets/coffeemons/maprion/default.png'),
  emberly: require('../../../assets/coffeemons/emberly/default.png'),
};

interface CoffeemonCardProps {
  coffeemon: PlayerCoffeemon;
  onToggleParty: (coffeemon: PlayerCoffeemon) => Promise<void>;
  isLoading?: boolean;
  variant?: 'large' | 'small';
  maxHp?: number;
  disabled?: boolean;
}

// Função de ícone atualizada para BATER com a imagem (Uva, Fogo)
function getTypeIcon(type: string): string {
  const icons: { [key: string]: string } = {
    floral: '🍇', // Amoreon (Roxo)
    sweet: '🔥',  // Maprion (Laranja/Marrom)
    fruity: '🍋',
    nutty: '🌰',
    roasted: '🔥',
    spicy: '🌶️',
    sour: '🍃',
  };
  return icons[type.toLowerCase()] || '☕';
}

export default function CoffeemonCard({
  coffeemon,
  onToggleParty,
  isLoading = false,
  variant = 'large',
  maxHp,
  disabled = false,
}: CoffeemonCardProps) {
  const isSmall = variant === 'small';
  const isInParty = coffeemon.isInParty;
  const typeColor = getTypeColor(coffeemon.coffeemon.type, coffeemon.coffeemon.name);

  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadImageUri = async () => {
      const serverUrl = await getServerUrl();
      const normalizedPath = coffeemon.coffeemon.defaultImage?.replace(/^\/+/, '')
        || `${coffeemon.coffeemon.name}/default.png`;
      setImageUri(`${serverUrl.replace(/\/$/, '')}/${normalizedPath}`);
    };
    loadImageUri();
  }, [coffeemon.coffeemon.defaultImage, coffeemon.coffeemon.name]);

  // Calcula porcentagens das barras
  const hpPercent = Math.min((coffeemon.hp / (maxHp || 120)) * 100, 100);
  const expPercent = 60; // Valor fixo para o design, já que não temos o prop

  return (
    <LinearGradient
      colors={[typeColor.dark, typeColor.light]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.coffeemonCard,
        {
          borderColor: typeColor.dark,
        },
      ]}
    >
      {/* Header com nome e ícone */}
      <View
        style={[
          styles.cardHeader,
          {
            backgroundColor: typeColor.dark,
            borderBottomColor: typeColor.dark,
          },
        ]}
      >
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>{getTypeIcon(coffeemon.coffeemon.type)}</Text>
        </View>
        <View style={styles.headerNameAndHp}>
          <Text style={styles.coffeemonName}>
            {coffeemon.coffeemon.name.toUpperCase()}
          </Text>
          {/* Barra de HP abaixo do nome */}
          <View style={[styles.headerStatBarOuter, { backgroundColor: typeColor.accent }]}>
            <View style={styles.headerStatBarInner}>
              <View
                style={[
                  styles.headerStatBarFill,
                  { width: `${hpPercent}%`, backgroundColor: '#8BC34A' },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Imagem do Coffeemon (sem borda interna) */}
      <View style={styles.imageContainer}>
        <Image
          source={
            imageMap[coffeemon.coffeemon.name.toLowerCase()] ||
            (imageUri
              ? { uri: imageUri }
              : require('../../../assets/icon.png'))
          }
          style={styles.coffeemonImage}
          resizeMode="contain"
          defaultSource={require('../../../assets/icon.png')}
        />
      </View>

      {/* Nível e botão */}
      <View style={styles.cardFooter}>
        {/* Linha de info do rodapé (Stats e Nível) */}
        <View style={styles.footerInfoRow}>
          {/* Stats - Ataque e Defesa */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>ATK</Text>
              <Text style={styles.statValue}>{coffeemon.attack}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>DEF</Text>
              <Text style={styles.statValue}>{coffeemon.defense}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            {
              backgroundColor: isInParty ? typeColor.light : typeColor.dark, // Cor do card quando selecionado
              borderTopColor: typeColor.accent, // Cor da borda superior
            },
            isInParty && styles.selectedButton, // Estilo de selecionado (se houver)
          ]}
          onPress={() => onToggleParty(coffeemon)}
          disabled={isLoading || disabled}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.selectButtonText}>
              {isInParty ? 'SELECIONADO' : 'SELECIONAR'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}