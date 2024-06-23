import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '@backend/user/dto/login-user.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (user)
      return this.authService.login({ email: user.email!, id: user.id! });
  }
}
