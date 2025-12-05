import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Vibration,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { getCoffeemonImage } from '../../../assets/coffeemons';
import { getTypeColorScheme } from '../../theme/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GachaRevealModalProps {
  visible: boolean;
  coffeemonName: string;
  coffeemonTypes: string[];
  onClose: () => void;
}

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
      Animated.delay(500),
      Animated.timing(cardFlipAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStage('revealed');
      Vibration.vibrate([0, 50, 100, 50]); // Victory vibration pattern
      startRevealedAnimations();
    });

    // Glow pulse with smoother animation
    Animated.loop(
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
    ).start();

    // Rotating rays animation
    Animated.loop(
      Animated.timing(raysRotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
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
    Animated.loop(
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
    ).start();

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
      ]).start(() => {
        // Loop sparkles
        if (stage === 'revealed') {
          anim.opacity.setValue(0);
          anim.translateX.setValue(0);
          anim.translateY.setValue(0);
          anim.scale.setValue(0);
          anim.rotation.setValue(0);
        }
      });
    });
  };

  if (!visible) return null;

  const imageSource = getCoffeemonImage(coffeemonName, 'default');
  const typeColors = getTypeColorScheme(coffeemonTypes[0] || 'roasted');

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

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.container}>
          {/* Card Container with Flip */}
          <View style={styles.cardContainer}>
            {/* Back of Card (before flip) */}
            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                {
                  transform: [{ rotateY: backfaceRotateY }],
                },
              ]}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                style={styles.cardBackGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.cardBackIcon}>✨</Text>
                <Text style={styles.cardBackText}>Gacha Pull</Text>
                <View style={styles.cardBackPattern}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={styles.patternCircle} />
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
                  transform: [{ rotateY: cardRotateY }],
                },
              ]}
            >
              <LinearGradient
                colors={typeColors.gradient as any}
                style={styles.cardFrontGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Rotating Rays Background */}
                <Animated.View
                  style={[
                    styles.raysContainer,
                    {
                      transform: [{ rotate: raysRotate }],
                    },
                  ]}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.ray,
                        {
                          transform: [{ rotate: `${(i * 360) / 12}deg` }],
                          backgroundColor: typeColors.light,
                        },
                      ]}
                    />
                  ))}
                </Animated.View>

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
                        { scale: scaleAnim },
                        { translateY: bounceTranslateY },
                      ],
                    },
                  ]}
                >
                  <Image source={imageSource} style={styles.coffeemonImage} />
                </Animated.View>

                {/* Enhanced Sparkles */}
                {sparkleAnims.map((anim, index) => {
                  const sparkleRotate = anim.rotation.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ['-360deg', '360deg'],
                  });
                  
                  // Vary sparkle icons
                  const sparkleIcon = index % 4 === 0 ? '✨' : index % 4 === 1 ? '⭐' : index % 4 === 2 ? '💫' : '🌟';
                  
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
                      <Text style={styles.sparkleIcon}>{sparkleIcon}</Text>
                    </Animated.View>
                  );
                })}

                {/* Coffeemon Info */}
                <Animated.View
                  style={[
                    styles.infoContainer,
                    {
                      transform: [{ translateY: slideUpAnim }],
                      opacity: cardFlipAnim,
                    },
                  ]}
                >
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
                  <Text style={styles.congratsText}>🎉 Novo Coffeemon! 🎉</Text>
                  <Text style={styles.rarityText}>★★★★★</Text>
                </Animated.View>
              </LinearGradient>
            </Animated.View>
          </View>

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
