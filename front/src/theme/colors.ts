// Universal Premium Theme for Coffeemon
// Refined Glassmorphism & Minimalist Aesthetic

const premiumColors = {
  background: {
    primary: '#F8FAFC', // Ultra-light cool gray, almost white
    secondary: '#FFFFFF',
    tertiary: '#F1F5F9',
    elevated: '#FFFFFF',
    overlay: 'rgba(255, 255, 255, 0.90)', // More opaque for cleaner look
  },
  
  surface: {
    base: '#FFFFFF',
    elevated: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.75)', // Perfect glass opacity
    input: '#F1F5F9', // Soft gray input
    glass: 'rgba(255, 255, 255, 0.6)',
    glassStrong: 'rgba(255, 255, 255, 0.9)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
  },
  
  text: {
    primary: '#0F172A', // Slate-900 - Sharp, high contrast
    secondary: '#64748B', // Slate-500 - Soft but readable
    tertiary: '#94A3B8', // Slate-400
    inverse: '#FFFFFF',
    disabled: '#CBD5E1',
    accent: '#6366F1',
  },
  
  accent: {
    primary: '#6366F1', // Indigo-500
    secondary: '#8B5CF6', // Violet-500
    tertiary: '#EC4899', // Pink-500
    purple: '#A855F7',
    gradient: ['#6366F1', '#8B5CF6'],
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  
  // Feedback Colors - Clean & Modern
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  feedback: {
    success: '#10B981',
    successBg: '#ECFDF5', // Emerald-50
    error: '#EF4444',
    errorBg: '#FEF2F2', // Red-50
    warning: '#F59E0B',
    warningBg: '#FFFBEB', // Amber-50
    info: '#3B82F6',
    infoBg: '#EFF6FF', // Blue-50
  },
  
  border: {
    light: 'rgba(148, 163, 184, 0.1)', // Slate-400 at 10%
    default: 'rgba(148, 163, 184, 0.15)',
    medium: 'rgba(148, 163, 184, 0.2)',
    dark: 'rgba(148, 163, 184, 0.3)',
    
    subtle: 'rgba(255, 255, 255, 0.5)', // For glass borders
    strong: 'rgba(148, 163, 184, 0.2)',
    accent: 'rgba(99, 102, 241, 0.3)',
  },
  
  button: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#FFFFFF',
    secondaryHover: '#F8FAFC',
    danger: '#EF4444',
    success: '#10B981',
    disabled: '#E2E8F0',
  },
  
  coin: {
    gold: '#F59E0B',
    goldDark: '#D97706',
    goldGlow: 'rgba(245, 158, 11, 0.4)',
    gradient: ['#FCD34D', '#F59E0B'],
  },
  
  shadow: {
    light: 'rgba(148, 163, 184, 0.1)',
    medium: 'rgba(148, 163, 184, 0.15)',
    dark: 'rgba(15, 23, 42, 0.1)',
    
    sm: 'rgba(0, 0, 0, 0.03)',
    md: 'rgba(0, 0, 0, 0.06)',
    lg: 'rgba(0, 0, 0, 0.10)',
    xl: 'rgba(0, 0, 0, 0.15)',
    
    colored: 'rgba(99, 102, 241, 0.25)', // Primary colored shadow
  },
  
  glow: {
    primary: 'rgba(99, 102, 241, 0.4)',
    success: 'rgba(16, 185, 129, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    error: 'rgba(239, 68, 68, 0.4)',
  },
  
  shimmer: 'rgba(255, 255, 255, 0.6)',
  backdrop: 'rgba(241, 245, 249, 0.8)', // Blur backdrop
};

// Export same colors for both light and dark to unify theme
export const lightColors = premiumColors;
export const darkColors = premiumColors;

// Type Colors - Refined for Softness & Glow
export const typeColors = {
  fruity: {
    primary: '#F59E0B',
    secondary: '#D97706',
    gradient: ['#FEF3C7', '#FDE68A'], // Amarelo vibrante levemente mais claro
    accentGradient: ['#FCD34D', '#F59E0B'],
    light: '#FFFBEB',
    dark: '#92400E',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  roasted: {
    primary: '#8D6E63',
    secondary: '#6D4C41',
    gradient: ['#F5E6D3', '#E8D4BE'], // Bege/café levemente mais claro
    accentGradient: ['#BCAAA4', '#8D6E63'],
    light: '#FAFAF9',
    dark: '#4E342E',
    glow: 'rgba(141, 110, 99, 0.3)',
  },
  spicy: {
    primary: '#EF4444',
    secondary: '#B91C1C',
    gradient: ['#FEE2E2', '#FECACA'], // Vermelho levemente mais claro
    accentGradient: ['#FCA5A5', '#EF4444'],
    light: '#FFF5F5',
    dark: '#7F1D1D',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
  sour: {
    primary: '#10B981',
    secondary: '#047857',
    gradient: ['#D1FAE5', '#A7F3D0'], // Verde levemente mais claro
    accentGradient: ['#6EE7B7', '#10B981'],
    light: '#F0FDF4',
    dark: '#064E3B',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  nutty: {
    primary: '#D97706',
    secondary: '#B45309',
    gradient: ['#FCD34D', '#FBBF24'], // Laranja levemente mais claro
    accentGradient: ['#FDBA74', '#D97706'],
    light: '#FFFAF0',
    dark: '#78350F',
    glow: 'rgba(217, 119, 6, 0.3)',
  },
  floral: {
    primary: '#A855F7',
    secondary: '#7E22CE',
    gradient: ['#F3E8FF', '#E9D5FF'], // Roxo levemente mais claro
    accentGradient: ['#D8B4FE', '#A855F7'],
    light: '#FAF5FF',
    dark: '#581C87',
    glow: 'rgba(168, 85, 247, 0.3)',
  },
  sweet: {
    primary: '#EC4899',
    secondary: '#BE185D',
    gradient: ['#FCE7F3', '#FBCFE8'], // Rosa levemente mais claro
    accentGradient: ['#F9A8D4', '#EC4899'],
    light: '#FFF1F2',
    dark: '#831843',
    glow: 'rgba(236, 72, 153, 0.3)',
  },
  bitter: {
    primary: '#475569',
    secondary: '#1E293B',
    gradient: ['#E2E8F0', '#CBD5E1'], // Cinza-azulado levemente mais claro
    accentGradient: ['#64748B', '#475569'],
    light: '#F8FAFC',
    dark: '#0F172A',
    glow: 'rgba(71, 85, 105, 0.3)',
  },
  milky: {
    primary: '#94A3B8',
    secondary: '#64748B',
    gradient: ['#DDD6FE', '#C4B5FD'], // Lilás levemente mais claro
    accentGradient: ['#A5B4FC', '#818CF8'],
    light: '#F8FAFC',
    dark: '#334155',
    glow: 'rgba(148, 163, 184, 0.3)',
  },
  iced: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    gradient: ['#DBEAFE', '#BFDBFE'], // Azul levemente mais claro
    accentGradient: ['#93C5FD', '#3B82F6'],
    light: '#F0F9FF',
    dark: '#1E3A8A',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
};

export let colors = premiumColors;

export const setTheme = (isDark: boolean) => {
  colors = premiumColors;
};

export const getTypeColorScheme = (type: string) => {
  const normalizedType = type?.toLowerCase() || 'roasted';
  return typeColors[normalizedType as keyof typeof typeColors] || typeColors.roasted;
};

export const gradients = {
  primary: ['#6366F1', '#8B5CF6'],
  success: ['#34D399', '#10B981'],
  warning: ['#FBBF24', '#F59E0B'],
  error: ['#F87171', '#EF4444'],
  
  glass: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)'],
  glassCard: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
  
  shimmerOverlay: [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0)',
  ],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const typography = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
