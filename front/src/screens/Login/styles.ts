import { StyleSheet, Dimensions, Platform } from 'react-native';
import { pixelArt } from '../../theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f2e8', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelArt.spacing.lg,
  },
  
  // ========================================
  // BARRA TOPO — padrão espresso da loja
  // ========================================
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1007',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#1C1007',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  topBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    minWidth: 80,
    justifyContent: 'center',
  },

  topBarButtonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
  },

  topBarIcon: {
    width: 18,
    height: 18,
    tintColor: 'rgba(255,255,255,0.85)',
  },

  topBarPlaceholder: {
    minWidth: 80,
  },

  // mantido para compatibilidade interna (ConfigModal)
  configButtonContainer: {},
  configButton: {},
  configIcon: { fontSize: 20 },

  // ========================================
  // CARD DE LOGIN
  // ========================================
  loginCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fdfbf5',
    padding: pixelArt.spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(196, 165, 120, 0.30)',
    shadowColor: '#1C1007',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    alignItems: 'center',
  },

  // ========================================
  // CABEÇALHO (LOGO/TÍTULO)
  // ========================================
  headerContainer: {
    alignItems: 'center',
    marginBottom: pixelArt.spacing.xl,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: pixelArt.spacing.sm,
  },
  appTitle: {
    ...pixelArt.typography.pixelTitle,
    color: pixelArt.colors.coffeePrimary,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    ...pixelArt.typography.pixelSubtitle,
    color: pixelArt.colors.textLight,
    fontSize: 12,
    textAlign: 'center',
  },

  // ========================================
  // FORMULÁRIO
  // ========================================
  formContainer: {
    width: '100%',
    gap: pixelArt.spacing.md,
  },
  inputGroup: {
    marginBottom: pixelArt.spacing.sm,
  },
  label: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    fontWeight: '700',
    color: pixelArt.colors.textDark,
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#faf7f0',
    borderWidth: 1.5,
    borderColor: 'rgba(196, 165, 120, 0.45)',
    borderRadius: pixelArt.borders.radiusSmall,
    paddingHorizontal: pixelArt.spacing.md,
    fontSize: 16,
    color: '#1C1007',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputError: {
    borderColor: pixelArt.colors.error,
    backgroundColor: '#fff0f0',
  },

  // ========================================
  // BOTÕES
  // ========================================
  loginButton: {
    width: '100%',
    marginTop: pixelArt.spacing.md,
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center' as const,
    shadowColor: '#1C1007',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  loginButtonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  
  toggleButton: {
    marginTop: pixelArt.spacing.lg,
    padding: pixelArt.spacing.sm,
  },
  toggleButtonText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 13,
    color: pixelArt.colors.textLight,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  // ========================================
  // FEEDBACK
  // ========================================
  messageContainer: {
    marginTop: pixelArt.spacing.md,
    padding: pixelArt.spacing.sm,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  messageText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // ========================================
  // FOOTER
  // ========================================
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 10,
    color: '#a0a0a0',
  },
  clearCacheButton: {
    marginTop: 8,
  },
});