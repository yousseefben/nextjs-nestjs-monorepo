import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UserService } from '../user/user.service';
import { PhotoService } from '../photo/photo.service';

const DEFAULT_AVATAR_URL =
  'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg?t=st=1719066564~exp=1719070164~hmac=6486691e3626f039ab35a9da141d38986ff47a6c3315d7755a7b7c679500e1c8&w=900';
@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly photoService: PhotoService,
    private readonly userService: UserService,
  ) {}

  async registerClient(
    createClientDto: CreateClientDto,
    photos: Express.Multer.File[],
  ): Promise<Client> {
    this.logger.log('Starting client registration process...');

    if (!photos || photos.length < 4) {
      throw new BadRequestException([
        {
          property: 'photos',
          message: 'At least 4 photos are required',
        },
      ]);
    }

    const { firstName, lastName, email, password } = createClientDto;

    let existingUser;
    try {
      existingUser = await this.userService.findByEmail(email);
    } catch (error) {
      this.logger.error('Error checking user email', error);
      throw new BadRequestException('Error checking user email');
    }

    if (existingUser) {
      throw new BadRequestException([
        {
          property: 'email',
          message: 'Email already in use',
        },
      ]);
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error('Error hashing password', error);
      throw new BadRequestException('Error hashing password');
    }
    const client = this.clientRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: DEFAULT_AVATAR_URL,
    });

    try {
      await this.clientRepository.save(client);
      this.logger.log('Client saved successfully');
    } catch (error) {
      this.logger.error('Error saving client', error);
      throw new BadRequestException('Error saving client');
    }

    try {
      await Promise.all(
        photos.map((photo) => this.photoService.createPhoto(photo, client)),
      );
      this.logger.log('Photos saved successfully');
    } catch (error) {
      this.logger.error('Error saving photos', error);
      throw new BadRequestException('Error saving photos');
    }

    this.logger.log('Client registration process completed successfully');
    return client;
  }
  async findClientByEmail(email: string): Promise<Partial<Client> | null> {
    this.logger.log(`Searching for client with email: ${email}`);

    try {
      const user = await this.clientRepository.findOne({
        where: { email },
        relations: ['photos'],
      });
      if (!user) throw new InternalServerErrorException('Client not found');
      const { password: _, ...userInfo } = user!;
      return userInfo;
    } catch (error) {
      this.logger.error(`Failed to find user with email ${email}`, error.stack);
      throw new InternalServerErrorException('Failed to find user');
    }
  }
}
