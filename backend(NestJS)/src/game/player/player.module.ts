import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from '../../ecommerce/users/users.module';
import { CoffeemonModule } from '../coffeemon/coffeemon.module';
import { WsPlayerGuard } from './auth/ws-player.guard';
import { Player } from './entities/player.entity';
import { PlayerCoffeemons } from './entities/playerCoffeemons.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, PlayerCoffeemons]),
    AuthModule,
    UsersModule,
    CoffeemonModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService, WsPlayerGuard],
  exports: [PlayerService, WsPlayerGuard],
})
export class PlayerModule {}
