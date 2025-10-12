import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RequestWithUser } from '../types/auth.types';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): number | string | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user as JwtPayload;

    if (data) {
      return user?.[data] as string | number;
    }
    return user;
  }
);
