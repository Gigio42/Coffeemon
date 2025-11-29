import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const FriendsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amigos</Text>
      <Text style={styles.subtitle}>Em desenvolvimento...</Text>
    </View>
  );
};
