import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../ecommerce/users/entities/user.entity';

export const GetUserWs = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const socket = ctx.switchToWs().getClient();
  const user = socket.data.user;
  return data ? user?.[data] : user;
});
