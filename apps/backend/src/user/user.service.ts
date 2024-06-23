import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Searching for user with email: ${email}`);

    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user with email ${email}`, error.stack);
      throw new InternalServerErrorException('Failed to find user');
    }
  }
}
