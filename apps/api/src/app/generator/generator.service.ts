import { Inject, Injectable } from '@nestjs/common';

import { CertificatesService } from '../certificates/certificates.services';
import { CertificateSheetLib } from '../lib/certificateSheet.lib';
import { Conditional, Template } from '../../enum';
import { PdfService } from './services/pdf.services';
import { CERTIFICATE_SHEET_NAME, longDateFormat } from '@utils';
import { resolve } from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import QRCode from 'qrcode';
import { Certificate } from '../../models/certificate';
import { ConfigType } from '@nestjs/config';
import config from '@env';

import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

import * as fs from 'fs';
import * as util from 'util';
@Injectable()
export class GeneratorService {
  private websiteUrl: string;
  private azureConnection: string;
  private containerName: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private certificatesService: CertificatesService,
    private pdfService: PdfService,
    private certificateSheetLib: CertificateSheetLib
  ) {
    this.websiteUrl = this.configService.websiteUrl;
    this.azureConnection = this.configService.azureStorageConnection;
    this.containerName = this.configService.containerName;
  }

  public async generateCerficates() {
    const certificates = await this.certificatesService.getCertificatesList();

    const values = await Promise.all(
      certificates.map(async (certificate) => {
        if (
          certificate.shouldBeGenerated !== undefined &&
          certificate.shouldBeGenerated.trim().toLocaleUpperCase() ===
            Conditional.YES
        ) {
          certificate.issueDate = longDateFormat(certificate.issueDate);
          certificate.name = certificate.name.trim().split(' ')[0];
          certificate.lastname = certificate.lastname.trim().split(' ')[0];

          const path = `apps/api/src/outputs/${certificate.eventCode}/${certificate.id}`;

          const storagePath = `${certificate.eventCode}/${certificate.id}`;

          const filename = this.getFilename(certificate);

          const response = await this.generateQR(path, certificate.id);

          if (response) {
            const responseQR = this.upload(path, storagePath, 'code-qr.png');

            if (responseQR) {
              const responsePDF = await this.pdfService.generatePdfByTemplate(
                certificate,
                Template.HACKATON2022,
                path,
                filename
              );

              if (responsePDF)
                this.upload(path, storagePath, `${filename}.pdf`);

              const responseImage = await this.generateImage(
                certificate,
                Template.HACKATON2022,
                path,
                filename
              );

              if (responseImage)
                this.upload(path, storagePath, `${filename}.png`);

              fs.rm(path, { recursive: true }, (err) => {
                if (err) {
                  throw err;
                }
              });
              
              return Conditional.NO;
            }
          }
        }
        return null;
      })
    );

    const range = `${CERTIFICATE_SHEET_NAME}!Q2`;

    this.certificateSheetLib.setValues(range, 'COLUMNS', values);
  }

  private async generateImage<Type>(
    data: Type,
    template: string,
    path: string,
    filename: string
  ) {
    const templateUrl = `apps/api/src/app/generator/templates/${template}.html`;
    const html = fs.readFileSync(resolve(process.cwd(), templateUrl), 'utf8');

    const options = {
      html: html,
      content: [{ ...data, output: `${path}/${filename}.png` }],
    };

    try {
      await nodeHtmlToImage(options);
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  private async generateQR(path: string, value: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
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
    const attendee = `${certificate.name}-${certificate.lastname}`;

    return `${attendee}-${certificate.eventName.trim().replace(/\s/g, '-')}`;
  }

  private getBlobClient(fileName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName
    );
    const blobClient = containerClient.getBlockBlobClient(fileName);
    return blobClient;
  }

  private async upload(
    localPath: string,
    storagePath: string,
    fileName: string
  ) {
    if (fs.existsSync(localPath)) {
      try {
        const readFile = util.promisify(fs.readFile);
        const data = await readFile(`${localPath}/${fileName}`);
        const blobClient = this.getBlobClient(`${storagePath}/${fileName}`);
        await blobClient.uploadData(data);
        return true;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
