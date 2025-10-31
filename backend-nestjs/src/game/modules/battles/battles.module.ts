import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameAuthModule } from '../../shared/auth/game-auth.module';
import { CacheModule } from '../../shared/cache/cache.module';
import { BotModule } from '../bot/bot.module';
import { PlayerModule } from '../player/player.module';
import { BattleGateway } from './battle.gateway';
import { ActionExecutorService } from './engine/actions/action-executor.service';
import { AttackAction } from './engine/actions/attack.action';
import { BattleActionFactory } from './engine/actions/battle-action-factory';
import { SelectCoffeemonAction } from './engine/actions/select-coffeemon.action';
import { SwitchAction } from './engine/actions/switch.action';
import { BattlePhaseManager } from './engine/battle-phase-manager.service';
import { BattleViewService } from './engine/battle-view.service';
import { StatusEffectsService } from './engine/effects/status-effects.service';
import { EventManager } from './engine/events/event-manager';
import { BattleValidatorService } from './engine/validation/battle-validator.service';
import { Battle } from './entities/battle.entity';
import { PveGameMode } from './game-modes/pve.game-mode';
import { PvpGameMode } from './game-modes/pvp.game-mode';
import { BattleCreationService } from './services/battle-creation.service';
import { BattleLifecycleService } from './services/battle-lifecycle.service';
import { BattleService } from './services/battles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Battle]),
    GameAuthModule,
    PlayerModule,
    CacheModule,
    BotModule,
  ],
  providers: [
    BattleService,
    BattleValidatorService,
    BattleCreationService,
    BattleLifecycleService,
    BattleViewService,
    BattleGateway,
    BattlePhaseManager,
    BattleActionFactory,
    ActionExecutorService,
    AttackAction,
    SwitchAction,
    SelectCoffeemonAction,
    EventManager,
    PvpGameMode,
    PveGameMode,
    StatusEffectsService,
  ],
  exports: [BattleService, BattleViewService],
})
export class BattlesModule {}
