import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PlayerModule } from '../player/player.module';
import { BattleGateway } from './battle.gateway';
import { BattleService } from './battles.service';
import { Battle } from './entities/battle.entity';

import { CacheModule } from '../cache/cache.module';
import { AttackAction } from './engine/actions/attack.action';
import { BattleActionFactory } from './engine/actions/battle-action-factory';
import { SwitchAction } from './engine/actions/switch.action';
import { BattleTurnManager } from './engine/battle-turn-manager';
import { StatusEffectsService } from './engine/effects/status-effects.service';
import { EventManager } from './engine/events/event-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Battle]), PlayerModule, AuthModule, CacheModule],
  providers: [
    BattleService,
    BattleGateway,
    BattleTurnManager,
    EventManager,
    BattleActionFactory,
    AttackAction,
    SwitchAction,
    StatusEffectsService,
  ],
  exports: [BattleService, BattleGateway],
})
export class BattlesModule {}
