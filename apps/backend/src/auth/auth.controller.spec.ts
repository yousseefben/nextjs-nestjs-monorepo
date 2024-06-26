import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from '@backend/user/dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const mockLoginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    it('should successfully login a user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue({
        access_token: 'mockAccessToken',
      });

      const result = await controller.login(mockLoginUserDto);

      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        mockLoginUserDto.email,
        mockLoginUserDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
      });
    });
  });
});
