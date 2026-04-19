import { StyleSheet, Platform } from 'react-native';

const C = {
  espresso:    '#1C1007',
  espressoMid: '#2D1810',
  coffee:      '#8B4513',
  caramel:     '#C8793A',
  gold:        '#F5D080',
  cream:       '#FAF7F2',
  creamWarm:   '#FDF8EE',
  white:       '#FFFFFF',
  inputBg:     'rgba(255,255,255,0.10)',
  inputBorder: 'rgba(255,255,255,0.20)',
  placeholder: 'rgba(255,255,255,0.45)',
  textLight:   'rgba(255,255,255,0.85)',
  searchBg:    '#FFFFFF',
  searchBorder:'rgba(196, 165, 120, 0.3)',
  muted:       '#7A6050',
  error:       '#E74C3C',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },

  // ─────────────────────────────────────────────
  // HEADER — espresso escuro com branding
  // ─────────────────────────────────────────────
  header: {
    backgroundColor: C.espresso,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 18 : 16,
    paddingBottom: 18,
    shadowColor: C.espresso,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  brandIcon: {
    fontSize: 22,
  },

  brandTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
    color: C.gold,
    textTransform: 'uppercase',
  },

  brandSubtitle: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: 'rgba(245,208,128,0.55)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },

  cartChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 6,
  },

  cartChipIcon: {
    width: 18,
    height: 18,
    tintColor: C.gold,
  },

  cartChipCount: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '900',
    color: C.gold,
  },

  cartChipBadge: {
    backgroundColor: C.caramel,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  cartChipBadgeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: '900',
    color: C.white,
  },

  // ─────────────────────────────────────────────
  // SEARCH BAR
  // ─────────────────────────────────────────────
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },

  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: C.placeholder,
  },

  searchInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: C.white,
    paddingVertical: 0,
    height: 40,
    textAlignVertical: 'center',
  },

  searchClear: {
    padding: 4,
  },

  searchClearText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '700',
  },

  // ─────────────────────────────────────────────
  // CONTEÚDO
  // ─────────────────────────────────────────────
  gradientContainer: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  productList: {
    flex: 1,
  },

  productsGrid: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 120,
  },

  productRow: {
    justifyContent: 'space-between',
  },

  // Resultados de busca
  resultsCounter: {
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(139,69,19,0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139,69,19,0.12)',
  },

  resultsText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: C.coffee,
    textAlign: 'center',
    fontWeight: '600',
  },

  // ─────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.cream,
    padding: 32,
  },

  loadingText: {
    fontFamily: 'monospace',
    color: C.muted,
    marginTop: 12,
    fontSize: 13,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: C.cream,
  },

  errorText: {
    fontFamily: 'monospace',
    color: C.error,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 13,
  },

  retryButton: {
    backgroundColor: C.coffee,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },

  retryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  retryIcon: {
    width: 20,
    height: 20,
    tintColor: C.white,
  },

  retryButtonText: {
    fontFamily: 'monospace',
    color: C.white,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
