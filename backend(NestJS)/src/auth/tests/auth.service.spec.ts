import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../ecommerce/users/users.service';
import { UserRole } from '../../ecommerce/users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed_password';

      const mockUser = {
        id: 1,
        email,
        username: 'testuser',
        password: hashedPassword,
        role: UserRole.USER,
      };

      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrong_password';
      const hashedPassword = 'hashed_password';

      const mockUser = {
        id: 1,
        email,
        username: 'testuser',
        password: hashedPassword,
        role: UserRole.USER,
      };

      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: UserRole.USER,
      };

      const token = 'generated_jwt_token';
      mockJwtService.sign.mockReturnValue(token);

      const result = service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        id: user.id,
        role: user.role,
      });
      expect(result).toEqual({ access_token: token });
    });

    it('should include admin role in token payload when user is admin', () => {
      const adminUser = {
        id: 1,
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      const token = 'admin_jwt_token';
      mockJwtService.sign.mockReturnValue(token);

      const result = service.login(adminUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: adminUser.email,
        id: adminUser.id,
        role: adminUser.role,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
