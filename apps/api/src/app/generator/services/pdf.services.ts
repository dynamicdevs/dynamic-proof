import { Injectable } from '@nestjs/common';
import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import { resolve } from 'path';
@Injectable()
export class PdfService {
  public async generatePdfByTemplate<Type>(
    data: Type,
    template: string,
    fileName: string
  ) {
    const templateUrl = `apps/api/src/app/generator/templates/${template}.html`;

    const html = readFileSync(resolve(process.cwd(), templateUrl), 'utf8');

    const options = {
      format: 'A4',
      orientation: 'landscape',
    };

    const document = {
      html: html,
      data: {
        ...data,
      },
      path: `apps/api/src/outputs/${fileName}.pdf`,
      type: '',
    };

    const response = await create(document, options);

    return response;
  }
}
