import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';


export async function createApp(): Promise<INestApplication> {
  console.log('Hola soy azure');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  console.log('Hola soy azure - creado');
  await app.init();
  return app;
}
