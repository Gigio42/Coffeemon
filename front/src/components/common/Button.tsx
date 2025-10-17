import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

/**
 * ========================================
 * BUTTON - ÁTOMO
 * ========================================
 * 
 * Componente de botão reutilizável
 * Suporta variantes, loading e disabled
 */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.textInverse} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = {
  button: {
    height: theme.dimensions.buttonHeight,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.sm,
  } as ViewStyle,
  primary: {
    backgroundColor: theme.colors.primary,
  } as ViewStyle,
  secondary: {
    backgroundColor: theme.colors.secondary,
  } as ViewStyle,
  success: {
    backgroundColor: theme.colors.success,
  } as ViewStyle,
  error: {
    backgroundColor: theme.colors.error,
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  text: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  } as TextStyle,
};
