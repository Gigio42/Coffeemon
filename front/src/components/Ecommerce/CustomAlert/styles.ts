import { StyleSheet } from 'react-native';
import { pixelArt } from '../../../theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  alertContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    // Borda 3D externa
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },

  // Sparkles decorativos
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },

  sparkle1: { top: 20, left: 30 },
  sparkle2: { top: 30, right: 40 },
  sparkle3: { bottom: 80, left: 40 },
  sparkle4: { bottom: 70, right: 30 },

  // Ícone
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Borda 3D do ícone
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },

  iconSuccess: {
    backgroundColor: '#4CAF50',
    borderTopColor: '#66BB6A',
    borderLeftColor: '#66BB6A',
    borderBottomColor: '#388E3C',
    borderRightColor: '#388E3C',
  },

  iconError: {
    backgroundColor: '#f44336',
    borderTopColor: '#ef5350',
    borderLeftColor: '#ef5350',
    borderBottomColor: '#c62828',
    borderRightColor: '#c62828',
  },

  iconWarning: {
    backgroundColor: '#FF9800',
    borderTopColor: '#FFB74D',
    borderLeftColor: '#FFB74D',
    borderBottomColor: '#F57C00',
    borderRightColor: '#F57C00',
  },

  iconInfo: {
    backgroundColor: '#2196F3',
    borderTopColor: '#42A5F5',
    borderLeftColor: '#42A5F5',
    borderBottomColor: '#1976D2',
    borderRightColor: '#1976D2',
  },

  iconText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
  },

  // Texto
  title: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 20,
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },

  message: {
    ...pixelArt.typography.pixelBody,
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Botões
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    // Borda 3D do botão
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },

  confirmButton: {
    backgroundColor: '#8B4513',
    borderTopColor: '#a0612f',
    borderLeftColor: '#a0612f',
    borderBottomColor: '#6b3410',
    borderRightColor: '#6b3410',
  },

  cancelButton: {
    backgroundColor: '#f5f2e8',
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },

  buttonText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },

  cancelButtonText: {
    color: '#8B4513',
  },
});
