import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('secret') },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized');
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized');
  });
});
