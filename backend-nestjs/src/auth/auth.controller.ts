import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      return { message: 'Email and password are required' };
    }
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid email or password' };
  }

  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    if (!body.username || !body.email || !body.password) {
      return { 
        success: false,
        message: 'Username, email and password are required' 
      };
    }
    
    try {
      const result = await this.authService.register(body.username, body.email, body.password);
      return {
        success: true,
        access_token: result.access_token,
        message: 'User and player created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }
}
