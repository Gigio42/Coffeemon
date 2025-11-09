import { StyleSheet, Platform } from 'react-native';
import { pixelArt } from '../../theme';

// Para Android, adiciona padding para navigation bar
const navigationBarHeight = Platform.OS === 'android' ? 20 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2e8', // Cor creme clara - mesma do header
  },
  
  // ========================================
  // BARRA DE NAVEGAÇÃO INFERIOR
  // ========================================
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f5f2e8', // Cor creme clara
    borderTopWidth: 3,
    borderTopColor: '#d4c5a0', // Borda creme mais escura
    paddingBottom: 20 + navigationBarHeight, // Padding adicional na parte de baixo
    paddingTop: 6, // Reduzido
    // Borda 3D sutil
    borderBottomWidth: 2,
    borderBottomColor: '#faf8f0', // Borda creme mais clara
    ...pixelArt.shadows.innerBorder,
  },
  
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4, // Reduzido
    position: 'relative',
  },
  
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },

  tabIconImage: {
    width: 28,
    height: 28,
    marginBottom: 2,
    opacity: 0.6,
  },
  
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  
  tabLabel: {
    ...pixelArt.typography.pixelButton,
    fontSize: 9,
    color: pixelArt.colors.textLight,
  },
  
  tabLabelActive: {
    color: pixelArt.colors.coffeePrimary,
    fontWeight: '900',
  },
  
  badge: {
    position: 'absolute',
    top: -4,
    right: '25%',
    backgroundColor: pixelArt.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    // Borda do badge
    borderWidth: 2,
    borderColor: '#ffffff',
    ...pixelArt.shadows.button,
  },
  
  badgeText: {
    ...pixelArt.typography.pixelButton,
    color: '#ffffff',
    fontSize: 10,
  },
});
