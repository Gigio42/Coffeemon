import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameAuthModule } from '../../shared/auth/game-auth.module';
import { CacheModule } from '../../shared/cache/cache.module';
import { BotModule } from '../bot/bot.module';
import { PlayerModule } from '../player/player.module';
import { BattleGateway } from './battle.gateway';
import { BattleService } from './battles.service';
import { AttackAction } from './engine/actions/attack.action';
import { BattleActionFactory } from './engine/actions/battle-action-factory';
import { SwitchAction } from './engine/actions/switch.action';
import { BattleTurnManager } from './engine/battle-turn-manager';
import { StatusEffectsService } from './engine/effects/status-effects.service';
import { EventManager } from './engine/events/event-manager';
import { Battle } from './entities/battle.entity';
import { PveGameMode } from './game-modes/pve.game-mode';
import { PvpGameMode } from './game-modes/pvp.game-mode';

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
    BattleGateway,
    BattleTurnManager,
    EventManager,
    BattleActionFactory,
    AttackAction,
    SwitchAction,
    StatusEffectsService,
    PvpGameMode,
    PveGameMode,
  ],
  exports: [BattleService],
})
export class BattlesModule {}
