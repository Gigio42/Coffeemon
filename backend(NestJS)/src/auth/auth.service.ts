import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../ecommerce/users/users.service';
import { UserRole } from '../ecommerce/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  login(user: { email: string; id: number; role: UserRole }) {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}