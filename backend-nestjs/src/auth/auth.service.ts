import { Injectable, ConflictException } from '@nestjs/common';
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

  async register(username: string, email: string, password: string) {
    // Verifica se o email já existe
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Valida força da senha
    if (password.length < 8) {
      throw new ConflictException('Password must be at least 8 characters long');
    }

    // Cria o usuário
    const user = await this.usersService.create({
      username,
      email,
      password,
    });

    // Retorna o token de acesso
    return this.login(user);
  }
}
