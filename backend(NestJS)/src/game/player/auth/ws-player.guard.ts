import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketWithUser } from '../../../auth/types/auth.types';
import { PlayerService } from '../player.service';

@Injectable()
export class WsPlayerGuard implements CanActivate {
  constructor(private readonly playerService: PlayerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const socket: SocketWithUser = context.switchToWs().getClient();
      const userId = socket.data.userId;

      if (!userId) {
        throw new WsException('User not authenticated');
      }

      const player = await this.playerService.findByUserId(userId);
      if (!player) {
        throw new WsException('Player not found');
      }

      socket.data.playerId = player.id;

      return true;
    } catch (error) {
      console.error('WsPlayerGuard error:', error);
      throw new WsException('Player validation failed');
    }
  }
}
