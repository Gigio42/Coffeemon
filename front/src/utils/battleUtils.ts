import { BattleState } from '../../types';

/**
 * Remove o sufixo de nível do nome do Coffeemon
 */
export function getBaseName(name: string): string {
  if (!name) return '';
  return name.split(' (Lvl')[0];
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
    default: require('../../assets/scenarios/field.png'),
    forest: require('../../assets/scenarios/forest.png'),
    city: require('../../assets/scenarios/city.png'),
  };

  if (scenarioName && scenarioImages[scenarioName as keyof typeof scenarioImages]) {
    return scenarioImages[scenarioName as keyof typeof scenarioImages];
  }
  return scenarioImages.default;
}
