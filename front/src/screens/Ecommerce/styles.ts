import { StyleSheet } from 'react-native';
import { pixelArt } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pixelArt.colors.bgLight,
  },
  
  // ========================================
  // BARRA DE NAVEGAÇÃO INFERIOR
  // ========================================
  tabBar: {
    flexDirection: 'row',
    backgroundColor: pixelArt.colors.headerBg,
    borderTopWidth: 3,
    borderTopColor: pixelArt.colors.borderDark,
    paddingBottom: 5,
    paddingTop: 5,
    // Borda 3D sutil
    borderBottomWidth: 2,
    borderBottomColor: pixelArt.colors.borderLight,
    ...pixelArt.shadows.innerBorder,
  },
  
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },

  tabIconImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
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
