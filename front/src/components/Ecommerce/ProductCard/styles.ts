import { StyleSheet, Dimensions } from 'react-native';
import { pixelArt } from '../../../theme';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2; // 2 cards per row with margins

export const styles = StyleSheet.create({
  // ========================================
  // CARD CONTAINER (Borda Externa 3D) - Exatamente como no HTML
  // ========================================
  cardContainer: {
    width: cardWidth,
    minWidth: 280, // Mínimo para mobile
    maxWidth: 320, // width: 320px do HTML
    padding: 12, // Reduzido para mobile
    backgroundColor: '#e0e0e0', // --card-outer-bg
    borderRadius: 4, // border-radius: 4px
    marginBottom: 15,
    marginHorizontal: 4,
    // Sombra mais suave para mobile
    shadowColor: '#888888',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    // Bordas mais finas
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#cccccc', // --border-light (sombra para cima/esquerda)
    borderLeftColor: '#cccccc',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#888888', // --border-dark (sombra para baixo/direita)
    borderRightColor: '#888888',
  },

  // ========================================
  // CARD INTERNO - Exatamente como no HTML
  // ========================================
  productCard: {
    backgroundColor: '#ffffff', // --card-inner-bg
    borderRadius: 2, // border-radius: 2px
    padding: 12, // Reduzido para mobile
    alignItems: 'center',
    // Simulação do inset box-shadow com bordas mais finas
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#f8f8f8', // Borda clara (simula inset light)
    borderLeftColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#e0e0e0', // Borda escura (simula inset shadow)
    borderRightColor: '#e0e0e0',
  },

  // ========================================
  // HEADER DO CARD - Sem ícone, apenas nome do produto
  // ========================================
  cardHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f8f8', // --header-bg
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    width: '100%',
    // Borda 3D do header mais fina
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#ffffff', // Borda clara (cima/esquerda)
    borderLeftColor: '#ffffff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#cccccc', // Borda escura (baixo/direita)
    borderRightColor: '#cccccc',
  },

  // ========================================
  // IMAGEM DO PRODUTO COM SPARKLES - Otimizado para mobile
  // ========================================
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1, // Proporção quadrada
    maxWidth: 180, // Reduzido para mobile
    height: 120, // Altura fixa menor
    marginBottom: 12,
    backgroundColor: '#f0e0d0',
    borderWidth: 2,
    borderColor: '#aaaaaa',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },

  placeholderText: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },

  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },

  sparkle: {
    position: 'absolute',
    width: 4, // Menor para mobile
    height: 4,
    backgroundColor: 'orange', // --sparkle-color: orange
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
    borderRadius: 1,
  },

  // Posições dos sparkles - Ajustadas para mobile
  sparkle1: { top: '20%', left: '20%' },
  sparkle2: { top: '70%', left: '15%' },
  sparkle3: { top: '40%', right: '25%' },
  sparkle4: { top: '15%', right: '40%' },
  sparkle5: { top: '80%', right: '20%' },

  // ========================================
  // INFO DO PRODUTO - Otimizado para mobile
  // ========================================
  productName: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 12, // Ligeiramente maior já que agora tem mais espaço
    color: '#333333', // --text-dark
    textAlign: 'center' as const,
    width: '100%', // Ocupar toda a largura disponível
  },

  productDescription: {
    ...pixelArt.typography.pixelBody,
    fontSize: 11, // Reduzido para mobile
    color: '#555555', // --text-light
    marginBottom: 10,
    lineHeight: 16,
    textAlign: 'center' as const,
    paddingHorizontal: 4,
  },

  productPrice: {
    ...pixelArt.typography.pixelPrice,
    fontSize: 14, // Reduzido para mobile
    color: '#333333', // --text-dark
    marginBottom: 12,
    textAlign: 'center' as const,
  },

  // ========================================
  // BOTÃO PIXEL ART - Exatamente como no HTML anexado (adaptado para mobile)
  // ========================================
  addButton: {
    ...pixelArt.buttons.primary,
    width: '100%',
    // Adaptações para mobile mantendo a essência do HTML
    paddingVertical: 10, // Menor que o HTML (15px) mas proporcional
    paddingHorizontal: 16, // Menor que o HTML (25px) mas proporcional
    // Bordas mais finas
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  addButtonPressed: {
    ...pixelArt.buttons.primaryPressed,
  },

  addButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 10, // Tamanho adequado para mobile
  },
});
