import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '48%',
    gap: 10,
  },
  attackButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
    elevation: 5,
  },
  attackButtonDisabled: {
    backgroundColor: '#555',
    borderColor: '#444',
  },
  attackButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  attackButtonTextDisabled: {
    color: '#888',
  },
  switchButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4682B4',
    elevation: 5,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  faintedButton: {
    backgroundColor: '#888',
    borderColor: '#666',
  },
  faintedText: {
    color: '#ccc',
  },
});
