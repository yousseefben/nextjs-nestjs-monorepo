// user.service.ts
import { User } from '@backend/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return undefined;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return undefined;
    }

    return user;
  }
}
