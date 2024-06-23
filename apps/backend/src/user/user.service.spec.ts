import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.email = email;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      expect(await userService.findByEmail(email)).toBe(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const email = 'test@example.com';
      const error = new Error('some database error');

      jest.spyOn(userRepository, 'findOne').mockRejectedValue(error);

      await expect(userService.findByEmail(email)).rejects.toThrow(
        new InternalServerErrorException('Failed to find user'),
      );
    });
  });
});
