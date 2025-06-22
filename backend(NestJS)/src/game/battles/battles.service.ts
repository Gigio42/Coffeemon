import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/battle.entity';
import { PlayerService } from '../player/player.service';
import { BattleStatus, CoffeemonState } from './types/batlle.types';
import { PlayerCoffeemon } from '../player/entities/playercoffeemon.entity';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle) private repo: Repository<Battle>,
    private playerService: PlayerService
  ) {}

  async createBattle(p1: number, p2: number, s1: string, s2: string): Promise<Battle> {
    const state = await this.buildInitialState(p1, p2);
    const battle = this.repo.create({
      player1Id: p1,
      player2Id: p2,
      player1SocketId: s1,
      player2SocketId: s2,
      battleState: state,
      status: BattleStatus.ACTIVE,
    });
    return this.repo.save(battle);
  }

  private async buildInitialState(p1: number, p2: number) {
    const [team1, team2] = await Promise.all([
      this.playerService.getPlayerParty(p1),
      this.playerService.getPlayerParty(p2),
    ]);
    return {
      player1: this.mapTeam(team1),
      player2: this.mapTeam(team2),
      turn: 1,
      currentPlayerId: p1,
      battleStatus: BattleStatus.ACTIVE,
    };
  }

  private mapTeam(team: PlayerCoffeemon[]): {
    activeCoffeemonIndex: 0;
    coffeemons: CoffeemonState[];
  } {
    return {
      activeCoffeemonIndex: 0,
      coffeemons: team.map((c) => ({
        id: c.id,
        name: c.coffeemon.name,
        currentHp: c.coffeemon.baseHp,
        maxHp: c.coffeemon.baseHp,
        attack: c.coffeemon.baseAttack,
        defense: c.coffeemon.baseDefense,
        moves: [
          ...(c.coffeemon.moves || []).map((m) => ({
            id: m.id,
            name: m.name,
            power: m.power,
            type: m.type,
            description: m.description ?? '',
          })),
          ...(c.customMoves || []).map((m) => ({
            id: m.id,
            name: m.name,
            power: m.power,
            type: m.type,
            description: m.description ?? '',
          })),
        ],
      })),
    };
  }

  async move(battleId: string, socketId: string, moveId: number): Promise<Battle> {
    const battle = await this.repo.findOneByOrFail({ id: battleId });

    if (battle.battleState.battleStatus === 'FINISHED') {
      throw new Error('Battle already finished');
    }

    const isPlayer1 = battle.player1SocketId === socketId;
    const isPlayer2 = battle.player2SocketId === socketId;

    if (!isPlayer1 && !isPlayer2) {
      throw new Error('You are not part of this battle');
    }

    const currentPlayerId = battle.battleState.currentPlayerId;
    const actingPlayerId = isPlayer1 ? battle.player1Id : battle.player2Id;

    if (actingPlayerId !== currentPlayerId) {
      throw new Error('Not your turn');
    }

    const attacker = isPlayer1 ? battle.battleState.player1 : battle.battleState.player2;
    const defender = isPlayer1 ? battle.battleState.player2 : battle.battleState.player1;

    const attackingMon = attacker.coffeemons[attacker.activeCoffeemonIndex];
    const defendingMon = defender.coffeemons[defender.activeCoffeemonIndex];

    const move = attackingMon.moves.find((m) => m.id === moveId);
    if (!move) {
      throw new Error('Invalid move');
    }

    // Calcula dano
    const rawDamage = move.power + attackingMon.attack - defendingMon.defense;
    const damage = Math.max(1, rawDamage);
    defendingMon.currentHp = Math.max(0, defendingMon.currentHp - damage);

    // Verifica KO
    if (defendingMon.currentHp <= 0) {
      const nextAliveIndex = defender.coffeemons.findIndex(
        (c, i) => c.currentHp > 0 && i !== defender.activeCoffeemonIndex
      );

      if (nextAliveIndex !== -1) {
        defender.activeCoffeemonIndex = nextAliveIndex;
      } else {
        battle.battleState.battleStatus = 'FINISHED';
      }
    }

    // Avança turno / Finaliza batalha
    if (battle.battleState.battleStatus === 'FINISHED') {
      battle.status = 'FINISHED';
      battle.winnerId = actingPlayerId;
    } else {
      battle.battleState.turn++;
      battle.battleState.currentPlayerId = isPlayer1 ? battle.player2Id : battle.player1Id;
    }

    return this.repo.save(battle);
  }
}
