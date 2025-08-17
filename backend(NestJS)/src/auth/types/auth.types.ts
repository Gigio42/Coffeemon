import { Request } from 'express';
import { Socket } from 'socket.io';
import { User } from '../../ecommerce/users/entities/user.entity';

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export interface SocketWithUser extends Socket {
  data: {
    user?: User;
    playerId?: number;
    [key: string]: any;
  };
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}
