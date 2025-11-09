import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme/pixelArt';

export const styles = StyleSheet.create({
  hudInfoBox: {
    position: 'absolute',
    width: '45%',
    padding: pixelArt.spacing.sm,
    backgroundColor: pixelArt.colors.cardInnerBg,
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: pixelArt.borders.widthThick,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
    ...pixelArt.shadows.card,
  },
  playerHudContainer: {
    top: '5%',
    right: '5%',
  },
  opponentHudContainer: {
    bottom: '5%',
    left: '5%',
  },
  hudName: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    color: pixelArt.colors.textDark,
    marginBottom: pixelArt.spacing.xs,
  },
});
