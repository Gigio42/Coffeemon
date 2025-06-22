import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { PlayerCoffeemon } from './entities/playercoffeemon.entity';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { CoffeemonModule } from '../coffeemon/coffeemon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, PlayerCoffeemon]),
    UsersModule,
    AuthModule,
    CoffeemonModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
