import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserRole } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
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
    jest.clearAllMocks();
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

    it('should create and return a new user', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...createUserDto, password: hashedPassword });
      const savedUser = { id: 1, ...createUserDto, password: hashedPassword };
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 1 } as User);
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          email: 'test1@test.com',
          username: 'Test 1',
          password: '123',
          role: UserRole.USER,
          orders: [],
          player: null,
        },
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
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { username: 'Updated Name' };
      const existingUser: User = {
        id: 1,
        email: 'test@test.com',
        username: 'Test',
        password: '123',
        role: UserRole.USER,
        orders: [],
        player: null,
      };
      const expectedUpdatedUser = { ...existingUser, ...updateUserDto };

      mockRepository.findOneBy.mockResolvedValue(existingUser);
      mockRepository.merge.mockImplementation((user, dto) => Object.assign(user, dto));
      mockRepository.save.mockResolvedValue(expectedUpdatedUser);

      const result = await service.update(1, updateUserDto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingUser, updateUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(existingUser);
      expect(result).toEqual(expectedUpdatedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user and return it', async () => {
      const user: User = {
        id: 1,
        email: 'test@test.com',
        username: 'Test',
        password: '123',
        role: UserRole.USER,
        orders: [],
        player: null,
      };
      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.remove.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user to remove is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
