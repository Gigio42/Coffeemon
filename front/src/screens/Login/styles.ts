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
  // BOTÃO DE CONFIGURAÇÃO (Posicionado)
  // ========================================
  configButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 10, // Ajuste para não colar na status bar
    right: 20,
    zIndex: 20,
  },
  configButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 2,
    borderColor: '#d4c5a0',
    ...pixelArt.shadows.small,
  },
  configIcon: {
    fontSize: 20,
  },

  // ========================================
  // CARD DE LOGIN
  // ========================================
  loginCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    padding: pixelArt.spacing.xl,
    borderRadius: pixelArt.borders.radiusMedium,
    // Borda 3D estilo Pixel Art
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    ...pixelArt.shadows.card,
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
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: pixelArt.borders.radiusSmall,
    paddingHorizontal: pixelArt.spacing.md,
    fontSize: 16,
    color: pixelArt.colors.textDark,
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
    ...pixelArt.buttons.primary,
    width: '100%',
    marginTop: pixelArt.spacing.md,
  },
  loginButtonText: {
    ...pixelArt.buttons.text,
    fontSize: 14,
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