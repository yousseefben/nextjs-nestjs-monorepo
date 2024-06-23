import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { PhotoService } from '../photo/photo.service';
import { UserService } from '../user/user.service';
import { CreateClientDto } from './dto/create-client.dto';

describe('ClientService', () => {
  let service: ClientService;
  let clientRepository: Repository<Client>;
  let photoService: PhotoService;
  let userService: UserService;

  const mockClientRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  });

  const mockPhotoService = () => ({
    createPhoto: jest.fn(),
  });

  const mockUserService = () => ({
    findByEmail: jest.fn(),
  });

  const mockClient: Partial<Client> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    avatar: 'default_avatar_url',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        Logger,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository(),
        },
        { provide: PhotoService, useValue: mockPhotoService() },
        { provide: UserService, useValue: mockUserService() },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    clientRepository = module.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
    photoService = module.get<PhotoService>(PhotoService);
    userService = module.get<UserService>(UserService);
  });

  describe('registerClient', () => {
    const createClientDto: CreateClientDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };
    const photos: Express.Multer.File[] = [
      { filename: 'photo1.jpg' } as Express.Multer.File,
      { filename: 'photo2.jpg' } as Express.Multer.File,
      { filename: 'photo3.jpg' } as Express.Multer.File,
      { filename: 'photo4.jpg' } as Express.Multer.File,
    ];

    it('should throw BadRequestException if less than 4 photos are provided', async () => {
      await expect(service.registerClient(createClientDto, [])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email is already in use', async () => {
      userService.findByEmail = jest.fn().mockResolvedValue(mockClient);

      await expect(
        service.registerClient(createClientDto, photos),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if error occurs during hashing password', async () => {
      userService.findByEmail = jest.fn().mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        throw new Error('Error hashing password');
      });

      await expect(
        service.registerClient(createClientDto, photos),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create and save a new client successfully', async () => {
      userService.findByEmail = jest.fn().mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      clientRepository.create = jest.fn().mockReturnValue(mockClient);
      clientRepository.save = jest.fn().mockResolvedValue(mockClient);
      photoService.createPhoto = jest.fn().mockResolvedValue({});

      const result = await service.registerClient(createClientDto, photos);

      expect(clientRepository.create).toHaveBeenCalledWith({
        ...createClientDto,
        password: 'hashedPassword',
        avatar: expect.any(String),
      });
      expect(clientRepository.save).toHaveBeenCalledWith(mockClient);
      expect(photoService.createPhoto).toHaveBeenCalledTimes(photos.length);
      expect(result).toEqual(mockClient);
    });

    it('should throw BadRequestException if error occurs during saving client', async () => {
      userService.findByEmail = jest.fn().mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      clientRepository.create = jest.fn().mockReturnValue(mockClient);
      clientRepository.save = jest
        .fn()
        .mockRejectedValue(new Error('Error saving client'));

      await expect(
        service.registerClient(createClientDto, photos),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if error occurs during saving photos', async () => {
      userService.findByEmail = jest.fn().mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      clientRepository.create = jest.fn().mockReturnValue(mockClient);
      clientRepository.save = jest.fn().mockResolvedValue(mockClient);
      photoService.createPhoto = jest
        .fn()
        .mockRejectedValue(new Error('Error saving photos'));

      await expect(
        service.registerClient(createClientDto, photos),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findClientByEmail', () => {
    it('should throw InternalServerErrorException if client is not found', async () => {
      clientRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.findClientByEmail('john.doe@example.com'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if error occurs during finding client', async () => {
      clientRepository.findOne = jest
        .fn()
        .mockRejectedValue(new Error('Failed to find user'));

      await expect(
        service.findClientByEmail('john.doe@example.com'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
