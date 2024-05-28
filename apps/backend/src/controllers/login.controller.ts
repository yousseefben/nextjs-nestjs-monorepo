// login.controller.ts
import { LoginDto } from '@backend/dtos/login.dto';
import { AuthService } from '@backend/services/auth.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('api')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
