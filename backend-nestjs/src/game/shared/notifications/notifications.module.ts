import { Module } from '@nestjs/common';
import { BattlesModule } from 'src/game/modules/battles/battles.module';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [BattlesModule],
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
