/**
 * ========================================
 * PIXEL ART THEME - DESIGN RETRÔ E SCANLINES
 * ========================================
 * Tema inspirado em design pixel art com efeitos de borda 3D,
 * sombras complexas e estética vintage/retrô
 */

export const pixelArt = {
  // ========================================
  // CORES BASE
  // ========================================
  colors: {
    bgLight: '#e0f0ff',
    bgDark: '#f0d0e0',
    cardOuterBg: '#e0e0e0',
    cardInnerBg: '#ffffff',
    borderDark: '#888888',
    borderLight: '#cccccc',
    headerBg: '#f8f8f8',
    buttonPrimary: '#8a2be2',
    buttonShadowDark: '#6a0ad6',
    buttonShadowLight: '#a453f2',
    textDark: '#333333',
    textLight: '#555555',
    sparkleColor: '#ff8c00',
    coffeePrimary: '#8B4513',
    coffeeDark: '#654321',
    coffeeLight: '#a0522d',
    success: '#27ae60',
    error: '#e74c3c',
    warning: '#f39c12',
  },

  // ========================================
  // SOMBRAS PIXELADAS (Box Shadow Style)
  // ========================================
  shadows: {
    // Sombra pequena para cards e botões
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    
    // Sombra externa pronunciada (borda 3D)
    outerBorder: {
      shadowColor: '#000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 8,
    },
    
    // Sombra interna (efeito chanfrado)
    innerBorder: {
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 0,
      elevation: 2,
    },

    // Botão com profundidade
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 6,
    },

    // Card elevado
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
  },

  // ========================================
  // TIPOGRAFIA PIXEL ART
  // ========================================
  typography: {
    pixelTitle: {
      fontFamily: 'monospace', // React Native não tem Press Start 2P por padrão
      fontSize: 18,
      fontWeight: '900' as const,
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
      textShadowColor: '#eeeeee',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 0,
    },
    
    pixelSubtitle: {
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: '700' as const,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },

    pixelBody: {
      fontFamily: 'monospace',
      fontSize: 16,
      lineHeight: 24,
    },

    pixelPrice: {
      fontFamily: 'monospace',
      fontSize: 22,
      fontWeight: '900' as const,
      letterSpacing: 1,
      textShadowColor: '#eeeeee',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 0,
    },

    pixelButton: {
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: '900' as const,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },

  // ========================================
  // BORDAS E RAIOS
  // ========================================
  borders: {
    radiusSmall: 2,
    radiusMedium: 4,
    widthThin: 1,
    widthThick: 2,
    widthBold: 3,
  },

  // ========================================
  // ESPAÇAMENTOS
  // ========================================
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  // ========================================
  // ESTILOS DE BOTÕES PIXEL ART (Baseado no arquivo anexado)
  // ========================================
  buttons: {
    // Botão Primário (Exatamente como no HTML anexado)
    primary: {
      backgroundColor: '#8a2be2', // --button-primary
      paddingVertical: 15,        // padding: 15px 25px do HTML
      paddingHorizontal: 25,
      borderRadius: 4,
      alignItems: 'center' as const,
      // Efeito 3D exato do HTML: sombras mais pronunciadas
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 4 },  // 4px 4px do box-shadow
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 8,
      // Bordas simulando o box-shadow do HTML
      borderTopWidth: 4,
      borderLeftWidth: 4, 
      borderTopColor: '#a453f2',    // --button-shadow-light (sombra superior/esquerda)
      borderLeftColor: '#a453f2',
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderBottomColor: '#6a0ad6', // --button-shadow-dark (sombra inferior/direita)
      borderRightColor: '#6a0ad6',
    },
    primaryPressed: {
      backgroundColor: '#6a0ad6',   // --button-shadow-dark (hover do HTML)
      transform: [{ translateY: 2 }], // translateY(2px) do :active
      // Sombra reduzida no estado pressionado (simula :active do HTML)
      shadowOffset: { width: 2, height: 2 },
      elevation: 4,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderBottomWidth: 2, 
      borderRightWidth: 2,
      borderTopColor: '#a453f2',
      borderLeftColor: '#a453f2', 
      borderBottomColor: '#5008a0', // Cor ainda mais escura do HTML hover
      borderRightColor: '#5008a0',
    },
    
    // Botão Secundário (Verde - mesmo padrão de sombra do HTML)
    secondary: {
      backgroundColor: '#4CAF50',
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 4,
      alignItems: 'center' as const,
      // Mesma estrutura de sombra do botão principal
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 8,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderTopColor: '#66BB6A',
      borderLeftColor: '#66BB6A',
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderBottomColor: '#388E3C',
      borderRightColor: '#388E3C',
    },
    secondaryPressed: {
      backgroundColor: '#388E3C',
      transform: [{ translateY: 2 }],
      shadowOffset: { width: 2, height: 2 },
      elevation: 4,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderTopColor: '#66BB6A',
      borderLeftColor: '#66BB6A',
      borderBottomColor: '#2E7D32', // Cor mais escura para o pressed
      borderRightColor: '#2E7D32',
    },
    
    // Botão de Ação (Azul - mesmo padrão de sombra)
    action: {
      backgroundColor: '#2196F3',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 4,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 6,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopColor: '#42A5F5',
      borderLeftColor: '#42A5F5',
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderBottomColor: '#1976D2',
      borderRightColor: '#1976D2',
    },
    actionPressed: {
      backgroundColor: '#1976D2',
      transform: [{ translateY: 1 }],
      shadowOffset: { width: 1, height: 1 },
      elevation: 3,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderRightWidth: 2,
    },
    
    // Botão de Perigo (Vermelho - mesmo padrão de sombra)
    danger: {
      backgroundColor: '#F44336',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 4,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 6,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopColor: '#EF5350',
      borderLeftColor: '#EF5350',
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderBottomColor: '#D32F2F',
      borderRightColor: '#D32F2F',
    },
    dangerPressed: {
      backgroundColor: '#D32F2F',
      transform: [{ translateY: 1 }],
      shadowOffset: { width: 1, height: 1 },
      elevation: 3,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderRightWidth: 2,
    },
    
    // Texto padrão dos botões (baseado no HTML)
    text: {
      fontFamily: 'monospace', // 'Press Start 2P' do HTML
      fontSize: 12,            // font-size: 0.9em do HTML
      fontWeight: '900' as const, // Mais bold como no HTML
      color: '#ffffff',
      letterSpacing: 1,        // letter-spacing: 1px do HTML
      textTransform: 'uppercase' as const,
      // Simula o text-shadow do HTML
      textShadowColor: '#000000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 0,
    },
    
    // Botões pequenos (mesmo padrão do HTML, proporcionalmente menor)
    small: {
      backgroundColor: '#8a2be2',
      width: 36,  // Ligeiramente maior para melhor usabilidade
      height: 36,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderRadius: 3,
      // Sombra proporcional ao botão principal
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 6,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopColor: '#a453f2',
      borderLeftColor: '#a453f2',
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderBottomColor: '#6a0ad6',
      borderRightColor: '#6a0ad6',
    },
    smallPressed: {
      backgroundColor: '#6a0ad6',
      transform: [{ translateY: 1 }],
      shadowOffset: { width: 1, height: 1 },
      elevation: 3,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderTopColor: '#a453f2',
      borderLeftColor: '#a453f2',
      borderBottomColor: '#5008a0',
      borderRightColor: '#5008a0',
    },
  },
};
