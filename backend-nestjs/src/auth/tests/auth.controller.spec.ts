import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserRole } from '../../ecommerce/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return error message when email is missing', async () => {
      const loginDto = { email: '', password: 'password123' };

      const result = await controller.login(loginDto);

      expect(mockAuthService.validateUser).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Email and password are required' });
    });

    it('should return error message when password is missing', async () => {
      const loginDto = { email: 'test@example.com', password: '' };
      const result = await controller.login(loginDto);
      expect(mockAuthService.validateUser).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Email and password are required' });
    });

    it('should return error message when credentials are invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong' };
      mockAuthService.validateUser.mockResolvedValue(null);
      const result = await controller.login(loginDto);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual({ message: 'Invalid email or password' });
    });

    it('should return access token when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'correct' };
      const user = { id: 1, email: 'test@example.com', role: UserRole.USER };
      const token = { access_token: 'jwt-token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockReturnValue(token);

      const result = await controller.login(loginDto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(token);
    });
  });
});
