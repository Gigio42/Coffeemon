import { Injectable } from '@nestjs/common';
import { moveType } from 'src/game/modules/coffeemon/Types/coffeemon.types';
import { BattleActionType } from '../../types/enums';
import { StatusEffectsService } from '../effects/status-effects.service';
import {
  ActionEventNotification,
  BattleActionContext,
  BattleActionResult,
  IBattleAction,
} from './battle-action-interface';

@Injectable()
export class AttackAction implements IBattleAction<BattleActionType.ATTACK> {
  readonly priority = 5;

  constructor(private readonly statusEffectsService: StatusEffectsService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(
    context: BattleActionContext<BattleActionType.ATTACK>
  ): Promise<BattleActionResult> {
    const notifications: ActionEventNotification[] = [];
    const { battleState, playerId, payload } = context;

    const isPlayer1 = battleState.player1Id === playerId;
    const attacker = isPlayer1 ? battleState.player1 : battleState.player2;
    const defender = isPlayer1 ? battleState.player2 : battleState.player1;

    if (attacker.activeCoffeemonIndex === null || defender.activeCoffeemonIndex === null) {
      return {
        advanceTurn: false,
        notifications: [
          {
            eventKey: 'ACTION_ERROR',
            payload: { playerId, error: 'A player has not selected a Coffeemon yet.' },
          },
        ],
      };
    }

    const attackingMon = attacker.coffeemons[attacker.activeCoffeemonIndex];
    const defendingMon = defender.coffeemons[defender.activeCoffeemonIndex];

    const move = attackingMon.moves.find((m) => m.id === payload.moveId);
    if (!move) {
      return {
        advanceTurn: false,
        notifications: [{ eventKey: 'ACTION_ERROR', payload: { playerId, error: 'Invalid Move' } }],
      };
    }

    // implementar após resolver tipos de move com status
    // if (move.type !== moveType.ATTACK) {
    //   return {
    //     advanceTurn: false,
    //     notifications: [
    //       {
    //         eventKey: 'ACTION_ERROR',
    //         payload: { playerId, error: 'The selected move is not an attack.' },
    //       },
    //     ],
    //   };
    // }

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
            payload: { attackerName: attackingMon.name, targetName: defendingMon.name },
          },
        ],
      };
    }

    // --- FÓRMULA DE DANO ---
    //const attackerLevel = this.getLevelFromName(attackingMon.name); //TODO redefinir
    const modifiedAttack = attackingMon.attack * attackingMon.modifiers.attackModifier;
    const modifiedDefense = defendingMon.defense * defendingMon.modifiers.defenseModifier;

    //let damage = (((2 * attackerLevel) / 5 + 2) * move.power * (modifiedAttack / modifiedDefense)) / 50 + 2; //TODO Está usando a do Pokémon, criar uma própria
    let damage = move.power * (modifiedAttack / modifiedDefense) * 1.2;

    // --- Multiplicadores ---
    // Critical Hit
    let isCriticalHit = false;
    if (Math.random() < attackingMon.modifiers.critChance) {
      damage *= 1.5;
      isCriticalHit = true;
    }

    // TODO: Adicionar multiplicador de tipo aqui no futuro (Sistema elemental)

    // Bloqueio (Block)
    if (Math.random() < defendingMon.modifiers.blockChance) {
      damage *= 0.5;
      notifications.push({
        eventKey: 'ATTACK_BLOCKED',
        payload: { targetName: defendingMon.name },
      });
    }

    const finalDamage = Math.max(1, Math.floor(damage));
    defendingMon.currentHp = Math.max(0, defendingMon.currentHp - finalDamage);

    const hitPayload = {
      playerId,
      attackerName: attackingMon.name,
      targetName: defendingMon.name,
      damage: finalDamage,
    };

    // Add notificação de dano correta (CRÍTICO / NORMAL)
    if (isCriticalHit) {
      notifications.push({ eventKey: 'ATTACK_CRIT', payload: hitPayload });
    } else {
      notifications.push({ eventKey: 'ATTACK_HIT', payload: hitPayload });
    }

    // Atualiza se o coffeemon foi de base
    if (defendingMon.currentHp <= 0) {
      defendingMon.isFainted = true;
      defendingMon.canAct = false;
      notifications.push({
        eventKey: 'COFFEEMON_FAINTED',
        payload: { playerId, coffeemonName: defendingMon.name },
      });
    }

    if (move.effects) {
      move.effects.forEach((effect) => {
        if (Math.random() <= effect.chance) {
          const target = effect.target === 'self' ? attackingMon : defendingMon;
          const effectNotifications = this.statusEffectsService.applyEffect(effect, target);
          notifications.push(...effectNotifications);
        }
      });
    }

    return { advanceTurn: true, notifications };
  }

  //TODO pegar da forma certa
  private getLevelFromName(name: string): number {
    const match = name.match(/\(Lvl (\d+)\)/);
    return match ? parseInt(match[1], 10) : 1;
  }
}
