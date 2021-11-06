import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    origin:'http://localhost:3000',
    credentials:true,

  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(7777);
}
bootstrap();
