import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { styles } from './styles';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  showCancel?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const { width } = Dimensions.get('window');

export default function CustomAlert({
  visible,
  type,
  title,
  message,
  onClose,
  showCancel = false,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancelar',
}: CustomAlertProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (visible) {
      // Animação de entrada com bounce
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Animação de sparkles
      sparkleAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      scaleAnim.setValue(0);
      bounceAnim.setValue(0);
      sparkleAnims.forEach(anim => anim.setValue(0));
    }
  }, [visible]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  const getIconStyle = () => {
    switch (type) {
      case 'success':
        return styles.iconSuccess;
      case 'error':
        return styles.iconError;
      case 'warning':
        return styles.iconWarning;
      case 'info':
        return styles.iconInfo;
      default:
        return styles.iconInfo;
    }
  };

  const sparklePositions = [
    styles.sparkle1,
    styles.sparkle2,
    styles.sparkle3,
    styles.sparkle4,
  ];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: bounceAnim },
              ],
            },
          ]}
        >
          {/* Sparkles decorativos */}
          {sparkleAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.sparkle,
                sparklePositions[index],
                {
                  opacity: anim,
                  transform: [
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}

          {/* Ícone com animação */}
          <Animated.View
            style={[
              styles.iconContainer,
              getIconStyle(),
              {
                transform: [
                  {
                    rotate: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-180deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.iconText}>{getIcon()}</Text>
          </Animated.View>

          {/* Título */}
          <Text style={styles.title}>{title}</Text>

          {/* Mensagem */}
          <Text style={styles.message}>{message}</Text>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
