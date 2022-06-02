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
    const attendees = await this.certificatesService.getAttendeesList();
    const values = [];
    attendees.map((attendee) => {
      if (attendee.shouldBeGenerated === GeneratePdf.YES) {
        attendee.fullName = `${attendee.name} ${attendee.lastname}`;

        this.pdfService.generatePdf(attendee);

        values.push(GeneratePdf.NO);
      } else {
        values.push(null);
      }
    });

    this.sheetsLib.setValues('Sheet1!P2', 'COLUMNS', values);
  }
}
