import { StyleSheet, Platform } from 'react-native';

const navigationBarHeight = Platform.OS === 'android' ? 20 : 0;

// Paleta de cores do tema café premium
const C = {
  espresso:    '#1C1007',
  coffee:      '#8B4513',
  coffeeDeep:  '#6B3410',
  coffeeMid:   '#A0522D',
  caramel:     '#C8793A',
  cream:       '#FAF7F2',
  creamWarm:   '#FDF8EE',
  creamBorder: 'rgba(196, 165, 120, 0.25)',
  textMuted:   '#A89070',
  textActive:  '#5C2E0A',
  white:       '#FFFFFF',
  badge:       '#D93025',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },

  // ─────────────────────────────────────────────
  // TAB BAR — floating warm card
  // ─────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: C.creamWarm,
    paddingBottom: 12 + navigationBarHeight,
    paddingTop: 10,
    paddingHorizontal: 4,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: C.creamBorder,
    shadowColor: C.espresso,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 24,
  },

  // Tab normal
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },

  tabIconImage: {
    width: 26,
    height: 26,
    marginBottom: 3,
    opacity: 0.35,
  },

  tabIconActive: {
    opacity: 1,
    tintColor: C.coffee,
  },

  tabLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  tabLabelActive: {
    color: C.coffee,
    fontWeight: '900',
  },

  // Dot ativo
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.coffee,
    marginTop: 4,
  },

  tabDotHidden: {
    width: 4,
    height: 4,
    marginTop: 4,
    backgroundColor: 'transparent',
  },

  // ─────────────────────────────────────────────
  // GAME BUTTON — destaque central
  // ─────────────────────────────────────────────
  gameTabButton: {
    flex: 1.4,
    alignItems: 'center',
    paddingVertical: 0,
    paddingRight: 4,
    marginTop: -10, // sobe levemente acima da barra
  },

  gameButtonInner: {
    backgroundColor: C.coffee,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.coffee,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
    borderWidth: 2,
    borderColor: C.caramel,
    minWidth: 70,
  },

  gameButtonInnerActive: {
    backgroundColor: C.coffeeDeep,
    borderColor: C.coffee,
  },

  gameButtonIcon: {
    width: 22,
    height: 22,
    tintColor: C.white,
    marginBottom: 3,
  },

  gameButtonLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // ─────────────────────────────────────────────
  // BADGE DE CARRINHO
  // ─────────────────────────────────────────────
  badgeWrapper: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: C.badge,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: C.creamWarm,
  },

  badgeText: {
    fontFamily: 'monospace',
    color: C.white,
    fontSize: 9,
    fontWeight: '900',
  },
});
