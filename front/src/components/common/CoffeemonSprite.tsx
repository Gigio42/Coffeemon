import React, { useState } from 'react';
import { Image, StyleSheet, View, ActivityIndicator, ImageStyle, ViewStyle } from 'react-native';
import { getSpriteUrl } from '../../utils/config';
import { theme } from '../../styles/theme';

/**
 * ========================================
 * COFFEEMON SPRITE - ÁTOMO
 * ========================================
 * 
 * Componente para exibir sprite do Coffeemon
 * Suporta variantes (default, back, hurt) e fallback
 */

interface CoffeemonSpriteProps {
  name: string;
  variant?: 'default' | 'back' | 'hurt';
  size?: number;
  isAnimating?: boolean;
}

export const CoffeemonSprite: React.FC<CoffeemonSpriteProps> = ({
  name,
  variant = 'default',
  size = theme.dimensions.spriteSize,
  isAnimating = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const spriteUrl = getSpriteUrl(name, variant);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      {!error ? (
        <Image
          source={{ uri: spriteUrl }}
          style={[
            styles.sprite,
            { width: size, height: size } as ImageStyle,
            isAnimating && styles.animating,
          ]}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.placeholderImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  } as ViewStyle,
  sprite: {
    // Pixel art rendering
  } as ImageStyle,
  animating: {
    opacity: 0.7,
  } as ImageStyle,
  placeholder: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  } as ViewStyle,
  placeholderImage: {
    width: '50%',
    height: '50%',
    opacity: 0.5,
  } as ImageStyle,
};
