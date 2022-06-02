import { Injectable } from '@nestjs/common';

import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Attendee } from 'src/models';

@Injectable()
export class PdfService {
  public async generatePdf(attendee: Attendee) {
    const html = readFileSync(
      resolve(
        process.cwd(),
        'apps/api/src/app/generator/templates/hackathon.html'
      ),
      'utf8'
    );

    const options = {
      format: 'A4',
      orientation: 'landscape',
    };

    const document = {
      html: html,
      data: {
        attendee: attendee,
      },
      path: `apps/api/src/outputs/${attendee.id}.pdf`,
      type: '',
    };

    const response = await create(document, options);

    return response;
  }
}
