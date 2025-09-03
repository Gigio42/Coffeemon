import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const user = this.jwtService.verify<JwtPayload>(token);
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
}
