import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async onModuleInit() {
    const adminUsername = 'ashadmin';
    const adminEmail = 'ashadmin@admin.com';

    const adminExists = await this.userRepository.findOneBy({
      username: adminUsername,
    });

    if (adminExists) {
      console.log(`[UserSeedService] ${adminUsername} already exists. Skipping seeding.`);
      return;
    }
    console.log(`[UserSeedService] ${adminUsername} not found, seeding...`);

    //TODO Não deixar senha hardocoded em produção
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = this.userRepository.create({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await this.userRepository.save(adminUser);
    console.log(
      `[UserSeedService] ${adminUsername}" seeded successfully with email "${adminEmail}".`
    );
  }
}
