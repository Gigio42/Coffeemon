import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { SocketWithUser } from '../types/auth.types';

export const GetUserWs = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<SocketWithUser>();
    const user = client.data.user;

    return data ? user?.[data] : user;
  }
);
