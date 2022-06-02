import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import config from '@env';
import { GeneratorModule } from './generator/generator.module';
import { CertificatesModule } from './certificates/certificates.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        SERVICE_ACCOUNT_EMAIL: Joi.string().required(),
        SERVICE_ACCOUNT_PRIVATE_KEY: Joi.string().required(),
        SPREADSHEET_ID: Joi.string().required(),
      }),
    }),
    GeneratorModule,
    CertificatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
