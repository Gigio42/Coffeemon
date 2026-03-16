import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './game/shared/adapters/redis-io.adapter';

async function bootstrap() {
  // NESTJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // REDIS SOCKET.IO ADAPTER
  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connect();
  app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Coffeemon API')
    .setDescription('E-commerce de Café + Jogo Coffeemon')
    .setVersion('1.0')
    .addTag('ecommerce')
    .addTag('game')
    .addTag('battle')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
