import { Inject, Injectable } from '@nestjs/common';
import { create } from 'pdf-creator-node';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import config from '@env';
import { ConfigType } from '@nestjs/config';
@Injectable()
export class PdfService {
  private urlBase: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {
    this.urlBase = this.configService.urlBase;
  }

  public async generatePdfByTemplate<Type>(
    data: Type,
    template: string,
    path: string,
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
        urlBase: this.urlBase,
      },
      path: `${path}/${fileName}.pdf`,
      type: '',
    };

    try {
      await create(document, options);
    } catch (err) {
      throw new Error(err);
    }
  }
}
