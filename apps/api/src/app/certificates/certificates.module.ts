import { Module } from '@nestjs/common';
import { SheetsLib } from '../lib/sheets.lib';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.services';

@Module({
  controllers: [CertificatesController],
  providers: [CertificatesService, SheetsLib],
  exports: [CertificatesService],
})
export class CertificatesModule {}
