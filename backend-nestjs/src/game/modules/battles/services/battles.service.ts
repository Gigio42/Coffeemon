import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleCacheService } from '../../../shared/cache/services/battle-cache.service';
import {
  BattleActionCommand,
  BattleCreatedEvent,
  BattleEndedEvent,
  BattleStateUpdatedEvent,
  ExecuteBotTurnCommand,
} from '../../../shared/events/game.events';
import { BotService } from '../../bot/services/bot.service';
import { BattlePhaseManager } from '../engine/battle-phase-manager.service';
import { Battle } from '../entities/battle.entity';
import { IGameMode } from '../game-modes/game-mode.interface';
import { PveGameMode } from '../game-modes/pve.game-mode';
import { PvpGameMode } from '../game-modes/pvp.game-mode';
import { BattleActionUnion } from '../types/battle-actions.types';
import { BattleState } from '../types/battle-state.types';
import { BattleStatus, TurnPhase } from '../types/enums';

@Injectable()
export class BattleService implements OnModuleInit {
  private activeGameModes = new Map<string, IGameMode>();

  constructor(
    @InjectRepository(Battle) private readonly repo: Repository<Battle>,
    private readonly battleCache: BattleCacheService,
    private readonly battlePhaseManager: BattlePhaseManager,
    private readonly eventEmitter: EventEmitter2,
    private readonly botService: BotService,
    private readonly pvpGameMode: PvpGameMode,
    private readonly pveGameMode: PveGameMode
  ) {}

  onModuleInit() {
    this.pvpGameMode.setBattleService(this);
    this.pveGameMode.setBattleService(this);

    this.eventEmitter.on('battle.created', ({ battleId, battleState }: BattleCreatedEvent) => {
      this.activeGameModes.set(
        battleId,
        battleState.isBotBattle ? this.pveGameMode : this.pvpGameMode
      );
      if (battleState.isBotBattle) {
        this.handleBotInitialSelection(battleId, battleState).catch((err) => {
          console.error(
            `[BattleService] Failed to handle bot initial selection for battle ${battleId}:`,
            err
          );
        });
      }
    });

    this.eventEmitter.on('battle.ended', ({ battleId }: { battleId: string }) =>
      this.activeGameModes.delete(battleId)
    );
    this.eventEmitter.on('battle.cancelled', ({ battleId }: { battleId: string }) =>
      this.activeGameModes.delete(battleId)
    );
  }

  public async submitAction(
    battleId: string,
    playerId: number,
    action: BattleActionUnion
  ): Promise<void> {
    const battleState = await this.battleCache.get(battleId);
    if (!battleState) {
      throw new NotFoundException(`Battle with ID ${battleId} not found in cache.`);
    }

    const initialTurn = battleState.turn;
    const initialTurnPhase = battleState.turnPhase;

    const updatedState = await this.battlePhaseManager.submitAction(battleState, playerId, action);

    if (updatedState.battleStatus === BattleStatus.FINISHED) {
      await this.finalizeBattleInDb(battleId, updatedState);
    } else {
      await this.battleCache.set(battleId, updatedState);
    }

    const turnAdvanced = updatedState.turn > initialTurn;
    const phaseChanged = updatedState.turnPhase !== initialTurnPhase;
    const battleEnded = updatedState.battleStatus === BattleStatus.FINISHED;
    const turnWasResolved = turnAdvanced || phaseChanged || battleEnded;

    const numSubmittedActions = Object.values(updatedState.pendingActions).filter(
      (act) => act !== null
    ).length;
    const isFirstActionOfTurn =
      initialTurnPhase === TurnPhase.SUBMISSION && numSubmittedActions === 1;

    if (turnWasResolved || isFirstActionOfTurn) {
      this.emitStateUpdate(battleId, updatedState);
    }
  }

  public emitStateUpdate(battleId: string, state: BattleState): void {
    if (state.battleStatus === BattleStatus.FINISHED) {
      this.eventEmitter.emit(
        'battle.ended',
        new BattleEndedEvent(battleId, state.winnerId!, state)
      );
    } else {
      this.eventEmitter.emit('battle.state.updated', new BattleStateUpdatedEvent(battleId, state));
    }
  }

  private async handleBotInitialSelection(
    battleId: string,
    battleState: BattleState
  ): Promise<void> {
    const botId = battleState.player2Id;
    const botAction = this.botService.getBotInitialSelection(
      battleState,
      botId,
      battleState.botStrategy || 'random'
    );

    await this.submitAction(battleId, botId, {
      ...botAction,
      battleId,
    });
  }

  @OnEvent('battle.action.command')
  async delegatePlayerAction(command: BattleActionCommand): Promise<void> {
    const gameMode = this.activeGameModes.get(command.battleId);
    if (gameMode) {
      await gameMode.handlePlayerAction(command);
    } else {
      console.error(`No active game mode for battle ${command.battleId}`);
    }
  }

  @OnEvent('execute.bot.turn')
  async handleBotTurn(command: ExecuteBotTurnCommand): Promise<void> {
    const battleState = await this.battleCache.get(command.battleId);
    if (
      !battleState ||
      battleState.battleStatus === BattleStatus.FINISHED ||
      battleState.turnPhase !== TurnPhase.SUBMISSION
    ) {
      return;
    }

    const botId =
      battleState.player2Id < 0
        ? battleState.player2Id
        : battleState.player1Id < 0
          ? battleState.player1Id
          : null;
    if (!botId || battleState.pendingActions[botId]) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botAction = this.botService.getBotAction(
      battleState,
      botId,
      battleState.botStrategy || 'random'
    );

    await this.submitAction(command.battleId, botId, {
      ...botAction,
      battleId: command.battleId,
    });
  }

  private async finalizeBattleInDb(battleId: string, state: BattleState): Promise<void> {
    const battle = await this.repo.findOneBy({ id: battleId });
    if (!battle) return;
    battle.status = 'FINISHED';
    battle.winnerId = state.winnerId!;
    battle.endedAt = new Date();
    await this.repo.save(battle);
    await this.battleCache.delete(battleId);
  }
}
