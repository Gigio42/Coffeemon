import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme/pixelArt';

interface TurnIndicatorProps {
  turn: number;
  isMyTurn: boolean;
  isProcessing: boolean;
}

export default function TurnIndicator({ turn, isMyTurn, isProcessing }: TurnIndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.turnText}>🎲 Turno {turn}</Text>
      <View style={[
        styles.indicator,
        isMyTurn && !isProcessing ? styles.myTurn : styles.waiting
      ]}>
        <Text style={styles.indicatorText}>
          {isProcessing ? '⏳ Processando...' : isMyTurn ? '✅ Sua vez!' : '⏸️ Aguarde...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: pixelArt.borders.widthThick,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    padding: pixelArt.spacing.sm,
    marginBottom: pixelArt.spacing.sm,
    ...pixelArt.shadows.innerBorder,
  },
  turnText: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 11,
    color: pixelArt.colors.textDark,
  },
  indicator: {
    paddingHorizontal: pixelArt.spacing.sm,
    paddingVertical: pixelArt.spacing.xs,
    borderRadius: pixelArt.borders.radiusSmall,
    borderWidth: 2,
  },
  myTurn: {
    backgroundColor: '#d4f1d4',
    borderColor: pixelArt.colors.success,
  },
  waiting: {
    backgroundColor: '#fff3cd',
    borderColor: pixelArt.colors.warning,
  },
  indicatorText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9,
    color: pixelArt.colors.textDark,
  },
});
