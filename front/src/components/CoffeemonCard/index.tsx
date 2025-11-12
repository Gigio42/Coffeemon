import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getServerUrl } from '../../utils/config';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles, getTypeColor } from './styles';
import { useDynamicPalette } from '../../utils/colorPalette';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';

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
  const isInParty = coffeemon.isInParty;
  const fallbackPalette = useMemo(
    () => getTypeColor(coffeemon.coffeemon.type, coffeemon.coffeemon.name),
    [coffeemon.coffeemon.type, coffeemon.coffeemon.name],
  );
  const spriteVariant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
  const assetModule = getCoffeemonImage(coffeemon.coffeemon.name, spriteVariant);
  const palette = useDynamicPalette(assetModule, fallbackPalette);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const fallbackImage = assetModule || require('../../../assets/icon.png');
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(fallbackImage);
  const [showRemoveOverlay, setShowRemoveOverlay] = useState(false);

  useEffect(() => {
    const loadImageUri = async () => {
      const serverUrl = await getServerUrl();
      const normalizedPath = coffeemon.coffeemon.defaultImage?.replace(/^\/+/, '')
        || `${coffeemon.coffeemon.name}/default.png`;
      setImageUri(`${serverUrl.replace(/\/$/, '')}/${normalizedPath}`);
    };
    loadImageUri();
  }, [coffeemon.coffeemon.defaultImage, coffeemon.coffeemon.name]);

  useEffect(() => {
    setImageSource(fallbackImage);
  }, [fallbackImage]);

  useEffect(() => {
    let isMounted = true;

    if (!imageUri) {
      setImageSource(fallbackImage);
      return () => {
        isMounted = false;
      };
    }

    Image.prefetch(imageUri)
      .then((success) => {
        if (isMounted) {
          setImageSource(success ? { uri: imageUri } : fallbackImage);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageSource(fallbackImage);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [imageUri, fallbackImage]);

  useEffect(() => {
    if (!isInParty) {
      setShowRemoveOverlay(false);
    }
  }, [isInParty]);

  useEffect(() => {
    if (disabled) {
      setShowRemoveOverlay(false);
    }
  }, [disabled]);

  const handleCardPress = useCallback(async () => {
    if (disabled || isLoading) {
      return;
    }

    if (!isInParty) {
      await onToggleParty(coffeemon);
      return;
    }

    setShowRemoveOverlay((current) => !current);
  }, [coffeemon, disabled, isInParty, isLoading, onToggleParty]);

  const handleRemovePress = useCallback(async () => {
    if (disabled || isLoading) {
      return;
    }

    setShowRemoveOverlay(false);
    await onToggleParty(coffeemon);
  }, [coffeemon, disabled, isLoading, onToggleParty]);

  // Calcula porcentagens das barras
  const hpPercent = Math.min((coffeemon.hp / (maxHp || 120)) * 100, 100);
  const isSmallVariant = variant === 'small';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      disabled={disabled || isLoading}
      style={[
        styles.touchableWrapper,
        isSmallVariant && styles.touchableWrapperSmall,
      ]}
    >
      <LinearGradient
        colors={[palette.dark, palette.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.coffeemonCard,
          isSmallVariant && styles.coffeemonCardSmall,
          isInParty && styles.coffeemonCardSelected,
          {
            borderColor: palette.dark,
          },
        ]}
      >
        {/* Header com nome e ícone */}
        <View
          style={[
            styles.cardHeader,
            {
              backgroundColor: palette.dark,
              borderBottomColor: palette.dark,
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
            <View style={[styles.headerStatBarOuter, { backgroundColor: palette.accent }]}>
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
            source={imageSource}
            style={styles.coffeemonImage}
            resizeMode="contain"
            defaultSource={fallbackImage}
            onError={() => setImageSource(fallbackImage)}
          />
        </View>

        {/* Stats */}
        <View style={styles.cardFooter}>
          <View style={styles.footerInfoRow}>
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
        </View>

        {showRemoveOverlay && (
          <View style={styles.selectionOverlay} pointerEvents="box-none">
            <TouchableOpacity
              onPress={handleRemovePress}
              activeOpacity={0.7}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}