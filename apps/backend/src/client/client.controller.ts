import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  MAX_PHOTO_ALLOWED,
  multerOptionsPhoto,
} from '@backend/config/multer.config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterClientDto } from './dto/register-client.dto';

@ApiTags('clients')
@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new client' })
  @ApiBody({ type: RegisterClientDto })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request: Invalid input.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error: An error occurred on the server.',
  })
  @UseInterceptors(
    FilesInterceptor('photos', MAX_PHOTO_ALLOWED, multerOptionsPhoto),
  )
  async register(
    @Body() createClientDto: CreateClientDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.clientService.registerClient(createClientDto, photos);
  }
}
