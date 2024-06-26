import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { Client } from '@backend/client/client.entity';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@backend/config/env.validation';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class PhotoService {
  private readonly AWS_S3_BUCKET: string;
  private readonly AWS_REGION: string;
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(PhotoService.name);

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.AWS_S3_BUCKET = this.configService.get<string>('AWS_S3_BUCKET')!;
    this.AWS_REGION = this.configService.get<string>('AWS_REGION')!;
    this.s3Client = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY')!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const { originalname, buffer, mimetype } = file;
    this.logger.log(`Uploading file: ${originalname}`);

    const name = `${key}_${originalname}`;
    try {
      await this.s3Upload(buffer, name, mimetype);
      this.logger.log(`File uploaded successfully: ${name}`);
      return name;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${originalname}`, error.stack);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  private async s3Upload(
    file: Buffer,
    name: string,
    mimetype: string,
  ): Promise<PutObjectCommandOutput> {
    const params: PutObjectCommandInput = {
      Bucket: this.AWS_S3_BUCKET,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      return await this.s3Client.send(command);
    } catch (e) {
      this.logger.error('Error uploading file to S3', e.stack);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }

  async createPhoto(file: Express.Multer.File, client: Client): Promise<Photo> {
    try {
      const namePhoto = await this.uploadFile(file, `client_${client.id}`);
      const url = `https://${this.AWS_S3_BUCKET}.s3.${this.AWS_REGION}.amazonaws.com/${namePhoto}`;
      const photo = this.photoRepository.create({
        name: namePhoto,
        url,
        client,
      });
      return await this.photoRepository.save(photo);
    } catch (error) {
      this.logger.error('Failed to create photo', error.stack);
      throw new InternalServerErrorException('Failed to create photo');
    }
  }
}
