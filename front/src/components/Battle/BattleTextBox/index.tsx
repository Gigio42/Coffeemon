import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface BattleTextBoxProps {
  message: string;
  isTyping: boolean;
  currentIndex: number;
  totalMessages: number;
  onTextBoxClick: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function BattleTextBox({
  message,
  isTyping,
  currentIndex,
  totalMessages,
  onTextBoxClick,
  onPrevious,
  onNext,
}: BattleTextBoxProps) {
  if (totalMessages === 0) return null;

  return (
    <TouchableOpacity
      style={styles.textBox}
      onPress={onTextBoxClick}
      activeOpacity={0.8}
    >
      <View style={styles.textBoxContent}>
        <Text style={styles.textBoxMessage}>
          {message}
          {isTyping && <Text style={styles.textBoxIndicator}>▮</Text>}
        </Text>
      </View>

      <View style={styles.textBoxCounterContainer}>
        <TouchableOpacity
          onPress={onPrevious}
          disabled={currentIndex === 0}
          style={styles.textBoxNavButton}
        >
          <Text
            style={[
              styles.textBoxNavArrow,
              currentIndex === 0 && styles.textBoxNavArrowDisabled,
            ]}
          >
            ◂
          </Text>
        </TouchableOpacity>

        <Text style={styles.textBoxCounter}>
          {currentIndex + 1}/{totalMessages}
        </Text>

        <TouchableOpacity
          onPress={onNext}
          disabled={currentIndex === totalMessages - 1}
          style={styles.textBoxNavButton}
        >
          <Text
            style={[
              styles.textBoxNavArrow,
              currentIndex === totalMessages - 1 &&
                styles.textBoxNavArrowDisabled,
            ]}
          >
            ▸
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
