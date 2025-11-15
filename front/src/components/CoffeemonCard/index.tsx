import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getServerUrl } from '../../utils/config';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles, getTypeColor, buildPixelCardColors } from './styles';
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
function getTypeIcon(type?: string): string {
  const icons: { [key: string]: string } = {
    floral: '🍇', // Amoreon (Roxo)
    sweet: '🔥',  // Maprion (Laranja/Marrom)
    fruity: '🍋',
    nutty: '🌰',
    roasted: '🔥',
    spicy: '🌶️',
    sour: '🍃',
  };
  if (!type) {
    return '☕';
  }

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

  const pixelColors = useMemo(
    () => buildPixelCardColors(palette),
    [palette.light, palette.dark, palette.accent],
  );

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
      <View
        style={[
          styles.cardPixelWrapper,
          isSmallVariant && styles.cardPixelWrapperSmall,
          {
            backgroundColor: pixelColors.cardOuterFill,
            borderColor: pixelColors.cardOuterBorder,
          },
        ]}
      >
        <View
          style={[
            styles.cardShadowBlock,
            {
              backgroundColor: pixelColors.cardShadowBlock,
              borderColor: pixelColors.cardShadowBorder,
            },
          ]}
        />
        <LinearGradient
          colors={[pixelColors.cardGradientTop, pixelColors.cardGradientBottom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.coffeemonCard,
            isSmallVariant && styles.coffeemonCardSmall,
            isInParty && styles.coffeemonCardSelected,
            {
              borderColor: pixelColors.cardBorder,
              backgroundColor: pixelColors.cardBackground,
            },
          ]}
        >
          <View style={styles.pixelOverlayContainer} pointerEvents="none">
            <View
              style={[
                styles.pixelBorderHorizontal,
                styles.pixelBorderTop,
                { backgroundColor: pixelColors.cardHighlight },
              ]}
            />
            <View
              style={[
                styles.pixelBorderHorizontal,
                styles.pixelBorderBottom,
                { backgroundColor: pixelColors.cardLowlight },
              ]}
            />
            <View
              style={[
                styles.pixelBorderVertical,
                styles.pixelBorderLeft,
                { backgroundColor: pixelColors.cardHighlight },
              ]}
            />
            <View
              style={[
                styles.pixelBorderVertical,
                styles.pixelBorderRight,
                { backgroundColor: pixelColors.cardLowlight },
              ]}
            />

            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerTopLeft,
                {
                  backgroundColor: pixelColors.cornerPixel,
                  borderColor: pixelColors.cornerBorder,
                },
              ]}
            />
            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerTopRight,
                {
                  backgroundColor: pixelColors.cornerPixel,
                  borderColor: pixelColors.cornerBorder,
                },
              ]}
            />
            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerBottomLeft,
                {
                  backgroundColor: pixelColors.cornerPixel,
                  borderColor: pixelColors.cornerBorder,
                },
              ]}
            />
            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerBottomRight,
                {
                  backgroundColor: pixelColors.cornerPixel,
                  borderColor: pixelColors.cornerBorder,
                },
              ]}
            />
          </View>

          {/* Header com nome e ícone */}
          <View
            style={[
              styles.cardHeader,
              {
                backgroundColor: pixelColors.headerBackground,
                borderColor: pixelColors.headerBorder,
                shadowColor: pixelColors.headerShadow,
              },
            ]}
          >
            <View style={[styles.headerIconContainer, {
              backgroundColor: pixelColors.iconBackground,
              borderColor: pixelColors.iconBorder,
              shadowColor: pixelColors.iconShadow,
            }]}
            >
              <Text
                style={[styles.headerIcon, { color: pixelColors.statValueColor }]}
              >
                {getTypeIcon(coffeemon.coffeemon.type)}
              </Text>
            </View>

            <View style={styles.headerNameAndHp}>
              <Text
                style={[
                  styles.coffeemonName,
                  {
                    color: pixelColors.titleColor,
                    textShadowColor: pixelColors.titleShadow,
                  },
                ]}
              >
                {coffeemon.coffeemon.name.toUpperCase()}
              </Text>
              {/* Barra de HP abaixo do nome */}
              <View
                style={[
                  styles.headerStatBarOuter,
                  {
                    backgroundColor: pixelColors.barOuterBackground,
                    borderColor: pixelColors.barOuterBorder,
                  },
                ]}
              >
                <View
                  style={[styles.headerStatBarInner, { backgroundColor: pixelColors.barInnerBackground }]}
                >
                  <View
                    style={[
                      styles.headerStatBarFill,
                      {
                        width: `${hpPercent}%`,
                        backgroundColor: pixelColors.hpFill,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Imagem do Coffeemon (sem borda interna) */}
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: pixelColors.imageBackground,
                borderColor: pixelColors.imageBorder,
                shadowColor: pixelColors.imageShadow,
              },
            ]}
          >
            <Image
              source={imageSource}
              style={[
                styles.coffeemonImage,
                { borderColor: pixelColors.imageBorder },
              ]}
              resizeMode="contain"
              defaultSource={fallbackImage}
              onError={() => setImageSource(fallbackImage)}
            />
          </View>

          {/* Stats */}
          <View style={styles.cardFooter}>
            <View
              style={[
                styles.footerInfoRow,
                {
                  backgroundColor: pixelColors.footerBackground,
                  borderColor: pixelColors.footerBorder,
                  shadowColor: pixelColors.footerShadow,
                },
              ]}
            >
              <View style={styles.statsContainer}>
                <View
                  style={[
                    styles.statItem,
                    {
                      backgroundColor: pixelColors.statBackground,
                      borderColor: pixelColors.statBorder,
                      shadowColor: pixelColors.statShadow,
                    },
                  ]}
                >
                  <Text
                    style={[styles.statLabel, { color: pixelColors.statLabelColor }]}
                  >
                    ATK
                  </Text>
                  <Text
                    style={[styles.statValue, {
                      color: pixelColors.statValueColor,
                      textShadowColor: pixelColors.statTextShadow,
                    }]}
                  >
                    {coffeemon.attack}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statItem,
                    {
                      backgroundColor: pixelColors.statBackground,
                      borderColor: pixelColors.statBorder,
                      shadowColor: pixelColors.statShadow,
                    },
                  ]}
                >
                  <Text
                    style={[styles.statLabel, { color: pixelColors.statLabelColor }]}
                  >
                    DEF
                  </Text>
                  <Text
                    style={[styles.statValue, {
                      color: pixelColors.statValueColor,
                      textShadowColor: pixelColors.statTextShadow,
                    }]}
                  >
                    {coffeemon.defense}
                  </Text>
                </View>
              </View>

            </View>

          </View>



          {showRemoveOverlay && (
            <View
              style={[styles.selectionOverlay, { backgroundColor: pixelColors.overlayColor }]}
              pointerEvents="box-none"
            >
              <TouchableOpacity
                onPress={handleRemovePress}
                activeOpacity={0.7}
                style={[
                  styles.removeButton,
                  {
                    backgroundColor: pixelColors.removeButtonBackground,
                    borderColor: pixelColors.removeButtonBorder,
                  },
                ]}
              >
                <Text
                  style={[styles.removeButtonText, { color: pixelColors.removeButtonText }]}
                >
                  ×
                </Text>
              </TouchableOpacity>

            </View>

          )}



          {isLoading && (
            <View
              style={[styles.loadingOverlay, { backgroundColor: pixelColors.loadingOverlay }]}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>

          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}