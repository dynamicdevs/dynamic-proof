import { Injectable } from '@nestjs/common';

import { CertificatesService } from '../certificates/certificates.services';
import { CertificateSheetLib } from '../lib/certificateSheet.lib';
import { Conditional, Template } from '../../enum';
import { PdfService } from './services/pdf.services';
import { CERTIFICATE_SHEET_NAME, longDateFormat } from '@utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import nodeHtmlToImage from 'node-html-to-image';

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
        certificate.issueDate = longDateFormat(certificate.issueDate);

        this.pdfService.generatePdfByTemplate(
          certificate,
          Template.HACKATON2022,
          certificate.id
        );

        this.generateJPEG(certificate, Template.HACKATON2022, certificate.id);

        values.push(Conditional.NO);
      } else {
        values.push(null);
      }
    });

    const range = `${CERTIFICATE_SHEET_NAME}!Q2`;

    this.certificateSheetLib.setValues(range, 'COLUMNS', values);
  }

  private async generateJPEG<Type>(
    data: Type,
    template: string,
    filename: string
  ) {
    const templateUrl = `apps/api/src/app/generator/templates/${template}.html`;
    const html = readFileSync(resolve(process.cwd(), templateUrl), 'utf8');

    const options = {
      html: html,
      content: [{ ...data, output: `apps/api/src/outputs/${filename}.png` }],
    };

    const response = await nodeHtmlToImage(options);

    return response;
  }
}
