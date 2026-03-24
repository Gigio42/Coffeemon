import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PlayerService } from '../player/player.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { SocialService } from './social.service';

@ApiTags('Social')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('social')
export class SocialController {
  constructor(
    private readonly socialService: SocialService,
    private readonly playerService: PlayerService
  ) {}

  @Get('friends')
  async getFriends(@GetUser('id') userId: number) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.getFriends(player.id);
  }

  @Get('friends/requests')
  async getFriendRequests(@GetUser('id') userId: number) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.getFriendRequests(player.id);
  }

  @Post('friends/request')
  async sendFriendRequest(@GetUser('id') userId: number, @Body() dto: SendFriendRequestDto) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.sendFriendRequest(player.id, dto.uid);
  }

  @Put('friends/request/:id/accept')
  async acceptFriendRequest(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) requestId: number
  ) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.acceptFriendRequest(player.id, requestId);
  }

  @Delete('friends/:id')
  async removeFriend(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) friendshipId: number
  ) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.removeFriend(player.id, friendshipId);
  }

  @Get('conversations')
  async getConversations(@GetUser('id') userId: number) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.getConversations(player.id);
  }

  @Post('conversations')
  async openConversation(
    @GetUser('id') userId: number,
    @Body('friendPlayerId', ParseIntPipe) friendPlayerId: number
  ) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.getOrCreateConversation(player.id, friendPlayerId);
  }

  @Get('conversations/:id/messages')
  async getMessages(@GetUser('id') userId: number, @Param('id') conversationId: string) {
    const player = await this.playerService.findByUserId(userId);
    return this.socialService.getMessages(player.id, conversationId);
  }
}
