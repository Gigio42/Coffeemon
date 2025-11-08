import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme/pixelArt';

export const styles = StyleSheet.create({
  hudHpBarContainer: {
    width: '100%',
  },
  hudHpBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: pixelArt.borders.radiusSmall,
    overflow: 'hidden',
    borderWidth: 2,
    borderTopColor: pixelArt.colors.borderDark,
    borderLeftColor: pixelArt.colors.borderDark,
    borderBottomColor: pixelArt.colors.borderLight,
    borderRightColor: pixelArt.colors.borderLight,
  },
  hudHpBarFill: {
    height: '100%',
  },
  hudHpText: {
    position: 'absolute',
    right: pixelArt.spacing.xs,
    top: -1,
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: pixelArt.colors.textDark,
  },
});
