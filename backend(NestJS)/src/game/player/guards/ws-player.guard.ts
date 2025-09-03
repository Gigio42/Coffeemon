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
      const user = socket.data.user;

      if (!user) {
        throw new WsException('User not authenticated');
      }

      const player = await this.playerService.findByUserId(user.id);
      socket.data.playerId = player.id;

      return true;
    } catch {
      throw new WsException('Player validation failed');
    }
  }
}
