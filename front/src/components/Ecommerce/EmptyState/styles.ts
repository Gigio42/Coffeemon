import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.xxl,
  },

  icon: {
    fontSize: 64,
    marginBottom: pixelArt.spacing.lg,
  },

  iconImage: {
    width: 100,
    height: 100,
    marginBottom: pixelArt.spacing.lg,
  },

  message: {
    ...pixelArt.typography.pixelBody,
    color: pixelArt.colors.textLight,
    textAlign: 'center',
    fontSize: 14,
  },
});
