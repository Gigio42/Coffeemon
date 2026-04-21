import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - 14 * 2 - 12) / 2; // 14px padding each side, 12px gap

const C = {
  white:       '#FFFFFF',
  cream:       '#FAF7F2',
  coffee:      '#8B4513',
  coffeeDark:  '#6B3410',
  caramel:     '#C8793A',
  gold:        '#F5D080',
  espresso:    '#1C1007',
  textTitle:   '#2C1810',
  textPrice:   '#8B4513',
  textMuted:   '#9A8070',
  border:      'rgba(196, 165, 120, 0.22)',
  shadow:      '#6B3410',
  btnBg:       '#8B4513',
  btnLight:    '#A0522D',
  btnDark:     '#6B3410',
};

export const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: C.white,
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },

  // Card interno
  productCard: {
    flex: 1,
    backgroundColor: C.white,
    alignItems: 'center',
    paddingBottom: 12,
  },

  // Imagem ocupa topo sem padding
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F4EEE6',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  placeholderText: {
    color: C.textMuted,
    fontSize: 28,
  },

  // Sparkles (mantidos sutis)
  sparklesContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    pointerEvents: 'none',
  },

  sparkle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: C.caramel,
    transform: [{ rotate: '45deg' }],
    opacity: 0.45,
    borderRadius: 1,
  },
  sparkle1: { top: '18%', left: '18%' },
  sparkle2: { top: '72%', left: '14%' },
  sparkle3: { top: '38%', right: '22%' },
  sparkle4: { top: '12%', right: '38%' },
  sparkle5: { top: '82%', right: '18%' },

  // Conteúdo abaixo da imagem
  cardHeader: {
    paddingHorizontal: 10,
    marginBottom: 4,
    width: '100%',
  },

  productName: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '900',
    color: C.textTitle,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 16,
  },

  productDescription: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 12,
    paddingHorizontal: 4,
    marginBottom: 6,
  },

  productPrice: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '900',
    color: C.coffee,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Botão "Adicionar"
  addButton: {
    marginHorizontal: 10,
    width: 'auto' as any,
    alignSelf: 'stretch',
    backgroundColor: C.btnBg,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: C.btnDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },

  addButtonPressed: {
    backgroundColor: C.coffeeDark,
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.15,
  },

  addButtonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '900',
    color: C.white,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
