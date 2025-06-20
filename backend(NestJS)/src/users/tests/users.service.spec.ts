import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@email.com',
      password: 'password123',
      username: 'Test User',
    };

    it('should create a new user', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const user = { id: 1, ...createUserDto, password: hashedPassword };
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(result).toEqual(user);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOneBy.mockResolvedValue({ email: createUserDto.email } as User);

      await expect(service.create(createUserDto)).rejects.toThrow('Email already exists');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, email: 'test1@test.com', name: 'Test 1' },
        { id: 2, email: 'test2@test.com', name: 'Test 2' },
      ];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, email: 'test1@test.com', name: 'Test 1' };
      mockRepository.findOneBy.mockResolvedValue(user);
      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@test.com', name: 'Test' };
      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOneByEmail('test@test.com');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'Updated Name' };
      const existingUser = { id: 1, email: 'test@test.com', name: 'Test' };
      const updatedUser = { ...existingUser, ...updateUserDto };

      mockRepository.findOneBy.mockResolvedValue(existingUser);
      mockRepository.merge.mockReturnValue(updatedUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, email: 'test@test.com', name: 'Test' };
      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.remove.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
