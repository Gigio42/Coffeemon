import { StyleSheet, Dimensions } from 'react-native';
import { pixelArt } from '../../../theme';

const screenWidth = Dimensions.get('window').width;
const padding = 32; // 16px de cada lado
const spacing = 16; // Espaço entre os cards (aumentado)
const cardWidth = (screenWidth - padding - spacing) / 2; // Exatamente 2 cards por linha

export const styles = StyleSheet.create({
  // ========================================
  // CARD CONTAINER (Borda Externa 3D) - Exatamente como no HTML
  // ========================================
  cardContainer: {
    width: cardWidth,
    minWidth: cardWidth, // Força a largura exata
    maxWidth: cardWidth, // Força a largura exata
    padding: 8,
    backgroundColor: '#f5f2e8',
    borderRadius: 4,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0,
    shadowColor: '#d4c5a0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },

  // ========================================
  // CARD INTERNO - Exatamente como no HTML
  // ========================================
  productCard: {
    backgroundColor: '#ffffff', // --card-inner-bg mantém branco
    borderRadius: 2, // border-radius: 2px
    padding: 8, // Reduzido para mobile em 2 colunas
    alignItems: 'center',
    // Simulação do inset box-shadow com bordas mais finas em tons creme
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#faf8f0', // Borda creme clara (simula inset light)
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#f0e6d2', // Borda creme mais escura (simula inset shadow)
    borderRightColor: '#f0e6d2',
  },

  // ========================================
  // HEADER DO CARD - Sem ícone, apenas nome do produto
  // ========================================
  cardHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#faf8f0', // Header com tom creme claro
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    width: '100%',
    // Borda 3D do header mais fina com tons creme
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#ffffff', // Borda mais clara (cima/esquerda)
    borderLeftColor: '#ffffff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: '#f0e6d2', // Borda creme mais escura (baixo/direita)
    borderRightColor: '#f0e6d2',
  },

  // ========================================
  // IMAGEM DO PRODUTO COM SPARKLES - Otimizado para mobile
  // ========================================
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1, // Proporção quadrada
    maxWidth: 140,
    height: 120,
    marginBottom: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 11, // Reduzido para mobile em 2 colunas
    color: '#333333', // --text-dark
    textAlign: 'center' as const,
    width: '100%', // Ocupar toda a largura disponível
  },

  productDescription: {
    ...pixelArt.typography.pixelBody,
    fontSize: 9, // Reduzido para mobile em 2 colunas
    color: '#555555', // --text-light
    marginBottom: 6,
    lineHeight: 12,
    textAlign: 'center' as const,
    paddingHorizontal: 2,
  },

  productPrice: {
    ...pixelArt.typography.pixelPrice,
    fontSize: 12, // Reduzido para mobile em 2 colunas
    color: '#333333', // --text-dark
    marginBottom: 8,
    textAlign: 'center' as const,
  },

  // ========================================
  // BOTÃO PIXEL ART - Exatamente como no HTML anexado (adaptado para mobile)
  // ========================================
  addButton: {
    ...pixelArt.buttons.primary,
    width: '100%',
    // Adaptações para mobile em 2 colunas
    paddingVertical: 8, // Menor para mobile em 2 colunas
    paddingHorizontal: 12, // Menor para mobile em 2 colunas
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
    fontSize: 9, // Tamanho adequado para mobile em 2 colunas
  },
});
