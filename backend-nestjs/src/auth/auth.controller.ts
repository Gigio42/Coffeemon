import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuditService } from '../ecommerce/audit/audit.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Req() req: Request) {
    if (!body.email || !body.password) {
      return { message: 'Email and password are required' };
    }
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      const result = await this.authService.login(user);
      void this.auditService.log({
        action: 'user.login',
        userId: user.id,
        targetId: user.id,
        targetType: 'User',
        metadata: { email: body.email },
        ipAddress: req.ip,
      });
      return result;
    }
    void this.auditService.log({
      action: 'user.login_failed',
      userId: null,
      metadata: { email: body.email },
      ipAddress: req.ip,
    });
    return { message: 'Invalid email or password' };
  }

  @Post('guest')
  async guest(@Req() req: Request) {
    const result = await this.authService.guest();
    void this.auditService.log({
      action: 'user.guest_created',
      userId: null,
      metadata: {},
      ipAddress: req.ip,
    });
    return result;
  }

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string; termsAccepted?: boolean },
    @Req() req: Request,
  ) {
    if (!body.username || !body.email || !body.password) {
      return {
        success: false,
        message: 'Username, email and password are required'
      };
    }

    try {
      const result = await this.authService.register(body.username, body.email, body.password, body.termsAccepted);
      void this.auditService.log({
        action: 'user.registered',
        userId: null,
        metadata: { username: body.username, email: body.email, termsAccepted: !!body.termsAccepted },
        ipAddress: req.ip,
      });
      return {
        success: true,
        access_token: result.access_token,
        message: 'User and player created successfully'
      };
    } catch (error) {
      void this.auditService.log({
        action: 'user.register_failed',
        userId: null,
        metadata: { email: body.email, reason: error.message },
        ipAddress: req.ip,
      });
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }
}
