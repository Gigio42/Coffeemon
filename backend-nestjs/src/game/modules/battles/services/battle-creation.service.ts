import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleCacheService } from '../../../shared/cache/services/battle-cache.service';
import {
  BattleCreatedEvent,
  MatchPairFoundEvent,
  PlayerWantsToBattleBotCommand,
} from '../../../shared/events/game.events';
import { BotPlayerService } from '../../bot/services/bot-player.service';
import { StatsCalculatorService } from '../../coffeemon/services/stats-calculator.service';
import { Player } from '../../player/entities/player.entity';
import { PlayerCoffeemons } from '../../player/entities/playerCoffeemons.entity';
import { PlayerService } from '../../player/player.service';
import { Battle } from '../entities/battle.entity';
import { BattleState, CoffeemonState, PlayerBattleState } from '../types/battle-state.types';
import { BattleStatus, TurnPhase } from '../types/enums';

@Injectable()
export class BattleCreationService {
  constructor(
    @InjectRepository(Battle) private readonly repo: Repository<Battle>,
    private readonly playerService: PlayerService,
    private readonly botPlayerService: BotPlayerService,
    private readonly battleCache: BattleCacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly statsCalculator: StatsCalculatorService
  ) {}

  @OnEvent('match.pair.found')
  async createPvpBattle(event: MatchPairFoundEvent): Promise<void> {
    const battle = this.repo.create({
      player1Id: event.player1Id,
      player2Id: event.player2Id,
      player1SocketId: event.player1SocketId,
      player2SocketId: event.player2SocketId,
      status: 'ACTIVE',
    });
    const savedBattle = await this.repo.save(battle);

    const [player1, player2] = await Promise.all([
      this.playerService.findOne(event.player1Id),
      this.playerService.findOne(event.player2Id),
    ]);

    const [team1, team2] = await Promise.all([
      this.playerService.getPlayerParty(event.player1Id),
      this.playerService.getPlayerParty(event.player2Id),
    ]);

    const initialState: BattleState = {
      player1Id: event.player1Id,
      player2Id: event.player2Id,
      player1SocketId: event.player1SocketId,
      player2SocketId: event.player2SocketId,
      player1: this.mapTeamToState(team1, player1),
      player2: this.mapTeamToState(team2, player2),
      turn: 1,
      battleStatus: BattleStatus.ACTIVE,
      events: [],
      turnPhase: TurnPhase.SELECTION,
      pendingActions: { [event.player1Id]: null, [event.player2Id]: null },
    };

    await this.battleCache.set(savedBattle.id, initialState);
    this.eventEmitter.emit('battle.created', new BattleCreatedEvent(savedBattle.id, initialState));
  }

  @OnEvent('bot.match.join.command')
  async createPveBattle(command: PlayerWantsToBattleBotCommand): Promise<void> {
    const botId = -Math.floor(Date.now() / 1000);
    const { state: botPlayerState, profile: botProfile } =
      await this.botPlayerService.createBotPlayerStateFromProfile(command.botProfileId);

    const battle = this.repo.create({
      player1Id: command.playerId,
      player2Id: botId,
      player1SocketId: command.socketId,
      player2SocketId: 'bot',
      status: 'ACTIVE',
    });
    const savedBattle = await this.repo.save(battle);

    const player1 = await this.playerService.findOne(command.playerId);
    const player1Team = await this.playerService.getPlayerParty(command.playerId);

    const initialState: BattleState = {
      player1Id: command.playerId,
      player2Id: botId,
      player1SocketId: command.socketId,
      player2SocketId: 'bot',
      player1: this.mapTeamToState(player1Team, player1),
      player2: botPlayerState,
      turn: 1,
      battleStatus: BattleStatus.ACTIVE,
      events: [],
      isBotBattle: true,
      botStrategy: botProfile.strategy,
      turnPhase: TurnPhase.SELECTION,
      pendingActions: { [command.playerId]: null, [botId]: null },
    };

    await this.battleCache.set(savedBattle.id, initialState);
    this.eventEmitter.emit('battle.created', new BattleCreatedEvent(savedBattle.id, initialState));
  }

  private mapTeamToState(team: PlayerCoffeemons[], player: Player): PlayerBattleState {
    return {
      activeCoffeemonIndex: null,
      hasSelectedCoffeemon: false,
      inventory: player.inventory || {},
      coffeemons: team.map((c): CoffeemonState => {
        const calculatedStats = this.statsCalculator.calculateAllStats(c.coffeemon, c.level, c.evs);
        const maxHp = calculatedStats.hp;

        return {
          id: c.id,
          name: c.coffeemon.name,
          types: c.coffeemon.types,
          currentHp: maxHp,
          isFainted: false,
          canAct: true,
          maxHp: maxHp,
          attack: calculatedStats.attack,
          defense: calculatedStats.defense,
          speed: calculatedStats.speed,
          modifiers: {
            attackModifier: 1.0,
            defenseModifier: 1.0,
            dodgeChance: 0.0,
            hitChance: 1.0,
            critChance: 0.05,
            blockChance: 0.0,
          },
          moves: c.learnedMoves.sort((a, b) => a.slot - b.slot).map((lm) => lm.move),
          statusEffects: [],
        };
      }),
    };
  }
}
