import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { CertificatesModule } from '../certificates/certificates.module';
import { PdfService } from './services/pdf.services';
import { SheetsLib } from '../lib/sheets.lib';

@Module({
  imports: [CertificatesModule],
  controllers: [GeneratorController],
  providers: [GeneratorService, PdfService, SheetsLib],
})
export class GeneratorModule {}
