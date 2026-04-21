import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LessThan, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const GUEST_TTL_DAYS = 7;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.usersRepository.findOneBy({ email: createUserDto.email })) {
      throw new ConflictException('Email already exists');
    }
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({ ...createUserDto, password });
    return this.usersRepository.save(user);
  }

  async createGuest(data: { username: string; email: string; password: string }) {
    const password = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      username: data.username,
      email: data.email,
      password,
      isGuest: true,
    });
    return this.usersRepository.save(user);
  }

  async deleteExpiredGuests() {
    const cutoff = new Date(Date.now() - GUEST_TTL_DAYS * 24 * 60 * 60 * 1000);
    await this.usersRepository.delete({ isGuest: true, createdAt: LessThan(cutoff) });
  }

  async updateLastLogin(id: number) {
    await this.usersRepository.update(id, { lastLoginAt: new Date() });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.softRemove(user);
  }
}
