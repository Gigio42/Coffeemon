import { Module } from '@nestjs/common';
import { CoffeemonModule } from '../coffeemon/coffeemon.module';
import { BotPlayerService } from './services/bot-player.service';
import { BotService } from './services/bot.service';
import { RandomStrategy } from './strategies/random.strategy';

@Module({
  imports: [CoffeemonModule],
  providers: [BotService, BotPlayerService, RandomStrategy],
  exports: [BotService, BotPlayerService],
})
export class BotModule {}
