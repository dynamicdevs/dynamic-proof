import { Injectable } from '@nestjs/common';

import { CertificatesService } from '../certificates/certificates.services';
import { CertificateSheetLib } from '../lib/certificateSheet.lib';
import { Conditional, Template } from '../../enum';
import { PdfService } from './services/pdf.services';
import { CERTIFICATE_SHEET_NAME, formatDate } from '@utils';

@Injectable()
export class GeneratorService {
  constructor(
    private certificatesService: CertificatesService,
    private pdfService: PdfService,
    private certificateSheetLib: CertificateSheetLib
  ) {}

  public async generateCerficates() {
    const certificates = await this.certificatesService.getCertificatesList();
    const values = [];
    certificates.map((certificate) => {
      if (
        certificate.shouldBeGenerated !== undefined &&
        certificate.shouldBeGenerated.trim().toLocaleUpperCase() ===
          Conditional.YES
      ) {
        certificate.issueDate = formatDate(certificate.issueDate);

        this.pdfService.generatePdfByTemplate(
          certificate,
          Template.HACKATON2022,
          certificate.id
        );

        values.push(Conditional.NO);
      } else {
        values.push(null);
      }
    });

    const range = `${CERTIFICATE_SHEET_NAME}!Q2`;

    this.certificateSheetLib.setValues(range, 'COLUMNS', values);
  }
}
