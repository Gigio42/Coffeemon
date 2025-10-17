import React from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

/**
 * ========================================
 * INPUT - ÁTOMO
 * ========================================
 * 
 * Campo de entrada de texto reutilizável
 * Suporta label, erro e variantes
 */

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={theme.colors.textLight}
        {...props}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = {
  container: {
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  input: {
    height: theme.dimensions.inputHeight,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  } as ViewStyle & TextStyle,
  inputError: {
    borderColor: theme.colors.error,
  } as ViewStyle,
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  } as TextStyle,
};
