import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  hudInfoBox: {
    position: 'absolute',
    width: '45%',
    padding: 8,
    backgroundColor: 'rgba(40, 40, 40, 0.85)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666',
    elevation: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
});
