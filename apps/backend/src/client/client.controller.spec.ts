import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';


import {
  BadRequestException,
  InternalServerErrorException,
  RequestMethod,
} from '@nestjs/common';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;

  const mockClientService = () => ({
    registerClient: jest.fn(),
  });

  const mockCreateClientDto: CreateClientDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password',
  };

  const mockPhotos: Express.Multer.File[] = [
    { filename: 'photo1.jpg' } as Express.Multer.File,
    { filename: 'photo2.jpg' } as Express.Multer.File,
    { filename: 'photo3.jpg' } as Express.Multer.File,
    { filename: 'photo4.jpg' } as Express.Multer.File,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: mockClientService() }],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new client successfully', async () => {
      const mockClient = { ...mockCreateClientDto, id: 1 };
      jest
        .spyOn(service, 'registerClient')
        .mockResolvedValue(mockClient as any);

      const result = await controller.register(mockCreateClientDto, mockPhotos);

      expect(service.registerClient).toHaveBeenCalledWith(
        mockCreateClientDto,
        mockPhotos,
      );
      expect(result).toEqual(mockClient);
    });

    it('should throw BadRequestException if there are not enough photos', async () => {
      const insufficientPhotos: Express.Multer.File[] = [
        { filename: 'photo1.jpg' } as Express.Multer.File,
      ];
      jest.spyOn(service, 'registerClient').mockImplementation(() => {
        throw new BadRequestException('At least 4 photos are required');
      });

      await expect(
        controller.register(mockCreateClientDto, insufficientPhotos),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if there is an error on the server', async () => {
      jest.spyOn(service, 'registerClient').mockImplementation(() => {
        throw new InternalServerErrorException(
          'An error occurred on the server',
        );
      });

      await expect(
        controller.register(mockCreateClientDto, mockPhotos),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('decorators and interceptors', () => {
    it('should have a POST method', () => {
      const route = Reflect.getMetadata(
        'path',
        ClientController.prototype.register,
      );
      const requestMethod = Reflect.getMetadata(
        'method',
        ClientController.prototype.register,
      );

      expect(route).toBe('register');
      expect(requestMethod).toBe(RequestMethod.POST);
    });

    it('should use FilesInterceptor', () => {
      const useInterceptors = Reflect.getMetadata(
        '__interceptors__',
        ClientController.prototype.register,
      );
      expect(useInterceptors).toBeDefined();
    });
  });
});
