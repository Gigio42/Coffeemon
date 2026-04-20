import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, Image, Vibration, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getTypeColorScheme } from '../../theme/colors';
import { getBattleIcon } from '../../../assets/iconsv2';

interface GachaRevealModalProps {
  visible: boolean;
  coffeemonName: string;
  coffeemonTypes: string[];
  onClose: () => void;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.replace('#', '');
  const normalized = raw.length === 3 ? raw.split('').map((char) => char + char).join('') : raw;
  if (normalized.length !== 6) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(a: string, b: string, ratio: number): string {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  if (!rgbA || !rgbB) return a;
  return rgbToHex(
    rgbA.r + (rgbB.r - rgbA.r) * ratio,
    rgbA.g + (rgbB.g - rgbA.g) * ratio,
    rgbA.b + (rgbB.b - rgbA.b) * ratio
  );
}

function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(255,255,255,${alpha})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const cardWidth = Math.min(screenWidth * 0.85, 360);
const cardHeight = Math.min(screenHeight * 0.65, 520);

export default function GachaRevealModal({
  visible,
  coffeemonName,
  coffeemonTypes,
  onClose,
}: GachaRevealModalProps) {
  const [stage, setStage] = useState<'hidden' | 'revealing' | 'revealed'>('hidden');
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const cardFlipAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const raysRotation = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const nameScaleAnim = useRef(new Animated.Value(0)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const revealPulseAnim = useRef(new Animated.Value(0)).current;

  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const raysLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const orbitLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const bounceLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  
  const sparkleAnims = useRef(
    Array.from({ length: 20 }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      startRevealAnimation();
    } else {
      resetAnimations();
    }
  }, [visible]);

  const resetAnimations = () => {
    setStage('hidden');
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.3);
    cardFlipAnim.setValue(0);
    glowAnim.setValue(0);
    slideUpAnim.setValue(50);
    raysRotation.setValue(0);
    bounceAnim.setValue(0);
    nameScaleAnim.setValue(0);
    orbitAnim.setValue(0);
    revealPulseAnim.setValue(0);

    glowLoopRef.current?.stop();
    raysLoopRef.current?.stop();
    orbitLoopRef.current?.stop();
    pulseLoopRef.current?.stop();
    bounceLoopRef.current?.stop();
    glowLoopRef.current = null;
    raysLoopRef.current = null;
    orbitLoopRef.current = null;
    pulseLoopRef.current = null;
    bounceLoopRef.current = null;

    sparkleAnims.forEach(anim => {
      anim.opacity.setValue(0);
      anim.translateX.setValue(0);
      anim.translateY.setValue(0);
      anim.scale.setValue(0);
      anim.rotation.setValue(0);
    });
  };

  const startRevealAnimation = () => {
    setStage('revealing');

    // Vibration feedback
    Vibration.vibrate(100);

    // Fade in overlay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Card flip animation with better easing
    Animated.sequence([
      Animated.delay(360),
      Animated.timing(cardFlipAnim, {
        toValue: 1,
        duration: 860,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStage('revealed');
      Vibration.vibrate([0, 50, 100, 50]); // Victory vibration pattern
      startRevealedAnimations();
    });

    // Glow pulse with smoother animation
    glowLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoopRef.current.start();

    // Rotating rays animation
    raysLoopRef.current = Animated.loop(
      Animated.timing(raysRotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    raysLoopRef.current.start();

    // Single orbital motion loop for smooth parallax/tilt (no center snap)
    orbitLoopRef.current = Animated.loop(
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 7600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    orbitLoopRef.current.start();
  };

  const startRevealedAnimations = () => {
    // Bounce then scale in the Coffeemon
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous gentle bounce
    bounceLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bounceLoopRef.current.start();

    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(revealPulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(revealPulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoopRef.current.start();

    // Slide up text with bounce
    Animated.spring(slideUpAnim, {
      toValue: 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Name scale animation
    Animated.sequence([
      Animated.delay(200),
      Animated.spring(nameScaleAnim, {
        toValue: 1,
        tension: 70,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Enhanced sparkles explosion with rotation
    sparkleAnims.forEach((anim, index) => {
      const angle = (index / sparkleAnims.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 60;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;
      const randomRotation = Math.random() * 720 - 360;

      Animated.sequence([
        Animated.delay(index * 30),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: targetX,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: targetY,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 0.8 + Math.random() * 0.4,
            tension: 60,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotation, {
            toValue: randomRotation,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  if (!visible) return null;

  const imageSource = getCoffeemonImage(coffeemonName, 'default');
  const primaryType = coffeemonTypes[0] || 'roasted';
  const typeColors = getTypeColorScheme(primaryType);
  const visualSeed = hashString(`${coffeemonName}-${coffeemonTypes.join('|')}`);
  const raysCount = 10 + (visualSeed % 7);
  const backPatternCount = 8 + (visualSeed % 5);
  const frontPatternCount = 14 + (visualSeed % 9);
  const backPatternVariant = visualSeed % 3;
  const frontTextureVariant = visualSeed % 4;
  const materialBase = typeColors.dark;
  const materialMid = mixHex(typeColors.secondary, typeColors.dark, 0.45);
  const materialSoft = mixHex(typeColors.light, typeColors.secondary, 0.38);
  const materialHighlight = mixHex(typeColors.light, '#ffffff', 0.45);

  const frontGradient = useMemo(
    () => [materialBase, materialMid, materialSoft] as const,
    [materialBase, materialMid, materialSoft]
  );

  const backGradient = useMemo(
    () => [mixHex(materialMid, '#0b1220', 0.42), materialBase, mixHex(materialBase, '#020617', 0.35)] as const,
    [materialMid, materialBase]
  );

  const overlayGradient = useMemo(
    () => ['rgba(4,8,18,0.82)', 'rgba(9,14,25,0.93)', 'rgba(4,8,18,0.88)'] as const,
    []
  );

  const backPatternItems = useMemo(
    () =>
      Array.from({ length: backPatternCount }).map((_, i) => {
        const localSeed = hashString(`${visualSeed}-back-${i}`);
        const size = 26 + (localSeed % 36);
        return {
          key: `back-${i}`,
          size,
          top: 14 + ((localSeed >> 3) % Math.max(20, Math.floor(cardHeight - size - 28))),
          left: 12 + ((localSeed >> 5) % Math.max(20, Math.floor(cardWidth - size - 24))),
          rotate: `${localSeed % 360}deg`,
        };
      }),
    [backPatternCount, visualSeed]
  );

  const frontPatternItems = useMemo(
    () =>
      Array.from({ length: frontPatternCount }).map((_, i) => {
        const localSeed = hashString(`${visualSeed}-front-${i}`);
        return {
          key: `front-${i}`,
          width: 10 + (localSeed % 38),
          height: 6 + ((localSeed >> 2) % 22),
          opacity: 0.06 + ((localSeed % 12) / 100),
          top: 12 + ((localSeed >> 4) % Math.max(20, Math.floor(cardHeight - 28))),
          left: 12 + ((localSeed >> 7) % Math.max(20, Math.floor(cardWidth - 28))),
          rotate: `${localSeed % 360}deg`,
          radius: 2 + ((localSeed >> 1) % 9),
        };
      }),
    [frontPatternCount, visualSeed]
  );

  const cardRotateY = cardFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const backfaceRotateY = cardFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const raysRotate = raysRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounceTranslateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const cardFloatTranslateY = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -6, 0, 6, 0],
  });

  const pulseScale = revealPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const cardTiltX = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '-3deg', '0deg', '3deg', '0deg'],
  });

  const cardTiltY = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '4deg', '0deg', '-4deg', '0deg'],
  });

  const parallaxX = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 10, 0, -10, 0],
  });

  const parallaxY = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -7, 0, 7, 0],
  });

  const sheenTranslateX = orbitAnim.interpolate({
    inputRange: [0, 0.22, 0.45, 0.68, 1],
    outputRange: [-cardWidth * 1.35, -cardWidth * 0.7, cardWidth * 0.15, cardWidth * 1.35, -cardWidth * 1.35],
  });

  const sheenOpacity = orbitAnim.interpolate({
    inputRange: [0, 0.15, 0.34, 0.55, 0.8, 1],
    outputRange: [0, 0.03, 0.18, 0.08, 0.01, 0],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={overlayGradient}
          style={styles.overlayGradient}
        />
        <View style={styles.container}>
          {/* Card Container with Flip */}
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [
                  { translateY: cardFloatTranslateY },
                  { perspective: 1600 },
                  { rotateX: cardTiltX },
                  { rotateY: cardTiltY },
                ],
              },
            ]}
          >
            <View style={styles.cardShadowLayerOuter} />
            <View style={styles.cardShadowLayerInner} />

            {/* Back of Card (before flip) */}
            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                {
                  transform: [{ perspective: 1200 }, { rotateY: backfaceRotateY }],
                },
              ]}
            >
              <LinearGradient
                colors={backGradient}
                style={styles.cardBackGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.18)', 'transparent']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardDepthTop}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(2,6,23,0.3)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardDepthBottom}
                />
                <View style={styles.cardBackFrameOuter} />
                <View style={styles.cardBackFrameInner} />
                <View style={styles.cardBackBadge}>
                  <Image source={getBattleIcon('card')} style={styles.cardBackIcon} />
                </View>
                <Text style={styles.cardBackText}>Gacha Pull</Text>
                <Text style={styles.cardBackSubText}>Revelando recompensa...</Text>
                <View style={styles.cardBackPattern}>
                  {backPatternItems.map((item, i) => (
                    <View
                      key={item.key}
                      style={[
                        styles.patternCircle,
                        backPatternVariant === 0
                          ? styles.backPatternRing
                          : backPatternVariant === 1
                            ? styles.backPatternSquare
                            : styles.backPatternLine,
                        {
                          width: item.size,
                          height: backPatternVariant === 2 ? 4 : item.size,
                          borderRadius: backPatternVariant === 1 ? 8 : backPatternVariant === 2 ? 2 : item.size / 2,
                          top: item.top,
                          left: item.left,
                          transform: [{ rotate: item.rotate }],
                          opacity: 0.1 + ((i % 4) * 0.03),
                        },
                      ]}
                    />
                  ))}
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Front of Card (after flip) */}
            <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                {
                  transform: [{ perspective: 1200 }, { rotateY: cardRotateY }],
                },
              ]}
            >
              <LinearGradient
                colors={frontGradient as any}
                style={styles.cardFrontGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.24)', 'transparent']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardDepthTop}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(2,6,23,0.32)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardDepthBottom}
                />
                {/* Rotating Rays Background */}
                <Animated.View
                  style={[
                    styles.raysContainer,
                    {
                      transform: [{ rotate: raysRotate }, { translateX: Animated.multiply(parallaxX, -0.4) }],
                    },
                  ]}
                >
                  {Array.from({ length: raysCount }).map((_, i) => (
                    <View
                      key={`ray-${i}`}
                      style={[
                        styles.ray,
                        {
                          transform: [{ rotate: `${(i * 360) / raysCount}deg` }],
                          backgroundColor: typeColors.light,
                        },
                      ]}
                    />
                  ))}
                </Animated.View>

                <Animated.View
                  style={[
                    styles.frontTextureLayer,
                    {
                      transform: [
                        { translateX: Animated.multiply(parallaxX, -0.55) },
                        { translateY: Animated.multiply(parallaxY, -0.45) },
                      ],
                    },
                  ]}
                >
                  {frontPatternItems.map((item) => (
                    <View
                      key={item.key}
                      style={[
                        styles.frontTextureShape,
                        frontTextureVariant === 0
                          ? styles.textureDash
                          : frontTextureVariant === 1
                            ? styles.textureDot
                            : frontTextureVariant === 2
                              ? styles.textureLine
                              : styles.textureChip,
                        {
                          width: frontTextureVariant === 1 ? Math.max(4, item.height) : item.width,
                          height: frontTextureVariant === 1 ? Math.max(4, item.height) : item.height,
                          top: item.top,
                          left: item.left,
                          borderRadius: frontTextureVariant === 1 ? 999 : item.radius,
                          opacity: item.opacity,
                          backgroundColor: withAlpha(materialHighlight, frontTextureVariant === 2 ? 0.18 : 0.13),
                          borderColor: withAlpha(materialHighlight, 0.16),
                          transform: [{ rotate: item.rotate }],
                        },
                      ]}
                    />
                  ))}
                </Animated.View>

                <LinearGradient
                  colors={[withAlpha(materialHighlight, 0.16), 'transparent', withAlpha(materialSoft, 0.1)]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.frontMaterialOverlay}
                />
                <LinearGradient
                  colors={['transparent', withAlpha(materialBase, 0.2)]}
                  start={{ x: 0.2, y: 0.2 }}
                  end={{ x: 0.8, y: 1 }}
                  style={styles.frontMaterialOverlaySecondary}
                />

                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.cardSheen,
                    {
                      opacity: sheenOpacity,
                      transform: [{ translateX: sheenTranslateX }, { rotate: '-18deg' }],
                    },
                  ]}
                />

                {/* Glow Effect */}
                <Animated.View
                  style={[
                    styles.glowEffect,
                    {
                      transform: [{ scale: glowScale }],
                      opacity: glowOpacity,
                      backgroundColor: typeColors.light,
                    },
                  ]}
                />

                {/* Secondary Glow Ring */}
                <Animated.View
                  style={[
                    styles.glowRing,
                    {
                      opacity: glowOpacity,
                      borderColor: typeColors.secondary,
                    },
                  ]}
                />

                {/* Coffeemon Image with Bounce */}
                <Animated.View
                  style={[
                    styles.imageContainer,
                    {
                      transform: [
                        { scale: Animated.multiply(scaleAnim, pulseScale) },
                        { translateY: bounceTranslateY },
                        { translateX: parallaxX },
                        { translateY: parallaxY },
                      ],
                    },
                  ]}
                >
                  <View style={styles.imageContent}>
                    <Image source={imageSource} style={styles.coffeemonImage} />
                  </View>
                </Animated.View>

                {/* Enhanced Sparkles */}
                {sparkleAnims.map((anim, index) => {
                  const sparkleRotate = anim.rotation.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ['-360deg', '360deg'],
                  });
                  const isRing = index % 3 === 0;
                  const isDot = !isRing && index % 2 === 0;

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.sparkle,
                        {
                          opacity: anim.opacity,
                          transform: [
                            { translateX: anim.translateX },
                            { translateY: anim.translateY },
                            { scale: anim.scale },
                            { rotate: sparkleRotate },
                          ],
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.sparkleGlyph,
                          isRing
                            ? styles.sparkleGlyphRing
                            : isDot
                              ? styles.sparkleGlyphDot
                              : styles.sparkleGlyphDiamond,
                          { borderColor: typeColors.light },
                          !isRing && { backgroundColor: typeColors.light },
                        ]}
                      />
                    </Animated.View>
                  );
                })}

                {/* Coffeemon Info */}
                <Animated.View
                  style={[
                    styles.infoShell,
                    {
                      transform: [
                        { translateY: slideUpAnim },
                        { translateX: Animated.multiply(parallaxX, -0.35) },
                        { translateY: Animated.multiply(parallaxY, -0.2) },
                      ],
                      opacity: cardFlipAnim,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#f8fafc', '#eef2f7', '#dbe3ee']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoContainer}
                  >
                    <View style={styles.infoInner}>
                      <View style={styles.typePill}>
                        <Text style={styles.typePillText}>
                          {coffeemonTypes[0]?.toUpperCase()}
                        </Text>
                      </View>
                      <Animated.View
                        style={{
                          transform: [{ scale: nameScaleAnim }],
                        }}
                      >
                        <Text style={styles.coffeemonName}>{coffeemonName}</Text>
                      </Animated.View>
                      <Text style={styles.congratsText}>Uma presença rara surgiu na sua coleção</Text>
                      <Text style={styles.rarityText}>★★★★★</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          {/* Close Button */}
          {stage === 'revealed' && (
            <Animated.View style={{ opacity: cardFlipAnim }}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.closeButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.closeButtonText}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}
