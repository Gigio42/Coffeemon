/**
 * Gera mensagens detalhadas e amigáveis para eventos de batalha
 * Baseado nos tipos de eventos do BattleEventRegistry do backend
 */

export function getEventMessage(event: any): string {
  // Sempre usar mensagem do backend se disponível
  if (event.message) {
    return event.message;
  }

  // Fallbacks curtos para casos extremos
  const { type } = event;
  switch (type) {
    case 'ATTACK_HIT': return 'atacou!';
    case 'ATTACK_CRIT': return 'crítico!';
    case 'ATTACK_MISS': return 'errou!';
    case 'ATTACK_BLOCKED': return 'bloqueou!';
    case 'COFFEEMON_FAINTED': return 'derrotado!';
    case 'STATUS_APPLIED': return 'afetado!';
    case 'STATUS_DAMAGE': return 'dano!';
    case 'STATUS_REMOVED': return 'curado!';
    case 'SWITCH_SUCCESS': return 'entrou!';
    case 'SWITCH_FAILED_SAME_COFFEEMON': return 'mesmo!';
    case 'SWITCH_FAILED_FAINTED_COFFEEMON': return 'derrotado!';
    case 'SWITCH_FAILED_INVALID_INDEX': return 'inválido!';
    case 'KNOCKOUT_BLOCK': return 'troque!';
    case 'STATUS_BLOCK': return 'paralisado!';
    case 'TURN_END': return 'turno!';
    case 'BATTLE_FINISHED': return 'terminou!';
    case 'ACTION_ERROR': return 'erro!';
    default: return 'evento!';
  }
}

/**
 * Retorna nome amigável para status effects
 */
function getStatusName(effectType: string): string {
  const statusNames: Record<string, string> = {
    burn: 'Queimadura',
    poison: 'Veneno',
    sleep: 'Sono',
    freeze: 'Congelamento',
    paralysis: 'Paralisia',
    attackUp: 'Aumento de Ataque',
    defenseUp: 'Aumento de Defesa',
    attackDown: 'Redução de Ataque',
    defenseDown: 'Redução de Defesa',
  };

  return statusNames[effectType] || effectType;
}
