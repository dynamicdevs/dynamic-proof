import { Injectable } from '@nestjs/common';

import { CertificatesService } from '../certificates/certificates.services';
import { SheetsLib } from '../lib/sheets.lib';
import { GeneratePdf } from './enum';
import { PdfService } from './services/pdf.services';

@Injectable()
export class GeneratorService {
  constructor(
    private certificatesService: CertificatesService,
    private pdfService: PdfService,
    private sheetsLib: SheetsLib
  ) {}

  public async generateCerficates() {
    const certificates = await this.certificatesService.getCertificatesList();
    const values = [];
    certificates.map((certificate) => {
      if (certificate.shouldBeGenerated === GeneratePdf.YES) {
        certificate.fullName = `${certificate.name} ${certificate.lastname}`;

        this.pdfService.generatePdf(certificate);

        values.push(GeneratePdf.NO);
      } else {
        values.push(null);
      }
    });

    this.sheetsLib.setValues('Sheet1!P2', 'COLUMNS', values);
  }
}
