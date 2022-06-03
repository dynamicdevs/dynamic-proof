import { Injectable } from '@nestjs/common';

import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Certificate } from 'src/models';

@Injectable()
export class PdfService {
  public async generatePdfByTemplate(certificate: Certificate) {
    const templateName =
      certificate.templateName === null
        ? 'default.html'
        : certificate.templateName.trim();

    const templateUrl = `apps/api/src/app/generator/templates/${templateName}.html`;

    const html = readFileSync(resolve(process.cwd(), templateUrl), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'landscape',
    };

    const document = {
      html: html,
      data: {
        attendee: certificate,
      },
      path: `apps/api/src/outputs/${certificate.id}.pdf`,
      type: '',
    };

    const response = await create(document, options);

    return response;
  }
}
