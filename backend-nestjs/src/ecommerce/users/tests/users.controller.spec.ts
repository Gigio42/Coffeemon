import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserRole } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password@123',
        username: 'testuser',
      };
      const expectedUser = { id: 1, ...createUserDto, role: UserRole.USER };
      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          email: 'test1@example.com',
          username: 'user1',
          password: 'hashedPassword',
          role: UserRole.USER,
          orders: [],
          player: undefined as any,
        },
      ];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findMe', () => {
    it('should return the currently authenticated user', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        role: UserRole.USER,
        orders: [],
        player: undefined as any,
      };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findMe(userId);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const userId = '1';
      const user: User = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        role: UserRole.USER,
        orders: [],
        player: undefined as any,
      };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(userId);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(+userId);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user and return it', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'updated' };
      const updatedUser: User = {
        id: 1,
        email: 'test@example.com',
        username: 'updated',
        password: 'hashedPassword',
        role: UserRole.USER,
        orders: [],
        player: undefined as any,
      };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(+userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user and return the removed entity', async () => {
      const userId = '1';
      const removedUser = { id: 1, username: 'testuser' };
      mockUsersService.remove.mockResolvedValue(removedUser);

      const result = await controller.remove(userId);

      expect(mockUsersService.remove).toHaveBeenCalledWith(+userId);
      expect(result).toEqual(removedUser);
    });
  });
});
