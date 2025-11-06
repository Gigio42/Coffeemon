import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  hudHpBarContainer: {
    width: '100%',
  },
  hudHpBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#111',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  hudHpBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  hudHpText: {
    position: 'absolute',
    right: 6,
    top: -2,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
