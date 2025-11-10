import { StyleSheet, Dimensions } from 'react-native';
import { pixelArt } from '../../theme/pixelArt';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleWrapper: {
    backgroundColor: '#faf8f0', // Header com tom creme claro
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    width: '100%',
    // Bordas pixeladas mais definidas
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#ffffff', // Borda clara para luz
    borderLeftColor: '#ffffff',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0', // Borda escura para sombra
    borderRightColor: '#d4c5a0',
  },
  modalTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 18,
    color: '#333333', // --text-dark
    textAlign: 'center' as const,
    width: '100%', // Ocupar toda a largura disponível
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#7f8c8d',
  },
  modalContent: {
    paddingBottom: 20,
  },
  carousel: {
    width: '100%',
  },
  carouselContent: {
    paddingHorizontal: 4,
    gap: 12,
    flexDirection: 'row',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 50,
  },
});
