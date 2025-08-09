import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketWithUser } from 'src/auth/types/auth.types';
import { PlayerService } from '../player.service';

@Injectable()
export class WsPlayerGuard implements CanActivate {
  constructor(private readonly playerService: PlayerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: SocketWithUser = context.switchToWs().getClient<SocketWithUser>();
    const user = client.data.user;

    if (!user) {
      throw new WsException('User not authenticated');
    }

    if (client.data.playerId) {
      return true;
    }

    try {
      const player = await this.playerService.findByUserId(user.id);
      if (!player) {
        throw new WsException('Player profile not found for this user.');
      }
      client.data.playerId = player.id;
      return true;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Could not validate player profile.';
      throw new WsException(message);
    }
  }
}
