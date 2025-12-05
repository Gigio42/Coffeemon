/**
 * Utility function to get gradient colors based on Coffeemon type
 * Matches backend CoffeemonType enum values
 */
export const getTypeGradient = (types: string[]): string[] => {
  const typeColors: { [key: string]: string[] } = {
    // Backend types (lowercase)
    fruity: ['#FF6B6B', '#C92A2A'],
    roasted: ['#8D6E63', '#5D4037'],
    spicy: ['#F44336', '#B71C1C'],
    sour: ['#FDD835', '#F9A825'],
    nutty: ['#D7A563', '#8D6E63'],
    floral: ['#E9A6E9', '#B565D8'],
    sweet: ['#FF4081', '#C2185B'],
    
    // Fallback to Pokemon types for any existing code
    Fire: ['#FF6B6B', '#C92A2A'],
    Water: ['#4ECDC4', '#1A535C'],
    Grass: ['#95E1D3', '#38A169'],
    Electric: ['#FFD93D', '#F6AE2D'],
    Psychic: ['#E9A6E9', '#B565D8'],
    Dark: ['#757575', '#424242'],
    Dragon: ['#7B68EE', '#483D8B'],
    Ice: ['#87CEEB', '#4682B4'],
    Normal: ['#D4D4D4', '#9E9E9E'],
    Fighting: ['#D32F2F', '#B71C1C'],
    Poison: ['#9C27B0', '#6A1B9A'],
    Ground: ['#D7A563', '#8D6E63'],
    Flying: ['#81D4FA', '#4FC3F7'],
    Bug: ['#9CCC65', '#689F38'],
    Rock: ['#8D6E63', '#5D4037'],
    Ghost: ['#7E57C2', '#5E35B1'],
    Steel: ['#90A4AE', '#607D8B'],
    Fairy: ['#F48FB1', '#EC407A'],
  };

  const primaryType = types[0]?.toLowerCase() || 'normal';
  return typeColors[primaryType] || typeColors.normal || ['#D4D4D4', '#9E9E9E'];
};

/**
 * Utility function to get solid color for a type (for badges, etc.)
 */
export const getTypeSolidColor = (type: string): string => {
  const gradient = getTypeGradient([type]);
  return gradient[0]; // Return the lighter shade
};

/**
 * Utility function to get stat bar color
 */
export const getStatColor = (statName: string): string => {
  const normalized = statName.toLowerCase();
  
  switch (normalized) {
    case 'hp':
    case 'health':
      return '#4CAF50';
    case 'atk':
    case 'attack':
      return '#F44336';
    case 'def':
    case 'defense':
      return '#2196F3';
    case 'spd':
    case 'speed':
      return '#FFC107';
    case 'spatk':
    case 'sp. atk':
      return '#9C27B0';
    case 'spdef':
    case 'sp. def':
      return '#00BCD4';
    default:
      return '#9E9E9E';
  }
};

/**
 * Format Coffeemon ID with leading zeros (e.g., 001, 042, 150)
 */
export const formatCoffeemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

/**
 * Calculate stat percentage for progress bar
 */
export const calculateStatPercentage = (value: number, max: number = 150): number => {
  return Math.min((value / max) * 100, 100);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
