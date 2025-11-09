import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  selectionCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    width: '45%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
    elevation: 5,
  },
  selectionCardDisabled: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
  },
  selectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  selectionNameDisabled: {
    color: '#666',
  },
  selectionHp: {
    fontSize: 14,
    color: '#aaa',
  },
  selectionHpDisabled: {
    color: '#444',
  },
});
