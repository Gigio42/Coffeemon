import React from 'react';
import { Text, View, Image, ImageSourcePropType } from 'react-native';
import { styles } from './styles';

interface EmptyStateProps {
  icon?: string;
  iconSource?: ImageSourcePropType;
  message: string;
}

export default function EmptyState({ icon = '📦', iconSource, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {iconSource ? (
        <Image
          source={iconSource}
          style={styles.iconImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.icon}>{icon}</Text>
      )}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
