import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface EmptyStateProps {
  icon?: string;
  message: string;
}

export default function EmptyState({ icon = '📦', message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
