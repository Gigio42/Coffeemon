import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RequestWithUser } from '../types/auth.types';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        request.user = payload;
      } catch {
        // Token inválido — trata como anônimo, mas permite a requisição
      }
    }

    return true;
  }
}
