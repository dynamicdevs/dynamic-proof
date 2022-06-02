import { Injectable } from '@nestjs/common';

import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CertificatesService } from '../certificates/certificates.services';

@Injectable()
export class GeneratorService {
  constructor(private certificatesService: CertificatesService) {}

  public async generatePDF() {
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
    const attendees = await this.certificatesService.getAttendeesList();

    attendees.map((attendee) => {
      if (attendee.shouldBeGenerated === 'SI') {
        attendee.fullName = `${attendee.name} ${attendee.lastname}`;
        const document = {
          html: html,
          data: {
            attendee: attendee,
          },
          path: `apps/api/src/outputs/${attendee.id}.pdf`,
          type: '',
        };
        create(document, options)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }
}
