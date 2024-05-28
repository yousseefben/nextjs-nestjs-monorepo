// registration.controller.ts
import { CreateUserDto } from '@backend/dtos/create-user.dto';
import { RegistrationService } from '@backend/services/registration.service';
import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('/register')
  @UseInterceptors(FilesInterceptor('photos', 4))
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.registrationService.registerUser(createUserDto, photos);
  }
}
