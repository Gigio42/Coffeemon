import { BattleState } from '../types';
import { getServerUrl } from './config';
import {
  backgroundKeys,
  backgroundSources,
  DEFAULT_BACKGROUND_KEY,
  getBackgroundSource,
} from '../../assets/backgrounds';

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
  return getBackgroundSource(scenarioName ?? DEFAULT_BACKGROUND_KEY);
}

/**
 * Seleciona um cenário aleatório baseado no battleId (consistente para ambos os jogadores)
 */
export function getBattleScenario(battleId?: string) {
  const scenarioNames = backgroundKeys.length
    ? backgroundKeys
    : [DEFAULT_BACKGROUND_KEY];

  if (!battleId) {
    return getBackgroundSource(DEFAULT_BACKGROUND_KEY);
  }

  // Usar o battleId como seed para seleção consistente
  let hash = 0;
  for (let i = 0; i < battleId.length; i++) {
    const char = battleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converte para 32 bits
  }

  const scenarioIndex = Math.abs(hash) % scenarioNames.length;
  return getBackgroundSource(scenarioNames[scenarioIndex]);
}

/**
 * Seleciona um cenário aleatório para matchmaking (muda sempre)
 */
export function getRandomScenario() {
  if (!backgroundSources.length) {
    return getBackgroundSource(DEFAULT_BACKGROUND_KEY);
  }

  const randomIndex = Math.floor(Math.random() * backgroundSources.length);
  return backgroundSources[randomIndex];
}
