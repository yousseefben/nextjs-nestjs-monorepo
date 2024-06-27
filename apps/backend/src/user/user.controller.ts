import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@backend/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientService } from '@backend/client/client.service';
import { Client } from '@backend/client/client.entity';
import { UserRequest } from './user-request.interface';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@Request() req: UserRequest): Promise<Partial<Client>> {
    const user = await this.clientService.findClientByEmail(req.user.email);

    return user!;
  }
}
