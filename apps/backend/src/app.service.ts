import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('process.env.DB_PASSWORD :>> ', process.env.DB_PASSWORD);

    return 'Hello World!';
  }
}
