import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@backend/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ClientService } from '@backend/client/client.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Request() req: any) {
    console.log('req.user.emai :>> ', req.user);
    const user = await this.clientService.findClientByEmail(req.user.email);
    console.log('user bullshit :>> ', user);

    return user;
  }
}
