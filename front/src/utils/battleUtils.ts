import { BattleState } from '../types';
import { getServerUrl } from './config';

/**
 * Remove o sufixo de nível do nome do Coffeemon
 */
export function getBaseName(name: string): string {
  if (!name) return '';
  return name.split(' (Lvl')[0];
}

/**
 * Obtém URL da imagem do Coffeemon com fallback
 */
export async function getCoffeemonImageUrl(name: string, variant: 'default' | 'back' = 'default'): Promise<string> {
  const baseName = getBaseName(name);
  
  const serverUrl = await getServerUrl();
  return `${serverUrl}/imgs/${baseName}/${variant}.png`;
}

/**
 * Verifica qual jogador é o atual com base no playerId
 */
export function getPlayerStates(battleState: BattleState, playerId: number) {
  const myPlayerState =
    battleState.player1Id === playerId ? battleState.player1 : battleState.player2;
  const opponentPlayerState =
    battleState.player1Id === playerId ? battleState.player2 : battleState.player1;

  return { myPlayerState, opponentPlayerState };
}

/**
 * Obtém a imagem do cenário
 */
export function getScenarioImage(scenarioName?: string) {
  const scenarioImages = {
    default: require('../../assets/backgrounds/field.png'),
    field: require('../../assets/backgrounds/field.png'),
    forest: require('../../assets/backgrounds/forest.png'),
    city: require('../../assets/backgrounds/city.png'),
    duskfield: require('../../assets/backgrounds/duskfield.jpeg'),
    latefield: require('../../assets/backgrounds/latefield.jpeg'),
    nightpath: require('../../assets/backgrounds/nightpath.jpeg'),
    village: require('../../assets/backgrounds/village.jpeg'),
    waterfall: require('../../assets/backgrounds/waterfall.jpeg'),
    wheatfield: require('../../assets/backgrounds/wheatfield.jpeg'),
  };

  if (scenarioName && scenarioImages[scenarioName as keyof typeof scenarioImages]) {
    return scenarioImages[scenarioName as keyof typeof scenarioImages];
  }
  return scenarioImages.default;
}

/**
 * Seleciona um cenário aleatório baseado no battleId (consistente para ambos os jogadores)
 */
export function getBattleScenario(battleId?: string) {
  const scenarioNames = ['field', 'forest', 'city', 'duskfield', 'latefield', 'nightpath', 'village', 'waterfall', 'wheatfield'];

  if (!battleId) {
    return getScenarioImage('default');
  }

  // Usar o battleId como seed para seleção consistente
  let hash = 0;
  for (let i = 0; i < battleId.length; i++) {
    const char = battleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converte para 32 bits
  }

  const scenarioIndex = Math.abs(hash) % scenarioNames.length;
  return getScenarioImage(scenarioNames[scenarioIndex]);
}

/**
 * Seleciona um cenário aleatório para matchmaking (muda sempre)
 */
export function getRandomScenario() {
  const scenarios = [
    require('../../assets/backgrounds/field.png'),
    require('../../assets/backgrounds/forest.png'),
    require('../../assets/backgrounds/city.png'),
    require('../../assets/backgrounds/duskfield.jpeg'),
    require('../../assets/backgrounds/latefield.jpeg'),
    require('../../assets/backgrounds/nightpath.jpeg'),
    require('../../assets/backgrounds/village.jpeg'),
    require('../../assets/backgrounds/waterfall.jpeg'),
    require('../../assets/backgrounds/wheatfield.jpeg'),
  ];
  
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
}
