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
    const user = await this.usersService.findOneByLogin(email);

    if (!user) {
      console.warn(`[login] identificador NÃO encontrado: "${email}" (e-mail ou username)`);
      return null;
    }
    const passwordOk = bcrypt.compareSync(password, user.password);
    if (!passwordOk) {
      console.warn(
        `[login] SENHA não confere — user id=${user.id} email gravado="${user.email}" ` +
        `(senha recebida: ${password.length} chars)`,
      );
      return null;
    }
    return user;
  }

  async login(user: { email: string; id: number; role: UserRole }) {
    await this.usersService.updateLastLogin(user.id);
    const payload = { email: user.email, id: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async guest(): Promise<{ access_token: string }> {
    await this.usersService.deleteExpiredGuests();

    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const randomPwd = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const user = await this.usersService.createGuest({
      username: `Trainer_${suffix}`,
      email: `guest_${Date.now()}_${suffix}@coffeemon.tmp`,
      password: randomPwd,
    });

    const payload = { email: user.email, id: user.id, role: user.role, isGuest: true };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async register(username: string, email: string, password: string, termsAccepted?: boolean) {
    // Verifica se o email já existe
    const existingEmail = await this.usersService.findByEmailInsensitive(email);
    if (existingEmail) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Este nome de treinador já está em uso');
    }

    // Valida força da senha
    if (password.length < 8) {
      throw new ConflictException('A senha deve ter pelo menos 8 caracteres');
    }

    // Cria o usuário
    const user = await this.usersService.create({
      username,
      email,
      password,
      termsAcceptedAt: termsAccepted ? new Date() : null,
    });

    // Retorna o token de acesso
    return this.login(user);
  }
}
