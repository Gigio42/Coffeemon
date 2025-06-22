import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

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
