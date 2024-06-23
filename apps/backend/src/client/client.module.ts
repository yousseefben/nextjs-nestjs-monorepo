import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PhotoModule } from '../photo/photo.module';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    PhotoModule,
    forwardRef(() => UserModule),
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
