import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UsersService } from '../../users/users.service';
import { JwtPayload, SocketWithUser } from '../types/auth.types';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<SocketWithUser>();
    const headers = client.handshake.headers as Record<string, string | undefined>;
    const authHeader: string | undefined =
      headers.authorization || (client.handshake.auth?.token as string | undefined);

    if (!authHeader) {
      throw new WsException('No authorization token provided');
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
      throw new WsException('Invalid token format');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findOne(Number(payload.id));

      if (!user) {
        throw new WsException('User not found');
      }

      client.data.user = user;
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      throw new WsException(`Unauthorized: ${errorMessage}`);
    }
  }
}
