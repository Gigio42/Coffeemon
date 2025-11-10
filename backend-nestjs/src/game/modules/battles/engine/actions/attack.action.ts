import { Injectable } from '@nestjs/common';
import { Move, moveType } from '../../../moves/entities/move.entity';
import { CoffeemonState, PlayerBattleState } from '../../types/battle-state.types';
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
    const { targetCoffeemonIndex } = payload;

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

    // se for suporte, não faz cálculo de dano
    if (move.type === moveType.SUPPORT) {
      if (move.effects) {
        const effectNotifications = this.processMoveEffects(
          move,
          attackingMon,
          defendingMon,
          attacker,
          targetCoffeemonIndex,
          0
        );
        notifications.push(...effectNotifications);
      }
      return { advanceTurn: true, notifications };
    }

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
    // Formula original do pokemon. TODO implementar depois de ter níveis
    //let damage = (((2 * attackerLevel) / 5 + 2) * move.power * (modifiedAttack / modifiedDefense)) / 50 + 2;
    //const attackerLevel = this.getLevelFromName(attackingMon.name); //TODO redefinir quando implementar níveis
    const modifiedAttack = attackingMon.attack * attackingMon.modifiers.attackModifier;
    const modifiedDefense = defendingMon.defense * defendingMon.modifiers.defenseModifier;

    let damage = move.power * (modifiedAttack / modifiedDefense) * 0.4;

    // --- Multiplicadores ---

    // TODO: Adicionar multiplicador de tipo aqui no futuro (Sistema elemental)

    // Critical Hit
    let isCriticalHit = false;
    if (Math.random() < attackingMon.modifiers.critChance) {
      damage *= 1.5;
      isCriticalHit = true;
    }

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

    if (move.effects && move.effects.length > 0) {
      const effectNotifications = this.processMoveEffects(
        move,
        attackingMon,
        defendingMon,
        attacker,
        targetCoffeemonIndex,
        finalDamage
      );
      notifications.push(...effectNotifications);
    }

    return { advanceTurn: true, notifications };
  }

  private processMoveEffects(
    move: Move,
    attackingMon: CoffeemonState,
    defenderMon: CoffeemonState,
    attackerPlayer: PlayerBattleState,
    targetCoffeemonIndex: number | undefined,
    finalDamage: number = 0
  ): ActionEventNotification[] {
    const newNotifications: ActionEventNotification[] = [];

    if (!move.effects || move.effects.length === 0) {
      return newNotifications;
    }

    move.effects.forEach((effect) => {
      if (Math.random() <= effect.chance) {
        let target: CoffeemonState;

        switch (effect.target) {
          case 'self':
            target = attackingMon;
            break;

          case 'enemy':
            target = defenderMon;
            break;

          case 'ally': {
            const isDistinctAlly =
              targetCoffeemonIndex !== undefined &&
              targetCoffeemonIndex !== attackerPlayer.activeCoffeemonIndex;

            if (isDistinctAlly) {
              target = attackerPlayer.coffeemons[targetCoffeemonIndex];
            } else {
              target = attackingMon;
            }
            break;
          }

          default:
            console.warn(
              `[AttackAction] Target type '${String(effect.target)}' unknown, defaulting to self.`
            );
            target = attackingMon;
            break;
        }

        if (move.type === moveType.ATTACK && effect.type === 'lifesteal') {
          const lifestealPercentage = effect.value ?? 0.5;
          const lifestealHeal = Math.floor(finalDamage * lifestealPercentage);

          if (lifestealHeal > 0) {
            const newHp = Math.min(attackingMon.maxHp, attackingMon.currentHp + lifestealHeal);
            const actualHeal = newHp - attackingMon.currentHp;
            attackingMon.currentHp = newHp;

            newNotifications.push({
              eventKey: 'STATUS_HEAL',
              payload: {
                coffeemonName: attackingMon.name,
                amount: actualHeal,
                effectType: 'lifesteal',
              },
            });
          }
        } else if (effect.type !== 'lifesteal') {
          const effectNotifications = this.statusEffectsService.applyEffect(effect, target);
          newNotifications.push(...effectNotifications);
        }
      }
    });

    return newNotifications;
  }
}
