import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PlayerModule } from '../player/player.module';
import { BattleGateway } from './battle.gateway';
import { BattleService } from './battles.service';
import { Battle } from './entities/battle.entity';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Battle]), PlayerModule, AuthModule],
  providers: [BattleService, BattleGateway, MatchmakingService],
  exports: [BattleService, MatchmakingService, BattleGateway],
})
export class BattlesModule {}
