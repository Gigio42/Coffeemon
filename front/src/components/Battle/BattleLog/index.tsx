import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './styles';

interface BattleLogProps {
  messages: string[];
}

export default function BattleLog({ messages }: BattleLogProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <View style={styles.gamifiedLogContainer}>
      <Text style={styles.gamifiedLogTitle}>⚔️ Log de Batalha</Text>
      <ScrollView style={styles.gamifiedLogScrollView}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.gamifiedLogText}>
            • {msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
