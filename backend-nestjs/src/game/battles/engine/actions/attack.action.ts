import { Injectable } from '@nestjs/common';
import { BattleActionType } from '../../types/batlle.types';
import { StatusEffectsService } from '../effects/status-effects.service';
import {
  ActionEventNotification,
  BattleActionContext,
  BattleActionResult,
  IBattleAction,
} from './battle-action-interface';
import { moveType } from 'src/game/coffeemon/Types/coffeemon.types';

@Injectable()
export class AttackAction implements IBattleAction<BattleActionType.ATTACK> {
  constructor(private readonly statusEffectsService: StatusEffectsService) {}
  async execute(
    context: BattleActionContext<BattleActionType.ATTACK>
  ): Promise<BattleActionResult> {
    const { battleState, playerId, payload } = context;
    const isPlayer1 = battleState.player1Id === playerId;
    const attacker = isPlayer1 ? battleState.player1 : battleState.player2;
    const defender = isPlayer1 ? battleState.player2 : battleState.player1;

    const attackingMon = attacker.coffeemons[attacker.activeCoffeemonIndex];
    const defendingMon = defender.coffeemons[defender.activeCoffeemonIndex];

    const move = attackingMon.moves.find((m) => m.id === payload.moveId);
    if (!move) {
      return {
        advanceTurn: false,
        notifications: [
          {
            eventKey: 'ACTION_ERROR',
            payload: { playerId, error: 'Invalid Move' },
          },
        ],
      };
    }

    if (move.type !== moveType.ATTACK) {
      return {
        advanceTurn: false,
        notifications: [
          {
            eventKey: 'ACTION_ERROR',
            payload: { playerId, error: 'The selected move is not an attack.' },
          },
        ],
      };
    }

    const notifications: ActionEventNotification[] = [];

    // Verificação de (Dodge/Miss)
    if (
      Math.random() < defendingMon.modifiers.dodgeChance ||
      attackingMon.modifiers.hitChance < Math.random()
    ) {
      return {
        advanceTurn: true,
        notifications: [
          {
            eventKey: 'ATTACK_MISS',
            payload: {
              attackerName: attackingMon.name,
              targetName: defendingMon.name,
            },
          },
        ],
      };
    }

    // Calcula Dano
    let damageMultiplier = 1.0;
    let isCriticalHit = false;

    // Critical Hit
    if (Math.random() < attackingMon.modifiers.critChance) {
      damageMultiplier = 1.5;
      isCriticalHit = true;
    }

    // Modificadores de Atributos (Buffs/Debuffs)
    const modifiedAttack = attackingMon.attack * attackingMon.modifiers.attackModifier;
    const modifiedDefense = defendingMon.defense * defendingMon.modifiers.defenseModifier;

    let rawDamage = (move.power + modifiedAttack - modifiedDefense) * damageMultiplier;

    // Bloqueio (Block)
    if (Math.random() < defendingMon.modifiers.blockChance) {
      rawDamage *= 0.5;
      notifications.push({
        eventKey: 'ATTACK_BLOCKED',
        payload: { targetName: defendingMon.name },
      });
    }

    const damage = Math.max(1, Math.floor(rawDamage));
    defendingMon.currentHp = Math.max(0, defendingMon.currentHp - damage);

    const hitPayload = {
      playerId,
      attackerName: attackingMon.name,
      targetName: defendingMon.name,
      damage,
    };

    // Add notificação de dano correta (CRÍTICO / NORMAL)
    if (isCriticalHit) {
      notifications.push({
        eventKey: 'ATTACK_CRIT',
        payload: hitPayload,
      });
    } else {
      notifications.push({
        eventKey: 'ATTACK_HIT',
        payload: hitPayload,
      });
    }

    // Atualiza se o coffeemon foi de base
    if (defendingMon.currentHp <= 0) {
      defendingMon.isFainted = true;
      defendingMon.canAct = false;
      notifications.push({
        eventKey: 'COFFEEMON_FAINTED',
        payload: {
          playerId,
          coffeemonName: defendingMon.name,
        },
      });
    }

    // Aplica efeitos de status do golpe
    if (move.effects) {
      move.effects.forEach((effect) => {
        if (Math.random() <= effect.chance) {
          const target = effect.target === 'self' ? attackingMon : defendingMon;
          const effectNotifications = this.statusEffectsService.applyEffect(effect, target);
          notifications.push(...effectNotifications);
        }
      });
    }

    return Promise.resolve({
      advanceTurn: true,
      notifications,
    });
  }
}
