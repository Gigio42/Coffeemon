import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gamifiedLogContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -40 }],
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
    elevation: 10,
  },
  gamifiedLogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
    textAlign: 'center',
  },
  gamifiedLogScrollView: {
    maxHeight: 60,
  },
  gamifiedLogText: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 2,
  },
});
