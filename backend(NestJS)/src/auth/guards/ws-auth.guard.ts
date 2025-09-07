import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UsersService } from '../../ecommerce/users/users.service';
import { JwtPayload, SocketWithUser } from '../types/auth.types';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const socket: SocketWithUser = context.switchToWs().getClient();
      const authHeader = socket.handshake.headers.authorization as string;

      if (!authHeader) {
        throw new WsException('No authorization header');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new WsException('No token provided');
      }

      const payload: JwtPayload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.id);

      if (!user) {
        throw new WsException('User not found');
      }

      socket.data.user = user;
      return true;
    } catch (error) {
      throw new WsException('Authentication failed');
    }
  }
}