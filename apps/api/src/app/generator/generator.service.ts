import { Inject, Injectable } from '@nestjs/common';

import { CertificatesService } from '../certificates/certificates.services';
import { CertificateSheetLib } from '../lib/certificateSheet.lib';
import { Conditional, Template } from '../../enum';
import { PdfService } from './services/pdf.services';
import { CERTIFICATE_SHEET_NAME, longDateFormat } from '@utils';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import QRCode from 'qrcode';
import { Certificate } from '../../models/certificate';
import { ConfigType } from '@nestjs/config';
import config from '@env';

@Injectable()
export class GeneratorService {
  private websiteUrl: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private certificatesService: CertificatesService,
    private pdfService: PdfService,
    private certificateSheetLib: CertificateSheetLib
  ) {
    this.websiteUrl = this.configService.websiteUrl;
  }

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

        const path = `apps/api/src/outputs/${certificate.eventCode}/${certificate.id}`;

        const filename = this.getFilename(certificate);

        const response = this.generateQR(path, certificate.id);

        if (response) {
          this.pdfService.generatePdfByTemplate(
            certificate,
            Template.HACKATON2022,
            path,
            filename
          );

          this.generateJPEG(certificate, Template.HACKATON2022, path, filename);

          values.push(Conditional.NO);
        }
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
    path: string,
    filename: string
  ) {
    const templateUrl = `apps/api/src/app/generator/templates/${template}.html`;
    const html = readFileSync(resolve(process.cwd(), templateUrl), 'utf8');

    const options = {
      html: html,
      content: [{ ...data, output: `${path}/${filename}.png` }],
    };

    try {
      await nodeHtmlToImage(options);
    } catch (err) {
      throw new Error(err);
    }
  }

  private async generateQR(path: string, value: string) {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const url = `${this.websiteUrl}/${value}`;

    try {
      await QRCode.toFile(`${path}/code-qr.png`, url);

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  private getFilename(certificate: Certificate) {
    const attendee = `${certificate.name.trim().split(' ')[0]}-${
      certificate.lastname.trim().split(' ')[0]
    }`;

    return `${attendee}-${certificate.eventName.trim().replace(/\s/g, '-')}`;
  }
}
