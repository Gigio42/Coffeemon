/**
 * Validações do lado do cliente para ações de batalha
 * Espelha as regras de negócio do BattleValidatorService (backend)
 */

import { PlayerState, Coffeemon } from '../types';

/**
 * Categoria de efeitos de status (deve corresponder ao backend)
 */
export enum StatusEffectCategory {
  BLOCKING = 'blocking',
  DAMAGING = 'damaging',
  DEBUFF = 'debuff',
}

/**
 * Verifica se um Coffeemon tem efeitos de status bloqueantes
 */
export function hasBlockingEffect(coffeemon: Coffeemon | null | undefined): boolean {
  if (!coffeemon || !coffeemon.statusEffects) {
    return false;
  }

  // Lista de tipos de status que bloqueiam ações (do backend)
  const blockingTypes = ['paralysis', 'sleep', 'freeze', 'flinch'];
  
  return coffeemon.statusEffects.some((effect) =>
    blockingTypes.includes(effect.type.toLowerCase())
  );
}

/**
 * Valida se um Coffeemon pode atacar
 * Regras do backend: validateActorState
 */
export function canCoffeemonAttack(
  playerState: PlayerState | null | undefined
): { valid: boolean; reason?: string } {
  // Validação 1: Jogador tem estado válido
  if (!playerState) {
    return { valid: false, reason: 'Estado do jogador inválido' };
  }

  // Validação 2: Tem Coffeemon ativo
  if (playerState.activeCoffeemonIndex === null || playerState.activeCoffeemonIndex === undefined) {
    return { valid: false, reason: 'Nenhum Coffeemon ativo' };
  }

  // Validação 3: Coffeemon ativo existe
  const activeMon = playerState.coffeemons?.[playerState.activeCoffeemonIndex];
  if (!activeMon) {
    return { valid: false, reason: 'Coffeemon ativo não encontrado' };
  }

  // Validação 4: Coffeemon não está derrotado
  if (activeMon.isFainted || activeMon.currentHp <= 0) {
    return { valid: false, reason: `${activeMon.name} está derrotado! Troque de Coffeemon.` };
  }

  // Validação 5: Não tem efeitos bloqueantes
  if (hasBlockingEffect(activeMon)) {
    const blockingEffect = activeMon.statusEffects?.find((e) =>
      ['paralysis', 'sleep', 'freeze', 'flinch'].includes(e.type.toLowerCase())
    );
    return {
      valid: false,
      reason: `${activeMon.name} não pode atacar devido a ${blockingEffect?.type || 'status'}!`,
    };
  }

  return { valid: true };
}

/**
 * Valida se pode trocar para um Coffeemon específico
 * Regras do backend: validateSwitchPayload
 */
export function canSwitchToCoffeemon(
  playerState: PlayerState | null | undefined,
  targetIndex: number
): { valid: boolean; reason?: string } {
  // Validação 1: Jogador tem estado válido
  if (!playerState || !playerState.coffeemons) {
    return { valid: false, reason: 'Estado do jogador inválido' };
  }

  // Validação 2: Index válido
  if (targetIndex < 0 || targetIndex >= playerState.coffeemons.length) {
    return { valid: false, reason: 'Índice de Coffeemon inválido' };
  }

  // Validação 3: Não é o mesmo Coffeemon
  if (targetIndex === playerState.activeCoffeemonIndex) {
    return { valid: false, reason: 'Este Coffeemon já está em batalha!' };
  }

  // Validação 4: Coffeemon de destino existe
  const targetMon = playerState.coffeemons[targetIndex];
  if (!targetMon) {
    return { valid: false, reason: 'Coffeemon não encontrado' };
  }

  // Validação 5: Coffeemon de destino não está derrotado
  if (targetMon.isFainted || targetMon.currentHp <= 0) {
    return { valid: false, reason: `${targetMon.name} está derrotado!` };
  }

  return { valid: true };
}

/**
 * Valida se pode selecionar um Coffeemon inicial
 * Regras do backend: validateSelectCoffeemonPayload
 */
export function canSelectInitialCoffeemon(
  playerState: PlayerState | null | undefined,
  coffeemonIndex: number
): { valid: boolean; reason?: string } {
  // Validação 1: Jogador tem estado válido
  if (!playerState || !playerState.coffeemons) {
    return { valid: false, reason: 'Estado do jogador inválido' };
  }

  // Validação 2: Já selecionou
  if (playerState.hasSelectedCoffeemon) {
    return { valid: false, reason: 'Você já selecionou seu Coffeemon inicial!' };
  }

  // Validação 3: Index válido
  if (coffeemonIndex < 0 || coffeemonIndex >= playerState.coffeemons.length) {
    return { valid: false, reason: 'Índice de Coffeemon inválido' };
  }

  // Validação 4: Coffeemon existe
  const coffeemon = playerState.coffeemons[coffeemonIndex];
  if (!coffeemon) {
    return { valid: false, reason: 'Coffeemon não encontrado' };
  }

  // Validação 5: Coffeemon não está derrotado
  if (coffeemon.isFainted || coffeemon.currentHp <= 0) {
    return { valid: false, reason: `${coffeemon.name} está derrotado!` };
  }

  return { valid: true };
}

/**
 * Valida se pode usar um movimento específico
 * Regras do backend: validateAttackPayload
 */
export function canUseMove(
  playerState: PlayerState | null | undefined,
  moveId: number
): { valid: boolean; reason?: string } {
  // Primeiro verifica se pode atacar
  const attackValidation = canCoffeemonAttack(playerState);
  if (!attackValidation.valid) {
    return attackValidation;
  }

  const activeMon = playerState!.coffeemons![playerState!.activeCoffeemonIndex!];

  // Validação: Move existe
  const move = activeMon.moves?.find((m) => m.id === moveId);
  if (!move) {
    return {
      valid: false,
      reason: `${activeMon.name} não conhece este movimento!`,
    };
  }

  return { valid: true };
}

/**
 * Valida se é a fase correta para uma ação
 * Regras do backend: validatePhase
 */
export function isCorrectPhaseForAction(
  turnPhase: string | undefined,
  actionType: 'attack' | 'switch' | 'select_coffeemon'
): { valid: boolean; reason?: string } {
  if (!turnPhase) {
    return { valid: false, reason: 'Fase da batalha desconhecida' };
  }

  if (turnPhase === 'SELECTION') {
    if (actionType !== 'select_coffeemon') {
      return {
        valid: false,
        reason: 'Você deve selecionar seu Coffeemon inicial primeiro!',
      };
    }
  } else if (turnPhase === 'SUBMISSION') {
    if (actionType === 'select_coffeemon') {
      return {
        valid: false,
        reason: 'Fase de seleção inicial já passou!',
      };
    }
  } else {
    return { valid: false, reason: 'Aguarde a fase de ação!' };
  }

  return { valid: true };
}

/**
 * Obtém lista de Coffeemons disponíveis para troca
 */
export function getAvailableCoffeemonsForSwitch(
  playerState: PlayerState | null | undefined
): Coffeemon[] {
  if (!playerState || !playerState.coffeemons) {
    return [];
  }

  return playerState.coffeemons.filter((mon, idx) => {
    // Não é o ativo
    if (idx === playerState.activeCoffeemonIndex) {
      return false;
    }
    // Não está derrotado
    if (mon.isFainted || mon.currentHp <= 0) {
      return false;
    }
    return true;
  });
}
