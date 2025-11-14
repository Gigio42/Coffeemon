/**
 * Mapeamento centralizado de imagens dos Coffeemons
 * Este arquivo gerencia todas as imagens (default e back) de cada Coffeemon
 */

export interface CoffeemonImages {
  default: any;
  back: any;
}

export interface CoffeemonImageMap {
  [key: string]: CoffeemonImages;
}

/**
 * Mapa de todas as imagens dos Coffeemons
 * Uso: coffeemonImages['jasminelle'].default ou coffeemonImages['jasminelle'].back
 */
export const coffeemonImages: CoffeemonImageMap = {
  jasminelle: {
    default: require('./jasminelle/default.png'),
    back: require('./jasminelle/back.png'),
  },
  limonetto: {
    default: require('./limonetto/default.png'),
    back: require('./limonetto/back.png'),
  },
  maprion: {
    default: require('./maprion/default.png'),
    back: require('./maprion/back.png'),
  },
  emberly: {
    default: require('./emberly/default.png'),
    back: require('./emberly/back.png'),
  },
  almondino: {
    default: require('./almondino/default.png'),
    back: require('./almondino/back.png'),
  },
  gingerlynn: {
    default: require('./gingerlynn/default.png'),
    back: require('./gingerlynn/back.png'),
  },
};

/**
 * Obtém a imagem de um Coffeemon pelo nome
 * @param name - Nome do Coffeemon (ex: "Jasminelle (Lvl 5)" ou "jasminelle")
 * @param variant - Variante da imagem ('default' ou 'back')
 * @returns Imagem do Coffeemon ou fallback para Jasminelle
 */
export const getCoffeemonImage = (
  name: string,
  variant: 'default' | 'back' = 'default'
): any => {
  // Normalizar o nome (remover nível e converter para lowercase)
  const baseName = name.split(' (Lvl')[0].toLowerCase().trim();
  
  // Buscar imagem no mapa
  const images = coffeemonImages[baseName];
  
  if (images && images[variant]) {
    return images[variant];
  }
  
  // Fallback para Jasminelle se não encontrar
  console.warn(`[CoffeemonImages] Image not found for "${name}" (${variant}), using Jasminelle fallback`);
  return coffeemonImages.jasminelle?.[variant] || coffeemonImages.jasminelle?.default;
};

/**
 * Verifica se existe imagem para um Coffeemon
 * @param name - Nome do Coffeemon
 * @returns true se existir imagem, false caso contrário
 */
export const hasCoffeemonImage = (name: string): boolean => {
  const baseName = name.split(' (Lvl')[0].toLowerCase().trim();
  return baseName in coffeemonImages;
};

/**
 * Lista todos os Coffeemons disponíveis
 * @returns Array com os nomes de todos os Coffeemons
 */
export const getAvailableCoffeemons = (): string[] => {
  return Object.keys(coffeemonImages);
};

export default coffeemonImages;
