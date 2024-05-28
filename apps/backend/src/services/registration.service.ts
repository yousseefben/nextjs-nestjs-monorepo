// registration.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@backend/entities/user.entity';
import { CreateUserDto } from '@backend/dtos/create-user.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
    photos: Express.Multer.File[],
  ) {
    const { firstName, lastName, email, password } = createUserDto;
    const fullName = `${firstName} ${lastName}`;

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      fullName,
      avatar: 'default_avatar_url', // Set default avatar URL
      photos: photos.map((photo) => photo.path), // Store photo paths
    });

    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }
}
