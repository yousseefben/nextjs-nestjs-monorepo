import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import metadata from './metadata';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error: any) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Code demo')
    .setDescription('Demo app login register profile')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  await SwaggerModule.loadPluginMetadata(metadata);
  SwaggerModule.setup('docs', app, document);

  await app.listen(4000);
}
bootstrap();
