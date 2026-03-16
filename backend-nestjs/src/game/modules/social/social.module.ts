import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';
import { ChatMessage } from './entities/chat-message.entity';
import { Conversation } from './entities/conversation.entity';
import { Friendship } from './entities/friendship.entity';
import { ContentFilterService } from 'src/game/shared/content-filter/content-filter.service';
import { SocialController } from './social.controller';
import { SocialGateway } from './social.gateway';
import { SocialService } from './social.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, Conversation, ChatMessage, Player]),
    PlayerModule,
    AuthModule,
  ],
  controllers: [SocialController],
  providers: [SocialService, SocialGateway, ContentFilterService],
  exports: [SocialService],
})
export class SocialModule {}
