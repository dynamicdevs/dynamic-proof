import { Injectable } from '@nestjs/common';

import { CertificatesService } from '../certificates/certificates.services';
import { SheetsLib } from '../lib/sheets.lib';
import { GeneratePdf } from './enum';
import { PdfService } from './services/pdf.services';
import { CERTIFICATE_SHEET_NAME } from '@utils';

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
      if (
        certificate.shouldBeGenerated.trim().toUpperCase() === GeneratePdf.YES
      ) {
        certificate.fullName = `${certificate.name} ${certificate.lastname}`;

        this.pdfService.generatePdf(certificate);

        values.push(GeneratePdf.NO);
      } else {
        values.push(null);
      }
    });

    const range = `${CERTIFICATE_SHEET_NAME}!P2`;

    this.sheetsLib.setValues(range, 'COLUMNS', values);
  }
}
