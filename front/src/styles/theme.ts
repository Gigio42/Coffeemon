/**
 * ========================================
 * TEMA GLOBAL - DESIGN TOKENS
 * ========================================
 * 
 * Sistema de design centralizado para manter consistência visual
 */

export const theme = {
  // ========================================
  // CORES
  // ========================================
  colors: {
    // Primárias
    primary: '#2ecc71',
    primaryDark: '#27ae60',
    secondary: '#3498db',
    secondaryDark: '#2980b9',
    
    // Feedback
    success: '#2ecc71',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
    
    // Neutras
    background: '#f9f5ed',
    surface: '#ffffff',
    surfaceDark: '#e8e8e8',
    border: '#ddd',
    
    // Texto
    textPrimary: '#222',
    textSecondary: '#666',
    textLight: '#999',
    textInverse: '#fff',
    
    // Batalha
    battleArena: '#a2e2b9',
    playerTurn: '#2ecc71',
    opponentTurn: '#e74c3c',
    hpBarPlayer: '#3498db',
    hpBarOpponent: '#e74c3c',
    hpBarBackground: '#ccc',
    
    // Ataques
    fireAttack: '#4CAF50',
    normalAttack: '#4CAF50',
    
    // Transparências
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: 'rgba(0, 0, 0, 0.2)',
  },
  
  // ========================================
  // TIPOGRAFIA
  // ========================================
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
  
  // ========================================
  // ESPAÇAMENTO
  // ========================================
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // ========================================
  // BORDAS
  // ========================================
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  // ========================================
  // SOMBRAS
  // ========================================
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // ========================================
  // DIMENSÕES
  // ========================================
  dimensions: {
    buttonHeight: 48,
    inputHeight: 48,
    headerHeight: 60,
    tabBarHeight: 60,
    
    // Batalha
    battleArenaHeight: 300,
    spriteSize: 120,
    hpBarHeight: 22,
  },
} as const;

export type Theme = typeof theme;
