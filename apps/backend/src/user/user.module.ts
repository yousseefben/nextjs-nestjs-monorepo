import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from '@backend/client/client.module';
import { ClientService } from '@backend/client/client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule,
    forwardRef(() => ClientModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
