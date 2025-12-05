import { StyleSheet } from 'react-native';
import { pixelArt } from '../../theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Overlay mais escuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: pixelArt.borders.radiusMedium,
    padding: pixelArt.spacing.xl,
    alignItems: 'center',
    // Estilo Pixel Art 3D
    borderWidth: 4,
    borderColor: '#d4c5a0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.textDark,
    fontSize: 18,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: pixelArt.colors.textLight,
  },
  
  // Seleção de Presets
  presetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: pixelArt.spacing.lg,
    gap: 10,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  presetButtonActive: {
    backgroundColor: '#f0f9ff',
    borderColor: pixelArt.colors.coffeePrimary,
    borderWidth: 2,
  },
  presetIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 2,
  },
  presetTitleActive: {
    color: pixelArt.colors.coffeePrimary,
  },
  presetDesc: {
    fontSize: 10,
    color: '#999',
  },

  // Input Manual
  inputLabel: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    fontWeight: '700',
    color: pixelArt.colors.textDark,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: pixelArt.spacing.xl,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
  },

  // Ações
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // Borda para efeito de botão
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderBottomWidth: 4, // Efeito 3D
    borderBottomColor: '#bbb',
  },
  saveButton: {
    backgroundColor: pixelArt.colors.success,
    borderColor: '#2ecc71',
    borderBottomWidth: 4, // Efeito 3D
    borderBottomColor: '#219150',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
});