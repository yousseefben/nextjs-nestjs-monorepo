import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { Photo } from './photo.entity';
import * as stream from 'stream';
import { Client } from '@backend/client/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../../backend/test/helper';

describe('PhotoService', () => {
  let service: PhotoService;
  let photoRepository: Repository<Photo>;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-value'),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoService,
        {
          provide: getRepositoryToken(Photo),
          useFactory: repositoryMockFactory,
        },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PhotoService>(PhotoService);
    photoRepository = module.get(getRepositoryToken(Photo));

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'photo',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      buffer: Buffer.from('mock-data'),
      stream: new stream.Readable(),
      destination: '/tmp',
      filename: 'test.jpg',
      path: '/tmp/test.jpg',
    };
    const mockKey = 'test_key';

    it('should upload file to S3', async () => {
      const mockName = `${mockKey}_${mockFile.originalname}`;
      jest.spyOn(service as any, 's3Upload').mockResolvedValue({});

      const result = await service.uploadFile(mockFile, mockKey);

      expect(result).toEqual(mockName);
      expect(service['s3Upload']).toHaveBeenCalledWith(
        mockFile.buffer,
        mockName,
        mockFile.mimetype,
      );
    });

    it('should throw InternalServerErrorException on S3 upload failure', async () => {
      jest
        .spyOn(service as any, 's3Upload')
        .mockRejectedValue(new Error('S3 upload error'));

      await expect(service.uploadFile(mockFile, mockKey)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(service['s3Upload']).toHaveBeenCalledWith(
        mockFile.buffer,
        expect.any(String),
        mockFile.mimetype,
      );
    });
  });

  describe('createPhoto', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'photo',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      buffer: Buffer.from('mock-data'),
      stream: new stream.Readable(),
      destination: '/tmp',
      filename: 'test.jpg',
      path: '/tmp/test.jpg',
    };
    const mockClient: Client = { id: 1 } as any;

    it('should create a photo entity', async () => {
      const mockName = `client_${mockClient.id}_${mockFile.originalname}`;
      const mockUrl = `https://mock-value.s3.mock-value.amazonaws.com/${mockName}`;
      const mockPhoto: Photo = {
        id: 1,
        name: mockName,
        url: mockUrl,
        client: mockClient,
        createdAt: new Date(),
        updatedAt: new Date(),
        hasId: () => true,
        save: () => Promise.resolve(mockPhoto),
        remove: () => Promise.resolve(mockPhoto),
        softRemove: () => Promise.resolve(mockPhoto),
        recover: () => Promise.resolve(mockPhoto),
        reload: () => Promise.resolve(),
      };

      jest.spyOn(service, 'uploadFile').mockResolvedValue(mockName);
      jest.spyOn(photoRepository, 'create').mockReturnValue(mockPhoto);
      jest.spyOn(photoRepository, 'save').mockResolvedValue(mockPhoto);

      const result = await service.createPhoto(mockFile, mockClient);

      expect(result).toEqual(mockPhoto);
      expect(photoRepository.create).toHaveBeenCalledWith({
        name: mockName,
        url: mockUrl,
        client: mockClient,
      });
      expect(photoRepository.save).toHaveBeenCalledWith(mockPhoto);
    });

    it('should throw InternalServerErrorException on photo creation failure', async () => {
      jest.spyOn(service, 'uploadFile').mockResolvedValue('invalid-name');
      jest.spyOn(photoRepository, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.createPhoto(mockFile, mockClient)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(photoRepository.create).toHaveBeenCalledWith({
        name: expect.any(String),
        url: expect.any(String),
        client: mockClient,
      });
    });
  });
});
