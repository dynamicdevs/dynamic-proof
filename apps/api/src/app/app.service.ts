import { Inject, Injectable } from '@nestjs/common';

import { ConfigType } from '@nestjs/config';
import config from '@env';

@Injectable()
export class AppService {
  private serviceAccountEmail: string;
  private serviceAccountPrivateKey: string;
  private scopes: string[] = [];
  private spreadsheetId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {
    this.serviceAccountEmail = this.configService.serviceAccountEmail;
    this.serviceAccountPrivateKey = decodeURI(
      this.configService.serviceAccountPrivateKey
    );
    this.spreadsheetId = this.configService.spreadsheetId;
    this.scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  }
}
