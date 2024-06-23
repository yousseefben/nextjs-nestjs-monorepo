import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockAccessToken'),
  };

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    password: '$2b$10$G91Aa1EpgWkS17ZEGaHlhe9FJ9NGBgDZWXjLz5j3CJyZgRPyOQwMm', // bcrypt hash of 'password'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object if credentials are valid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUser.password,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockUserService.findByEmail.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const result = await service.login({ email: 'test@example.com', id: 1 });

      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 1,
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing error');
      });

      await expect(
        service.login({ email: 'test@example.com', id: 1 }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 1,
      });
    });
  });
});
