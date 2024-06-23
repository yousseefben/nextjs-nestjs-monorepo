import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    let user;
    try {
      user = await this.userService.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw new InternalServerErrorException('Error finding user');
    }
    user = await this.userService.findByEmail(email);
    if (user?.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn('Invalid credentials');
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: {
    email: string;
    id: number;
  }): Promise<{ access_token: string }> {
    try {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw new InternalServerErrorException(`Login error`);
    }
  }
}
