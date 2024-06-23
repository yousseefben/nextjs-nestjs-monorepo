import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { PhotoModule } from './photo/photo.module';
import { validate } from './config/env.validation';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }), // what
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: true,
    }),
    ClientModule,
    UserModule,
    PhotoModule,
    AuthModule,
  ],
  controllers: [],
  providers: [UserModule],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  // }
}
