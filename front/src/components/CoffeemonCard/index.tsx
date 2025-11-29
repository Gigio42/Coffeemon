import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getServerUrl } from '../../utils/config';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles, getTypeColor, buildPixelCardColors } from './styles';
import { useDynamicPalette } from '../../utils/colorPalette';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getVariantForStatusEffects } from '../../utils/statusEffects';

const LIMONETO_BACKGROUND = require('../../../assets/backgrounds/limonetoback.png');
const JASMINELLE_BACKGROUND = require('../../../assets/backgrounds/jasminiback.png');
const MAPRION_BACKGROUND = require('../../../assets/backgrounds/maprionback.png');
const EMBERLY_BACKGROUND = require('../../../assets/backgrounds/emberlyback.png');
const GINGERLYNN_BACKGROUND = require('../../../assets/backgrounds/gingerlynnback.png');
const ALMONDINO_BACKGROUND = require('../../../assets/backgrounds/almondinoback.png');

const COFFEEMON_BACKGROUNDS: Record<string, ImageSourcePropType> = {
  jasminelle: JASMINELLE_BACKGROUND,
  limoneto: LIMONETO_BACKGROUND,
  limonetto: LIMONETO_BACKGROUND,
  maprion: MAPRION_BACKGROUND,
  emberly: EMBERLY_BACKGROUND,
  gingerlynn: GINGERLYNN_BACKGROUND,
  almondino: ALMONDINO_BACKGROUND,
};

interface CoffeemonCardProps {
  coffeemon: PlayerCoffeemon;
  onToggleParty: (coffeemon: PlayerCoffeemon) => Promise<void>;
  isLoading?: boolean;
  variant?: 'large' | 'small';
  maxHp?: number;
  disabled?: boolean;
  locked?: boolean;
  onPress?: (coffeemon: PlayerCoffeemon) => void;
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
  locked = false,
  onPress,
}: CoffeemonCardProps) {
  const isInParty = coffeemon.isInParty;
  const fallbackPalette = useMemo(
    () => getTypeColor(coffeemon.coffeemon.types?.[0], coffeemon.coffeemon.name),
    [coffeemon.coffeemon.types, coffeemon.coffeemon.name],
  );
  const spriteVariant = getVariantForStatusEffects(coffeemon.statusEffects, 'default');
  const assetModule = getCoffeemonImage(coffeemon.coffeemon.name, spriteVariant);
  const palette = useDynamicPalette(assetModule, fallbackPalette);

  const pixelColors = useMemo(
    () => {
      const colors = buildPixelCardColors(palette);
      if (locked) {
        return {
          ...colors,
          cardBackground: '#D3D3D3',
          cardBorder: '#A9A9A9',
          imageBorder: '#808080',
          titleColor: '#696969',
          footerBackground: '#C0C0C0',
          footerBorder: '#A9A9A9',
        };
      }
      return colors;
    },
    [palette, locked],
  );

  const [imageUri, setImageUri] = useState<string | null>(null);
  const fallbackImage = assetModule || require('../../../assets/icon.png');
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(fallbackImage);
  const [showActions, setShowActions] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'about' | 'status' | 'moves' | null>(null);



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
    if (disabled) {
      setShowActions(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (!isInParty) {
      setShowActions(false);
    }
  }, [isInParty]);

  const handleCardPress = useCallback(async () => {
    if (disabled || isLoading) {
      return;
    }

    if (onPress) {
      onPress(coffeemon);
      return;
    }

    // Se não está no party, adiciona
    if (!isInParty) {
      await onToggleParty(coffeemon);
      return;
    }

    // Se está no party, mostra/esconde ações
    setShowActions((current) => !current);
  }, [coffeemon, disabled, isInParty, isLoading, onToggleParty, onPress]);

  const handleRemoveFromParty = useCallback(async () => {
    if (disabled || isLoading) {
      return;
    }

    setShowActions(false);
    await onToggleParty(coffeemon);
  }, [coffeemon, disabled, isLoading, onToggleParty]);

  const handleTabPress = useCallback((tab: 'about' | 'status' | 'moves') => {
    setSelectedTab(currentTab => currentTab === tab ? null : tab);
  }, []);

  // Usar stats base da tabela coffeemon
  const finalStats = useMemo(() => {
    const base = coffeemon.coffeemon;
    return {
      hp: base.baseHp || 100,
      attack: base.baseAttack || 50,
      defense: base.baseDefense || 50,
      speed: base.baseSpeed || 50,
    };
  }, [coffeemon.coffeemon]);

  const maxStat = Math.max(finalStats.hp, finalStats.attack, finalStats.defense, finalStats.speed);

  // Log de debug para moves (apenas quando expande)
  useEffect(() => {
    if (showActions && selectedTab === 'moves') {
      console.log(`[${coffeemon.coffeemon.name}] learnedMoves:`, coffeemon.learnedMoves);
      if (coffeemon.learnedMoves && coffeemon.learnedMoves.length > 0) {
        console.log(`[${coffeemon.coffeemon.name}] Moves encontrados:`, 
          coffeemon.learnedMoves.map(lm => lm.move.name).join(', ')
        );
      } else {
        console.log(`[${coffeemon.coffeemon.name}] Nenhum move encontrado. Use "Add Missing Moves" no menu debug.`);
      }
    }
  }, [showActions, selectedTab, coffeemon]);

  // Calcular porcentagens das barras
  const hpPercent = Math.min((coffeemon.hp / (maxHp || 120)) * 100, 100);
  const isSmallVariant = variant === 'small';

  // Debug log para verificar moves
  useEffect(() => {
    if (showActions) {
      console.log('Coffeemon learnedMoves:', coffeemon.learnedMoves);
      console.log('Has moves:', coffeemon.learnedMoves && coffeemon.learnedMoves.length > 0);
    }
  }, [showActions, coffeemon.learnedMoves]);

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
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
        ]}
      >
        <View
          style={[styles.cardShadowBlock, { display: 'none' }]}
        />
        <LinearGradient
          colors={['#FFFFFF', '#F5F5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.coffeemonCard,
            isSmallVariant && styles.coffeemonCardSmall,
            isInParty && styles.coffeemonCardSelected,
            {
              borderColor: '#E0E0E0',
              backgroundColor: '#FFFFFF',
              minHeight: showActions ? 320 : 280,
            },
          ]}
        >
          <View style={styles.pixelOverlayContainer} pointerEvents="none">
            <View
              style={[
                styles.pixelBorderHorizontal,
                styles.pixelBorderTop,
                { backgroundColor: 'transparent' },
              ]}
            />
            <View
              style={[
                styles.pixelBorderHorizontal,
                styles.pixelBorderBottom,
                { backgroundColor: 'transparent' },
              ]}
            />
            <View
              style={[
                styles.pixelBorderVertical,
                styles.pixelBorderLeft,
                { backgroundColor: 'transparent' },
              ]}
            />
            <View
              style={[
                styles.pixelBorderVertical,
                styles.pixelBorderRight,
                { backgroundColor: 'transparent' },
              ]}
            />

            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerTopLeft,
                { display: 'none' },
              ]}
            />
            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerTopRight,
                { display: 'none' },
              ]}
            />
            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerBottomLeft,
                { display: 'none' },
              ]}
            />
            <View
              style={[
                styles.pixelCorner,
                styles.pixelCornerBottomRight,
                { display: 'none' },
              ]}
            />
          </View>

          {/* Imagem do Coffeemon com background específico ocupando todo o card */}
          <View
            style={[
              styles.imageContainer,
              {
                borderColor: pixelColors.imageBorder,
                shadowColor: pixelColors.imageShadow,
                borderBottomLeftRadius: showActions ? 0 : 20,
                borderBottomRightRadius: showActions ? 0 : 20,
              },
            ]}
          >
            <ImageBackground
              source={COFFEEMON_BACKGROUNDS[coffeemon.coffeemon.name.toLowerCase()] || undefined}
              style={styles.imageBackgroundFill}
              resizeMode="cover"
              imageStyle={{ opacity: locked ? 0.3 : 0.85, tintColor: locked ? 'gray' : undefined }}
            >
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0)',
                  'rgba(255, 255, 255, 0.2)',
                  'rgba(255, 255, 255, 0.6)',
                  'rgba(255, 255, 255, 0.95)',
                ]}
                style={styles.radialGradientOverlay}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                {/* Nome como overlay no topo */}
                <View
                  style={[
                    styles.cardHeader,
                    {
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.coffeemonName,
                      {
                        color: locked ? '#696969' : '#FFFFFF',
                        textShadowColor: locked ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
                      },
                    ]}
                  >
                    {coffeemon.coffeemon.name.toUpperCase()}
                  </Text>
                </View>

                <Image
                  source={imageSource}
                  style={[
                    styles.coffeemonImage,
                    { 
                      borderColor: pixelColors.imageBorder,
                      opacity: locked ? 0.5 : 1,
                    },
                  ]}
                  resizeMode="contain"
                  defaultSource={fallbackImage}
                  onError={() => setImageSource(fallbackImage)}
                />
                
                {/* Badge de Tipo como overlay na imagem */}
                <View style={styles.typeBadgeOverlay}>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor: pixelColors.footerBackground,
                        borderColor: pixelColors.footerBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.typeBadgeIcon]}>
                      {getTypeIcon(coffeemon.coffeemon.types?.[0])}
                    </Text>
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: pixelColors.titleColor },
                      ]}
                    >
                      {coffeemon.coffeemon.types?.[0]?.toUpperCase() || 'COFFEE'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Botões de ação que expandem o card */}
          {showActions && (
            <View style={styles.actionsExpandedContainer}>
              {/* Botões About, Status, Moves */}
              <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: selectedTab === 'about' ? pixelColors.footerBackground : '#FFFFFF',
                      },
                    ]}
                    onPress={() => handleTabPress('about')}
                  >
                    <Text style={[
                      styles.actionButtonText,
                      { color: selectedTab === 'about' ? pixelColors.titleColor : '#666666' }
                    ]}>About</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: selectedTab === 'status' ? pixelColors.footerBackground : '#FFFFFF',
                      },
                    ]}
                    onPress={() => handleTabPress('status')}
                  >
                    <Text style={[
                      styles.actionButtonText,
                      { color: selectedTab === 'status' ? pixelColors.titleColor : '#666666' }
                    ]}>Status</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: selectedTab === 'moves' ? pixelColors.footerBackground : '#FFFFFF',
                      },
                    ]}
                    onPress={() => handleTabPress('moves')}
                  >
                    <Text style={[
                      styles.actionButtonText,
                      { color: selectedTab === 'moves' ? pixelColors.titleColor : '#666666' }
                    ]}>Moves</Text>
                  </TouchableOpacity>
                </View>

                {/* Conteúdo da aba Status */}
                {selectedTab === 'status' && (
                  <View style={styles.tabContent}>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>HP</Text>
                      <View style={styles.statBarContainer}>
                        <View style={[styles.statBar, { width: `${(finalStats.hp / maxStat) * 100}%`, backgroundColor: '#FF5959' }]} />
                      </View>
                      <Text style={styles.statValue}>{finalStats.hp}</Text>
                    </View>

                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>ATK</Text>
                      <View style={styles.statBarContainer}>
                        <View style={[styles.statBar, { width: `${(finalStats.attack / maxStat) * 100}%`, backgroundColor: '#F5AC78' }]} />
                      </View>
                      <Text style={styles.statValue}>{finalStats.attack}</Text>
                    </View>

                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>DEF</Text>
                      <View style={styles.statBarContainer}>
                        <View style={[styles.statBar, { width: `${(finalStats.defense / maxStat) * 100}%`, backgroundColor: '#FAE078' }]} />
                      </View>
                      <Text style={styles.statValue}>{finalStats.defense}</Text>
                    </View>

                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>SPD</Text>
                      <View style={styles.statBarContainer}>
                        <View style={[styles.statBar, { width: `${(finalStats.speed / maxStat) * 100}%`, backgroundColor: '#9DB7F5' }]} />
                      </View>
                      <Text style={styles.statValue}>{finalStats.speed}</Text>
                    </View>

                    <View style={styles.experienceRow}>
                      <Text style={styles.experienceLabel}>Level {coffeemon.level}</Text>
                      <Text style={styles.experienceValue}>{coffeemon.experience} XP</Text>
                    </View>
                  </View>
                )}

              {/* Conteúdo da aba Moves */}
              {selectedTab === 'moves' && (
                <View style={styles.tabContent}>
                  {coffeemon.learnedMoves && coffeemon.learnedMoves.length > 0 ? (
                    coffeemon.learnedMoves.map((learnedMove) => (
                      <View key={learnedMove.id} style={styles.moveItem}>
                        <View style={styles.moveHeader}>
                          <Text style={styles.moveName}>{learnedMove.move.name}</Text>
                          <View style={[
                            styles.moveTypeChip,
                            { backgroundColor: learnedMove.move.elementalType ? pixelColors.footerBackground : '#999' }
                          ]}>
                            <Text style={styles.moveTypeText}>
                              {learnedMove.move.elementalType?.toUpperCase() || 'NORMAL'}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.moveDescription}>{learnedMove.move.description}</Text>
                        <View style={styles.moveMeta}>
                          <Text style={styles.moveMetaText}>Power: {learnedMove.move.power}</Text>
                          <Text style={styles.moveMetaText}>Category: {learnedMove.move.category}</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noMovesText}>Nenhum move aprendido</Text>
                  )}
                </View>
              )}

              {/* Conteúdo da aba About */}
              {selectedTab === 'about' && (
                <View style={styles.tabContent}>
                  <Text style={styles.aboutText}>Coffeemon Type: {coffeemon.coffeemon.types?.join(', ')}</Text>
                  <Text style={styles.aboutText}>Level: {coffeemon.level}</Text>
                  <Text style={styles.aboutText}>Experience: {coffeemon.experience}</Text>
                </View>
              )}
              
              {/* Botão de remover do party */}
              {isInParty && (
                <View style={styles.removeButtonContainer}>
                  <TouchableOpacity
                    style={styles.removeFromPartyButton}
                    onPress={handleRemoveFromParty}
                  >
                    <Text style={styles.removeFromPartyButtonText}>Remover do Time</Text>
                  </TouchableOpacity>
                </View>
              )}
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