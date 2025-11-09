import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { colors, metrics } from '../../theme';
import { pixelArt } from '../../theme';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f0',
  },
  
  // ========================================
  // HEADER FIXO
  // ========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pixelArt.spacing.lg,
    paddingTop: pixelArt.spacing.lg + statusBarHeight,
    paddingBottom: pixelArt.spacing.md,
    backgroundColor: '#f5f2e8',
    borderBottomWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderTopWidth: 2,
    borderTopColor: '#faf8f0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headerTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },

  backButton: {
    padding: 8,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#8B7355',
    fontWeight: '700',
  },
  
  // ========================================
  // GRADIENTE E SCROLL
  // ========================================
  gradientContainer: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: pixelArt.spacing.lg,
    paddingBottom: 40,
  },
  
  // ========================================
  // STATUS CARD
  // ========================================
  statusCard: {
    backgroundColor: '#fff9f0',
    padding: pixelArt.spacing.lg,
    borderRadius: 8,
    marginBottom: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    elevation: 3,
  },
  
  statusText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // ========================================
  // SEÇÕES
  // ========================================
  teamsSection: {
    marginBottom: pixelArt.spacing.lg,
  },

  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: pixelArt.spacing.md,
    textAlign: 'center',
  },

  divider: {
    height: 2,
    backgroundColor: '#f0e6d2',
    marginVertical: pixelArt.spacing.lg,
  },

  dividerSmall: {
    height: 1,
    backgroundColor: '#f0e6d2',
    marginVertical: pixelArt.spacing.sm,
  },

  orText: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ========================================
  // ACTION CARD (CAPTURA)
  // ========================================
  actionCard: {
    backgroundColor: '#ffffff',
    padding: pixelArt.spacing.lg,
    borderRadius: 8,
    marginBottom: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    elevation: 3,
  },

  cardTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: pixelArt.spacing.md,
    textAlign: 'center',
  },
  
  captureButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: '#b370cf',
    borderLeftColor: '#b370cf',
    borderBottomColor: '#7d3c98',
    borderRightColor: '#7d3c98',
    elevation: 4,
  },
  
  captureButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  // ========================================
  // BATTLE SECTION
  // ========================================
  battleSection: {
    backgroundColor: '#ffffff',
    padding: pixelArt.spacing.lg,
    borderRadius: 8,
    marginBottom: pixelArt.spacing.lg,
    borderWidth: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    elevation: 3,
  },

  battleButton: {
    paddingVertical: pixelArt.spacing.lg,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: 6,
    marginBottom: pixelArt.spacing.md,
    borderWidth: 3,
    elevation: 4,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  battleButtonEmoji: {
    fontSize: 32,
    marginRight: pixelArt.spacing.md,
  },

  buttonTextContainer: {
    flex: 1,
  },

  battleButtonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 2,
  },

  battleButtonSubtitle: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'monospace',
    opacity: 0.9,
  },
  
  pvpButton: {
    backgroundColor: '#3498db',
    borderTopColor: '#5dade2',
    borderLeftColor: '#5dade2',
    borderBottomColor: '#2980b9',
    borderRightColor: '#2980b9',
  },
  
  jessieButton: {
    backgroundColor: '#e67e22',
    borderTopColor: '#f39c12',
    borderLeftColor: '#f39c12',
    borderBottomColor: '#d35400',
    borderRightColor: '#d35400',
  },
  
  jamesButton: {
    backgroundColor: '#e74c3c',
    borderTopColor: '#ec7063',
    borderLeftColor: '#ec7063',
    borderBottomColor: '#c0392b',
    borderRightColor: '#c0392b',
  },
  
  // ========================================
  // LOGOUT BUTTON
  // ========================================
  logoutButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.lg,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: pixelArt.spacing.md,
    borderWidth: 3,
    borderTopColor: '#bdc3c7',
    borderLeftColor: '#bdc3c7',
    borderBottomColor: '#7f8c8d',
    borderRightColor: '#7f8c8d',
  },
  
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  // ========================================
  // DEPRECATED (mantidos para compatibilidade)
  // ========================================
  matchmakingContainer: {
    flex: 1,
    padding: metrics.spacing.lg,
    paddingTop: metrics.spacing.lg + statusBarHeight,
    alignItems: 'center',
  },
  
  matchTitle: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: metrics.spacing.lg,
    color: '#8B4513',
    textAlign: 'center',
  },
  
  statusContainer: {
    backgroundColor: '#fff9f0',
    padding: metrics.spacing.md,
    borderRadius: 6,
    marginBottom: metrics.spacing.lg,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#f0e6d2',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#faf8f0',
    borderLeftColor: '#faf8f0',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
  },
  
  botButtonsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: metrics.spacing.md,
  },
  
  botSectionTitle: {
    ...pixelArt.typography.pixelBody,
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
    fontWeight: '600',
  },
  
  findMatchButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    elevation: 5,
    borderWidth: 3,
  },
  
  findMatchButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
