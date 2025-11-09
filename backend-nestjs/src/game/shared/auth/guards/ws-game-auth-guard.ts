import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { JwtPayload, SocketWithUser } from '../../../../auth/types/auth.types';

@Injectable()
export class WsGameAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const socket: SocketWithUser = context.switchToWs().getClient();

      const authHeader = socket.handshake.headers.authorization;
      const authToken = socket.handshake.auth?.token as string | undefined;

      const token = authToken || authHeader?.replace('Bearer ', '');

      if (!token) {
        throw new WsException('Token not provided');
      }

      const decoded = this.jwtService.verify<JwtPayload>(token);

      const userId = decoded.id;
      if (typeof userId !== 'number') {
        throw new WsException('Invalid user ID in token');
      }

      socket.data.userId = userId;

      return true;
    } catch {
      throw new WsException('Invalid token');
    }
  }
}
